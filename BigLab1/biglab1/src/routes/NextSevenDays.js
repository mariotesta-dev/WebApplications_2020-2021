import Mainbar from '../components/Mainbar';
import AddTask from '../components/AddTask';
import dayjs from 'dayjs';

function NextSevenDays(props) {

    const tasks = props.allTasks.filter(task => task.date.isAfter(dayjs(), 'day') && task.date.isBefore(dayjs().add(7, 'day')));

    return (
        <>
            <Mainbar tasks={tasks} setTasks={props.setAllTasks} originalTasks={props.allTasks} label={"Next 7 Days"} />
            <div className='my-btn'>
                <AddTask tasks={props.tasks} setTasks={props.setTasks} allTasks={props.allTasks} setAllTasks={props.setAllTasks} />
            </div>
        </>
    )
}

export default NextSevenDays;

