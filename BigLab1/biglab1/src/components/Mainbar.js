import { Col, Table } from 'react-bootstrap';
import TaskControl from './TaskControl';
//import userexample from '../userexample.jpg';
import user from '../priv-user.svg'

function Mainbar(props) {
    return (
        <Col className='main-bar col-8 p-2'>
            <h1>{props.label}</h1>
            <TaskTable tasks={props.tasks} setTasks={props.setTasks} originalTasks={props.originalTasks} />
        </Col>
    )
}

function TaskTable(props) {

    return (
        <Table className="table">
            <tbody>
                {
                    props.tasks.map((task, index) => {
                        return (<TableRow task={task} key={index} tasks={props.tasks} setTasks={props.setTasks} originalTasks={props.originalTasks} />)
                    })
                }
            </tbody>
        </Table>
    )
}

function TableRow(props) {
    return (

        <tr>
            <td className={props.task.important ? 'text-danger' : ""}><input type='checkbox' /> {props.task.description}</td>
            {props.task.priv ? <td><img src={user} alt='priv' /></td> : <td></td>}
            <td className="text-right">
                <small>{props.task.date.format('DD/MM/YYYY')}</small>
            </td>
            <TaskControl originalTasks={props.originalTasks} task={props.task} tasks={props.tasks} setTasks={props.setTasks} key={props.key} />
        </tr>
    )
}

export default Mainbar;


