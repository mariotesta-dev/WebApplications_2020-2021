import { iconDelete } from './icons';
import EditTask from './EditTask';
import dayjs from 'dayjs';

function TaskControl(props) {

    const deleteTask = (id, label) => {
        return new Promise((resolve, reject) => {
            fetch(`api/tasks/select/${id}`, {
                method: 'DELETE',
            }).then((response) => {
                if (response.ok) {
                    if (label === 'All') {
                        label = '';
                    } else if (label === 'Today') {
                        const today = dayjs().format('YYYY-MM-DD').toString();
                        label = `date/${today}`;
                    } else {
                        label = label.toLowerCase().replace(/\s/g, '');
                    }
                    fetch(`api/tasks/${label}`)
                        .then(res => res.json())
                        .then(data => props.setTasks(data))
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
        <td>
            <span><EditTask tasks={props.originalTasks} setTasks={props.setTasks} oldTask={props.task} taskKey={props.key} label={props.label} /></span>
            <span style={{ "cursor": "pointer" }} onClick={() => deleteTask(props.task.id, props.label)}>{iconDelete}</span>
        </td>
    )
}

export default TaskControl;
