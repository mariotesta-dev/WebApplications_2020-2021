import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Col, Alert } from 'react-bootstrap';
import { useState } from 'react';
import dayjs from 'dayjs';
import API from '../API';


function AddTask(props) {


    const getId = async () => {
        const user = await API.getUserInfo();
        return user.id;
    }


    /* Parametri del form come state */
    const [important, setImportant] = useState(false);
    const [priv, setPriv] = useState(false);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(dayjs());

    /* Per mostrare il Modal con il form */
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false); resetTaskStates(); };
    const handleShow = () => setShow(true);

    /* Validazione del form */
    const [errorMessage, setErrorMessage] = useState('');

    const resetTaskStates = () => {
        setImportant(false);
        setPriv(false);
        setDescription('');
        setDate(dayjs());
        setErrorMessage('');
    }

    async function addNewTask(objectToSend) {

        let label = props.label;

        return fetch('http://localhost:3001/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objectToSend), // Conversion in JSON format
        })
            .then(() => {
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
                    .then(data => props.setAllTasks(data))
            })
            .catch(function (error) {
                console.log('Failed to store data on server: ', error);
            });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        //VALIDATION
        let valid = true;
        if (description === '') {
            setErrorMessage('Please fill the description.');
            valid = false;
        }
        if (dayjs(date).isBefore(dayjs(), 'day') || !dayjs(date).isValid()) {
            valid = false;
            setErrorMessage('Please select a valid date.');
        }
        if (description === '' && (dayjs(date).isBefore(dayjs(), 'day') || !dayjs(date).isValid())) {
            valid = false;
            setErrorMessage('Please fill the description and select a valid date.');
        }
        if (valid) {

            var id = await getId();

            var task = {
                "description": description,
                "important": important,
                "private": priv,
                "deadline": date.format('YYYY-MM-DD'),
                "completed": 0,
                "user": id
            }

            addNewTask(task);

            handleClose();
        }

    };


    return (
        <>
            <Button variant="success" onClick={handleShow}>
                +
        </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                    <Form onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md='12' controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control required type="text" placeholder="Description" value={description} onChange={event => setDescription(event.target.value)} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md='12' controlId="date">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="date" required value={date.format("YYYY-MM-DD")} onChange={event => setDate(dayjs(event.target.value))} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group>
                            <Form.Check label="Important" defaultChecked={important} value={important} onChange={() => setImportant(!important)} />
                            <Form.Check label="Private" defaultChecked={priv} value={priv} onChange={() => setPriv(!priv)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
            </Button>
                    <Button variant="success" type='submit' onClick={handleSubmit}>
                        Add
            </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddTask;