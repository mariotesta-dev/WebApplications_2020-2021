import '../App.css';
import Mainbar from '../components/Mainbar';
import Sidebar from '../components/Sidebar';
import AddTask from '../components/AddTask';
import { useEffect, useState } from 'react';
import API from '../API';

function All(props) {

    const [allTasks, setAllTasks] = useState('');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const getTasks = async () => {
            const tasks = await API.getAllTasks();
            return tasks;
        };
        props.check();
        getTasks().then((data) => {
            setAllTasks(data)
            setReady(true);
        }).catch(err => {
            console.error(err);
        });
    }, [allTasks.length, props.id, props]);


    return (
        <>
            <Sidebar />
            {ready ? <Mainbar tasks={allTasks} originalTasks={allTasks} setTasks={setAllTasks} label={"All"} /> : ''}
            {ready ? <div className='my-btn'><AddTask allTasks={allTasks} setAllTasks={setAllTasks} label={"All"} /></div> : ''}

        </>
    )
}

export default All
