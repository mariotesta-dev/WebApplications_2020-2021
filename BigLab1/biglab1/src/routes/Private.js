import Mainbar from '../components/Mainbar';
import AddTask from '../components/AddTask';

function Private(props) {

    const tasks = props.allTasks.filter(task => task.priv === true);

    return (
        <>
            <Mainbar tasks={tasks} setTasks={props.setAllTasks} originalTasks={props.allTasks} label={"Private"} />
            <div className='my-btn'>
                <AddTask tasks={props.tasks} setTasks={props.setTasks} allTasks={props.allTasks} setAllTasks={props.setAllTasks} />
            </div>
        </>
    )
}

export default Private;
