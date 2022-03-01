import Mainbar from '../components/Mainbar';
import AddTask from '../components/AddTask';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../API';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NextSevenDays(props) {

    const [allTasks, setAllTasks] = useState('');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const getTasks = async () => {
            const tasks = await API.getNextSevenDaysTasks();
            return tasks;
        };
        props.check();
        getTasks().then((data) => {
            setAllTasks(data)
            setReady(true);
        }).catch(err => {
            console.error(err);
        });
    }, [allTasks.length, props, props.id]);


    return (
        <>
            <Sidebar />

            {props.loggedIn ? '' : <Modal show={true} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>You are not signed in.</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p><Link to='/login'>Click here</Link> to login.</p>
                </Modal.Body>

            </Modal>}

            {ready && props.loggedIn ? <Mainbar tasks={allTasks} originalTasks={allTasks} setTasks={setAllTasks} label={"Next Seven Days"} /> : ''}
            {ready && props.loggedIn ? <div className='my-btn'><AddTask allTasks={allTasks} setAllTasks={setAllTasks} label={"Next Seven Days"} /></div> : ''}

        </>
    )
}

export default NextSevenDays;

