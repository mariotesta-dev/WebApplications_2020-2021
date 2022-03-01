import '../App.css';
import Mainbar from '../components/Mainbar';
import AddTask from '../components/AddTask';

function All(props) {

    return (
        <>
            <Mainbar tasks={props.allTasks} originalTasks={props.allTasks} setTasks={props.setAllTasks} label={"All"} />
            <div className='my-btn'>
                <AddTask allTasks={props.allTasks} setAllTasks={props.setAllTasks} />
            </div>
        </>
    )
}

export default All
