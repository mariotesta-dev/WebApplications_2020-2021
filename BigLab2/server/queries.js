'use strict'

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('tasks.db', (err) => {
    if (err) throw err;
});

// retrieve the list of all the available tasks;
exports.getAllTasks = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE user=?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((task) => ({ id: task.id, description: task.description, important: task.important, private: task.private, deadline: task.deadline, completed: task.completed, user: task.user }));
            resolve(tasks);
        });
    });
};

// retrieve a list of all the tasks that fulfill a given filter (Important, Private)

exports.getImportantTasks = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM tasks WHERE important=1`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((task) => ({ id: task.id, description: task.description, important: task.important, private: task.private, deadline: task.deadline, completed: task.completed, user: task.user }));
            resolve(tasks.filter(t => t.user === userId));
        });
    });
};

exports.getPrivateTasks = (userId) => {

    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM tasks WHERE private=1`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((task) => ({ id: task.id, description: task.description, important: task.important, private: task.private, deadline: task.deadline, completed: task.completed, user: task.user }));
            resolve(tasks.filter(t => t.user === userId));
        });
    });
};

// retrieve a list of all the tasks with a given deadline 

exports.getTasksByDate = (deadline, userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM tasks WHERE user=?`;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((task) => ({ id: task.id, description: task.description, important: task.important, private: task.private, deadline: task.deadline, completed: task.completed, user: task.user }));

            const filteredTasks = tasks.filter((task) => (dayjs(task.deadline).isSame(dayjs(deadline), 'day')));
            resolve(filteredTasks);
        });
    });
};


exports.getNextSevenDaysTasks = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM tasks WHERE user=?`;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((task) => ({ id: task.id, description: task.description, important: task.important, private: task.private, deadline: task.deadline, completed: task.completed, user: task.user }));

            const filteredTasks = tasks.filter((task) => (dayjs(task.deadline).isAfter(dayjs(), 'day') && dayjs(task.deadline).isBefore(dayjs().add(7, 'day'), 'day')));
            resolve(filteredTasks);
        });
    });
};

// retrieve a list of a task given the id

exports.getTaskById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM tasks WHERE id=?`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            const task = { id: row.id, description: row.description, important: row.important, private: row.private, deadline: row.deadline, completed: row.completed, user: row.user };

            resolve(task);
        });
    });
};

exports.retrieveCount = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS count FROM tasks';
        db.get(sql, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

// add given task

exports.addTask = (task) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks(id, description, important, private, deadline, completed, user) VALUES(?, ?, ?, ?, DATE(?), ?, ?)';
        db.run(sql, [task.id, task.description, task.important, task.priv, task.deadline, task.completed, task.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// update task given id

exports.updateTask = (task) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tasks SET description=? , important=? , private=? , deadline=DATE(?) WHERE id=?';
        db.run(sql, [task.description, task.important, task.priv, task.deadline, task.id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// mark as completed given id

exports.markAsCompletedTask = (task) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tasks SET completed=? WHERE id=?';
        db.run(sql, [task.completed, task.id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// delete task given id 

exports.deleteTask = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM tasks WHERE id=?"
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(null);
        })
    })
}

