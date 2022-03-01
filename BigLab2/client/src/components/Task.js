import dayjs from 'dayjs';

function Task(id, description, important = false, priv, date) {
    this.id = id;
    this.description = description;
    this.important = important;
    this.priv = priv;
    this.date = dayjs(date);
}

function TaskList() {

    this.list = [];

    this.add = (id, description, important, priv, date) => {
        const task = new Task(id, description, important, priv, date);
        this.list.push(task);
    }
}

export { Task, TaskList };