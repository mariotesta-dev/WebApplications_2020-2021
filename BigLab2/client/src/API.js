/**
 * API for authentication calls
 */

import dayjs from "dayjs";

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
 * All the API calls for tasks
 */


async function getAllTasks() {
    // call: GET /api/tasks
    const response = await fetch(BASEURL + '/tasks');
    const tasksJson = await response.json();
    if (response.ok) {
        return tasksJson;
    } else {
        throw tasksJson;
    }
}

async function getImportantTasks() {
    // call: GET /api/tasks
    const response = await fetch(BASEURL + '/tasks/important');
    const tasksJson = await response.json();
    if (response.ok) {
        return tasksJson;
    } else {
        throw tasksJson;
    }
}

async function getTodayTasks() {
    // call: GET /api/tasks
    const response = await fetch(BASEURL + '/tasks/date/' + dayjs().format('YYYY-MM-DD').toString());
    const tasksJson = await response.json();
    if (response.ok) {
        return tasksJson;
    } else {
        throw tasksJson;
    }
}

async function getNextSevenDaysTasks() {
    // call: GET /api/tasks
    const response = await fetch(BASEURL + '/tasks/nextsevendays');
    const tasksJson = await response.json();
    if (response.ok) {
        return tasksJson;
    } else {
        throw tasksJson;
    }
}


async function getPrivateTasks() {
    // call: GET /api/tasks
    const response = await fetch(BASEURL + '/tasks/private');
    const tasksJson = await response.json();
    if (response.ok) {
        return tasksJson;
    } else {
        throw tasksJson;
    }
}


const API = { logIn, logOut, getUserInfo, getAllTasks, getImportantTasks, getNextSevenDaysTasks, getPrivateTasks, getTodayTasks };
export default API;