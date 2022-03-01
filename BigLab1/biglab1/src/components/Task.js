import dayjs from 'dayjs';

function Task(description, important = false, priv, date) {
    this.description = description;
    this.important = important;
    this.priv = priv;
    this.date = dayjs(date);
}

function TaskList() {

    this.list = [];

    this.add = (description, important, priv, date) => {
        const task = new Task(description, important, priv, date);
        this.list.push(task);
    }
}

export { Task, TaskList };