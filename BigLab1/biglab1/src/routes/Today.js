import Mainbar from '../components/Mainbar';
import dayjs from 'dayjs';
import AddTask from '../components/AddTask';

function Today(props) {

    const tasks = props.allTasks.filter(task => task.date.isSame(dayjs(), 'day'));

    return (
        <>
            <Mainbar tasks={tasks} setTasks={props.setAllTasks} originalTasks={props.allTasks} label={"Today"} />
            <div className='my-btn'>
                <AddTask tasks={props.tasks} setTasks={props.setTasks} allTasks={props.allTasks} setAllTasks={props.setAllTasks} />
            </div>
        </>
    )
}

export default Today;
