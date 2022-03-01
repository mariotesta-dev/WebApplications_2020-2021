import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Col, Alert } from 'react-bootstrap';
import { useState } from 'react';
import dayjs from 'dayjs';
import { iconEdit } from './icons';


function EditTask(props) {

    /* Parametri del form come state */
    const [important, setImportant] = useState(props.oldTask.important);
    const [priv, setPriv] = useState(props.oldTask.private);
    const [description, setDescription] = useState(props.oldTask.description);
    const [date, setDate] = useState(dayjs(props.oldTask.deadline));

    /* Per mostrare il Modal con il form */
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false); resetTaskStates(); };
    const handleShow = () => setShow(true);

    /* Validazione del form */
    const [errorMessage, setErrorMessage] = useState('');

    const resetTaskStates = () => {
        setErrorMessage('');
    }

    const editTask = (id, label, updatedTask) => {
        return new Promise((resolve, reject) => {
            fetch(`api/tasks/select/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            }).then((response) => {
                if (response.ok) {
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
                        .then(data => props.setTasks(data))
                } else {
                    // analyze the cause of error
                    response.json()
                        .then((message) => { reject(message); }) // error message in the response body
                        .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
        });
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

            var updatedTask = {
                "id": props.oldTask.id,
                "description": description,
                "important": important,
                "deadline": date.format('YYYY-MM-DD'),
                "private": priv
            }

            editTask(props.oldTask.id, props.label, updatedTask);

            handleClose();
        }

    };




    return (
        <>
            <span style={{ "cursor": "pointer" }} onClick={handleShow}>{iconEdit}</span>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                    <Form onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md='12' controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control required type="text" value={description} onChange={event => setDescription(event.target.value)} />
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
                        Edit
            </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditTask;