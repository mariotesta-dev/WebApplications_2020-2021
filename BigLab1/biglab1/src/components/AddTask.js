import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Col, Alert } from 'react-bootstrap';
import { useState } from 'react';
import dayjs from 'dayjs';
import { Task } from './Task';


function AddTask(props) {
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

    const handleSubmit = (event) => {
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
            const task = new Task(description, important, priv, date);
            // Aggiorno la lista di cui tengo traccia 
            props.setAllTasks([...props.allTasks, task]);

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