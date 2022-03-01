import Mainbar from '../components/Mainbar';
import AddTask from '../components/AddTask';

function Important(props) {

    const tasks = props.allTasks.filter(task => task.important === true);

    return (
        <>
            <Mainbar tasks={tasks} setTasks={props.setAllTasks} originalTasks={props.allTasks} label={"Important"} />
            <div className='my-btn'>
                <AddTask allTasks={props.allTasks} setAllTasks={props.setAllTasks} />
            </div>
        </>
    )
}

export default Important;
