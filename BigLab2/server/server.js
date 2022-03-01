'use strict'

const express = require('express');
const morgan = require('morgan');
const queries = require('./queries.js');
const { check, validationResult } = require('express-validator');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // local strategy (username, password)
const session = require('express-session');
const userDao = require('./user-dao');

passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user);
        }).catch(err => {
            done(err, null);
        });
});

// express initialization 
const PORT = 3001;
const app = new express();
app.use(cors());

//middlewares
app.use(morgan('dev'));
app.use(express.json());

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated) {
        return next();
    }
    return res.status(401).json({ error: 'not authenticated' });
}

app.use(session({
    secret: 'foo',
    resave: false,
    saveUninitialized: false
}));
// then, init passport
app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));


// GET (All) 
app.get('/api/tasks', isLoggedIn, async (req, res) => {
    queries.getAllTasks(req.user.id)
        .then(tasks => res.json(tasks))
        .catch(() => res.status(500).end());
}
)

/* GET (Important or Private) */
app.get('/api/tasks/important', isLoggedIn, (req, res) => {
    queries.getImportantTasks(req.user.id)
        .then(tasks => res.json(tasks))
        .catch(() => res.status(500).end());
})

app.get('/api/tasks/private', isLoggedIn, (req, res) => {
    queries.getPrivateTasks(req.user.id)
        .then(tasks => res.json(tasks))
        .catch(() => res.status(500).end());
})

/* GET (by deadline, we use it for Today filter) */
app.get('/api/tasks/date/:deadline', isLoggedIn, (req, res) => {
    queries.getTasksByDate(req.params.deadline, req.user.id)
        .then(tasks => res.json(tasks))
        .catch(() => res.status(500).end());
})

app.get('/api/tasks/nextsevendays', isLoggedIn, (req, res) => {
    queries.getNextSevenDaysTasks(req.user.id)
        .then(tasks => res.json(tasks))
        .catch(() => res.status(500).end());
})


/* GET (by id) */
app.get('/api/tasks/select/:id', (req, res) => {
    queries.getTaskById(req.params.id)
        .then(tasks => res.json(tasks))
        .catch(() => res.status(500).end());
})

/* ADD NEW TASK TO DB */
app.post('/api/tasks', [
    check('deadline').isDate({ format: 'YYYY-MM-DD', strictMode: true })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const id = queries.retrieveCount();
    id.then(data => {

        var counter = data.count + 3;

        try {
            const task = {
                id: counter,
                description: req.body.description,
                important: req.body.important,
                priv: req.body.private,
                deadline: req.body.deadline,
                completed: 0,
                user: req.body.user
            }

            console.log(task);

            queries.addTask(task);
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: "Can't add task to database. " })
        }
    })
});

app.put('/api/tasks/select/:id', [
    check('deadline').isDate({ format: 'YYYY-MM-DD', strictMode: true })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    req.params.id = parseInt(req.params.id);

    const task = {
        id: req.params.id,
        description: req.body.description,
        important: req.body.important,
        priv: req.body.private,
        deadline: req.body.deadline,
    }

    try {
        await queries.updateTask(task);
        res.status(200).end();
    } catch (err) {
        res.status(503).json({ error: "Can't update the task. " })
    }
});


app.put('/api/tasks/completed/:id', async (req, res) => {

    req.params.id = parseInt(req.params.id);

    const task = {
        id: req.params.id,
        completed: req.body.completed,
    }

    console.log(task);

    try {
        await queries.markAsCompletedTask(task);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: "Can't change completed value." })
    }
});

app.delete('/api/tasks/select/:id', async (req, res) => {
    try {
        await queries.deleteTask(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the deletion of task ${req.params.id}.` });
    }
})

/*** Users APIs ***/

// Login -> POST /sessions 
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

// Logout -> DELETE /sessions/current 
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});

// isAuth or not -> GET /sessions/current
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });;
});






