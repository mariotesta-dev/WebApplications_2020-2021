import { iconDelete } from './icons';
import EditTask from './EditTask';

function TaskControl(props) {

    const deleteTask = () => {
        props.setTasks(props.originalTasks.filter(task => task !== props.task));
    }

    return (
        <td>
            <span><EditTask tasks={props.originalTasks} setTasks={props.setTasks} oldTask={props.task} taskKey={props.key} /></span>
            <span style={{ "cursor": "pointer" }} onClick={() => deleteTask()}>{iconDelete}</span>
        </td>
    )
}

export default TaskControl;
