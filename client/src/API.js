const BASEURL = '/api';

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user.name;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch(BASEURL + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;
    }
}

/**
 * Forms APIs
 */

/* Get list of ALL FORMS present in the db */
async function getAllForms() {
    const res = await fetch('api/forms');
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        throw data;
    }
}

/* Get Questions given the FORM ID */
async function getQuestionsById(id) {
    const res = await fetch(`api/questions/${id}`);
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        throw data;
    }
}

/* Get Answers given the QUESTION ID */
async function getAnswersById(id) {
    const res = await fetch(`api/closedanswers/${id}`);
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        throw data;
    }
}

/* send user compiled form to db */
async function sendForm(data) {
    return new Promise((resolve, reject) => {
        fetch('api/useranswers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

/* Retrieve results of a form given its id -> Admin use only */
async function getResults(formId) {
    const res = await fetch(`api/useranswers/${formId}`);
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        throw data;
    }
}

async function getFormsById() {
    const res = await fetch(`api/adminforms`);
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        throw data;
    }
}

/* Get Question information given its id -> used when retrieving results */
async function getSingleQuestion(id) {
    const res = await fetch(`api/question/${id}`);
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        throw data;
    }
}


/* Get Answer information given its id -> used when retrieving results */
async function getSingleAnswer(options) {

    return Promise.all(options.map(async (option) => {

        const res = await fetch(`api/answer/${option}`);
        const data = await res.json();

        return data;

    }));
}

/* add new form made my admins */
async function addForm(data) {
    return new Promise((resolve, reject) => {
        fetch('api/forms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                resolve({ status: true, message: 'Form was added successfully!' });
            } else {
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}


const API = { logIn, logOut, getUserInfo, getAllForms, getQuestionsById, getAnswersById, sendForm, getResults, getFormsById, getSingleQuestion, getSingleAnswer, addForm };

export default API;