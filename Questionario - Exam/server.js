"use strict";
const express = require("express");
const morgan = require("morgan");
const { check, validationResult } = require("express-validator");
//const cors = require('cors'); //just in case react development proxy doesn't work -> known issue #1378 create-react-app
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const formsDao = require("./forms-dao");
const userDao = require("./user-dao");

/**
 * Setting up Passport using a Local Strategy, which requires username/password fields.
 */
passport.use(
	new LocalStrategy((username, password, done) => {
		userDao.getUser(username, password).then((user) => {
			if (!user)
				return done(null, false, {
					message: "Incorrect email and/or password.",
				});

			return done(null, user);
		});
	})
);

/**
 * Serialize user: we serialize its id and store it in the session
 */
passport.serializeUser((user, done) => {
	done(null, user.id);
});

/**
 * De-serialize user: we extract the current user from the session data
 */
passport.deserializeUser(async (id, done) => {
	userDao
		.getUserById(id)
		.then((user) => {
			done(null, user); //user will go straight to req.user to be used after firing isLoggedIn
		})
		.catch((err) => {
			done(err, null);
		});
});

/** EXPRESS INIT **/
const app = new express();
const PORT = process.env.PORT || 3001;
//app.use(cors());

/** MIDDLEWARE **/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("./client/build"));

/** CUSTOM MIDDLEWARE to authorize a request **/
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();

	return res.status(401).json({
		error: "Unauthorized (!isLoggedIn): please check user authentication.",
	});
};

/**
 * Setting up session and then passport: [BEWARE] -> Order is important
 */
app.use(
	session({
		secret: "mariotesta-dev",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());

// Activate the server
app.listen(PORT, () => {
	console.log(`Questionario-server listening at http://localhost:${PORT}`);
});

/*
 *  Data APIs
 */

// GET /api/forms : retrieve all the forms (questionnaires) from the database to be shown to the user (in FEED component)
app.get("/api/forms", (req, res) => {
	formsDao
		.getAllForms()
		.then((forms) => res.json(forms))
		.catch(() => res.status(500).end());
});

// GET /api/questions : retrieve all the questions and relative answers for a single form given its code
app.get("/api/questions/:code", async (req, res) => {
	try {
		const questions = await formsDao.getFormQuestions(req.params.code);

		Promise.all(
			questions.map(async (question) => {
				if (!question.open) {
					const answers = await formsDao.getClosedAnswers(question.id);
					question.options = [...answers];
				}
				return question;
			})
		)
			.then((data) => res.json(data))
			.catch(() => res.status(500).end());
	} catch (err) {
		// this catches error if getFormQuestions() doesn't work for some reason, while the Promise.all() catches by itself.
		res.status(500).end();
	}
});

/**
 * HTTP Requests to "Retrieve Results"
 */

app.get("/api/question/:id", async (req, res) => {
	formsDao
		.getQuestion(req.params.id)
		.then((forms) => res.json(forms))
		.catch(() => res.status(500).end());
});

app.get("/api/answer/:id", async (req, res) => {
	formsDao
		.getAnswer(req.params.id)
		.then((forms) => res.json(forms))
		.catch(() => res.status(500).end());
});

// GET /api/closedanswers : retrieve the closed answers for the (closed)question given its code
app.get("/api/closedanswers/:code", async (req, res) => {
	await formsDao
		.getClosedAnswers(req.params.code)
		.then((data) => res.json(data))
		.catch(() => res.status(500).end());
});

// GET /api/adminforms : retrieve ONLY forms made by admin given its id
app.get("/api/adminforms", isLoggedIn, async (req, res) => {
	await formsDao
		.getAllFormsById(req.user.id)
		.then((data) => res.json(data))
		.catch(() => res.status(500).end());
});

// GET /api/useranswers
app.get("/api/useranswers/:formId", isLoggedIn, async (req, res) => {
	await formsDao
		.getRepliesByFormId(req.user.id, req.params.formId)
		.then((data) => res.json(data))
		.catch(() => res.status(500).end());
});

// POST /api/useranswers
app.post(
	"/api/useranswers",
	[
		check("name").isString(),
		check("formId").isString(), //it should be a number but it's actually being passed as a string
		/* ...more validation is always needed */
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const name = req.body.name;
		const formId = Number.parseInt(req.body.formId);
		const json = JSON.stringify(req.body.list);

		try {
			await formsDao.addReply(name, formId, json);
			await formsDao.updateFormVotes(formId);
			res.status(201).end();
		} catch (err) {
			res.status(503).json({
				error: `Database error during the creation of form reply ${formId} by ${name}.`,
			});
		}
	}
);

// POST /api/forms
app.post(
	"/api/forms",
	isLoggedIn,
	[
		check("title").isString(),
		check("questions").isArray(),
		/* ...more validation is always needed */
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const userId = Number.parseInt(req.user.id);
		const title = req.body.title;
		const questions = req.body.questions;

		try {
			const formId = await formsDao.addNewForm(userId, title);

			//for..of loop works good with async/await and allow to visit the array elements by increasing index

			for (const question of questions) {
				if (question.open) {
					await formsDao.addOpenQuestion(question, formId);
				} else {
					const questionId = await formsDao.addCloseQuestion(question, formId);

					for (const option of question.options) {
						await formsDao.addCloseAnswer(option, questionId);
					}
				}
			}
		} catch (err) {
			res.status(503).json({ error: "Database error while adding new form." });
		}
	}
);

/*** Users APIs ***/

// POST /sessions
// login
app.post("/api/sessions", function (req, res, next) {
	passport.authenticate("local", (err, user, info) => {
		if (err) return next(err);
		if (!user) {
			return res.status(401).json(info);
		}
		// success, proceed firing login
		req.login(user, (err) => {
			if (err) return next(err);

			//req.user is coming from userDao.getUser() and contains the authenticated user
			return res.json(req.user);
		});
	})(req, res, next);
});

// DELETE /sessions/current
// logout
app.delete("/api/sessions/current", (req, res) => {
	req.logout();
	res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get("/api/sessions/current", (req, res) => {
	if (req.isAuthenticated()) {
		res.status(200).json(req.user);
	} else res.status(401).json({ error: "Unauthenticated user!!" });
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});
