import { Col, Table } from 'react-bootstrap';
import TaskControl from './TaskControl';
//import userexample from '../userexample.jpg';
import user from '../priv-user.svg'
import dayjs from 'dayjs';
import { useState } from 'react';

function Mainbar(props) {
    return (
        <Col className='main-bar col-8 p-2'>
            <h1>{props.label}</h1>
            {(props.tasks.length > 0) ? <TaskTable tasks={props.tasks} setTasks={props.setTasks} originalTasks={props.originalTasks} label={props.label} /> : <p>No tasks found.</p>}
        </Col>
    )
}

function TaskTable(props) {

    return (
        <Table className="table">
            <tbody>
                {
                    props.tasks.map((task, index) => {
                        return (<TableRow task={task} key={index} tasks={props.tasks} setTasks={props.setTasks} originalTasks={props.originalTasks} label={props.label} />)
                    })
                }
            </tbody>
        </Table>
    )
}

function TableRow(props) {

    const [completed, setCompleted] = useState(() => {
        if (props.task.completed === 0) {
            return false;
        } else {
            return true;
        }
    });

    const isCompleted = async (label) => {

        return new Promise(async (resolve, reject) => {

            await fetch(`api/tasks/completed/${props.task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'completed': !completed }),
            }).then((response) => {
                if (response.ok) {
                    if (label === 'All') {
                        label = '';
                    }
                    else if (label === 'Today') {
                        const today = dayjs().format('YYYY-MM-DD').toString();
                        label = `date/${today}`;
                    }
                    else {
                        label = label.toLowerCase().replace(/\s/g, '');
                    }
                    fetch(`api/tasks/${label}`)
                        .then(res => res.json())
                        .then(data => props.setTasks(data));

                    setCompleted(!completed);
                } else {
                    // analyze the cause of error
                    response.json()
                        .then((message) => { reject(message); }) // error message in the response body
                        .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
        });
    }

    return (

        <tr>
            <td className={props.task.important ? 'text-danger' : ""}><input type='checkbox' defaultChecked={props.task.completed} value={props.task.completed} onChange={() => { isCompleted(props.label) }} /> {props.task.description}</td>
            {props.task.private ? <td><img src={user} alt='priv' /></td> : <td></td>}
            <td className="text-right">
                <small>{dayjs(props.task.deadline).format('DD/MM/YYYY')}</small>
            </td>
            <TaskControl originalTasks={props.originalTasks} task={props.task} tasks={props.tasks} setTasks={props.setTasks} key={props.key} label={props.label} />
        </tr>
    )
}

export default Mainbar;


