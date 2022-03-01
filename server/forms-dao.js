'use strict';

const db = require('./db');

// get list of all forms
exports.getAllForms = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM forms';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const forms = rows.map((form) => ({ id: form.form_id, title: form.title, user: form.user, voters: form.num_of_voters }));
            resolve(forms);
        });
    });
};

// get list of all forms made by given admin (userId)
exports.getAllFormsById = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM forms WHERE user=?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const forms = rows.map((form) => ({ id: form.form_id, title: form.title, user: form.user, voters: form.num_of_voters }));
            resolve(forms);
        });
    });
};

exports.addNewForm = (userid, title) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO forms(title, user) VALUES(?, ?)';
        db.run(sql, [title, userid], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.getQuestion = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM questions WHERE question_id=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) {
                resolve({ error: 'Question not found.' });
            } else {
                const question = { id: row.question_id, text: row.text };
                resolve(question);
            }
        });
    });
}

exports.addOpenQuestion = (question, formId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO questions(text, open, form, required) VALUES(?, ?, ?, ?)';
        db.run(sql, [question.title, question.open, formId, question.required], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.addCloseQuestion = (question, formId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO questions(text, open, form, min, max) VALUES(?, ?, ?, ?, ?)';
        db.run(sql, [question.title, question.open, formId, question.min, question.max], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.addCloseAnswer = (answer, questionid) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO closedanswersdb(text, question_id) VALUES(?, ?)';
        db.run(sql, [answer.answer, questionid], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

// get all questions of a form given its code
exports.getFormQuestions = (form) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM questions WHERE form = ?';

        db.all(sql, [form], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const questions = rows.map((q) => (
                {
                    id: q.question_id,
                    text: q.text,
                    open: q.open,
                    form: q.form,
                    min: q.min,
                    max: q.max,
                    required: q.required
                }));

            resolve(questions);
        });
    });
};


// get closed answers (that needs to be showed) for a question given its code
exports.getClosedAnswers = (question) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM closedanswersdb WHERE question_id = ?';

        db.all(sql, [question], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const answers = rows.map((a) => (
                {
                    id: a.answer_id,
                    text: a.text,
                    question: a.question_id,
                    votes: a.num_of_votes
                }));

            resolve(answers);
        });
    });
};

exports.getAnswer = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM closedanswersdb WHERE answer_id=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) {
                resolve({ error: 'Answer not found.' });
            } else {
                const answer = { text: row.text };
                resolve(answer);
            }
        });
    });
}


// add a new reply
exports.addReply = (name, formId, json) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO useranswers(name, formId, json) VALUES(?, ?, ?)';
        db.run(sql, [name, formId, json], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

exports.updateFormVotes = (formId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE forms SET num_of_voters = num_of_voters+1 WHERE form_id=?';
        db.run(sql, [formId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

// get closed answers (that needs to be shown) for a question given its code
exports.getRepliesByFormId = (userId, formId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM useranswers WHERE formId = ? AND formId IN (SELECT form_id FROM forms WHERE user=?)';

        db.all(sql, [formId, userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const list = rows.map((reply) => (
                {
                    name: reply.name,
                    formId: reply.formId,
                    replies: reply.json
                }));

            resolve(list);
        });
    });
};