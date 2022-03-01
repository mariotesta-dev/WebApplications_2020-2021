import './style/Dashboard.css';

import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Table } from 'react-bootstrap';
import API from '../API';
import AddForm from '../components/AddForm';


function Dashboard(props) {

    //state managing forms retrieve from db and their ready status
    const [forms, setForms] = useState([]);
    const [ready, setReady] = useState([]);

    //state managing render of "New Form" Modal component
    const [showNew, setShowNew] = useState(false);

    useEffect(() => {

        let isMounted = true;

        const getUserForms = async () => {
            const forms = await API.getFormsById();
            return forms;
        };

        if (isMounted) {
            getUserForms()
                .then(data => {
                    setForms(data);
                    setReady(true);
                })
                .catch(err => {
                    console.log(err + ": Can't get forms from db.");
                });
        }

        return () => { isMounted = false; setForms([]); }
    }, []);

    return (
        <div className='dashboard'>

            <AddForm showNew={showNew} setShowNew={setShowNew} user={props.user} setForms={setForms} />

            <div className='dash-btn-container'>
                <h3><strong>Your results</strong></h3>
                <Button variant='primary' onClick={() => setShowNew(true)}>Add new Form</Button>
            </div>

            <div className='dash-container'>
                {ready ? forms.map((reply, key) => <FormPanel key={key} reply={reply} />) : ''}

            </div>
        </div>
    )

}

function FormPanel(props) {

    const [show, setShow] = useState(false);
    const [id, setId] = useState('');

    const handleClick = () => {
        setId(props.reply.id);
        setShow(true);
    }

    return (
        <>
            <Results id={id} show={show} setShow={setShow} />
            <Card className='spacing'>
                <Card.Header as="h5">{props.reply.title}</Card.Header>
                <Card.Body>
                    <Card.Title as="h6">Replied <strong>{props.reply.voters} </strong>times</Card.Title>
                    <Card.Text>
                        Click the button below to access the form and see the replies of the users.
                    </Card.Text>
                    <Button variant="primary" onClick={() => handleClick()}>See Results</Button>
                </Card.Body>
            </Card >
        </>
    )
}

function Results(props) {

    /* State where to store results from /api/useranswers and their ready status: formId, name, {replies to questions : questionId, text reply or array of options selected...} */
    const [results, setResults] = useState([]);
    const [ready, setReady] = useState(false);

    /* State to control index of results, this way it's possible to have buttons traveling between answers */
    const [index, setIndex] = useState(0);

    useEffect(() => {

        //show ha anche funzione di dirty, i dati vengono fetchati solo se il Modal è aperto e solo 1 volta
        if (props.show) {
            const getFormResults = async () => {
                const forms = await API.getResults(props.id);
                return forms;
            };

            getFormResults()
                .then(data => {
                    setResults(data);
                    setReady(true);
                })
                .catch(err => {
                    console.log(err + ": Can't get results from db.");
                });
        }

    }, [props.id, props.show]);

    /**
     * Handles functions:
     */

    //to close the Modal
    const handleClose = () => props.setShow(false);

    //increase index or go back to first element if we exceeded length
    const handleNext = () => {
        const newIndex = index + 1;
        if (newIndex < results.length) {
            setIndex(newIndex);
        } else {
            setIndex(0);
        }
    }

    //decrease index or go back to last element if we are below index 0
    const handlePrev = () => {
        const newIndex = index - 1;
        if (newIndex < 0) {
            setIndex(results.length - 1);
        } else {
            setIndex(newIndex);
        }
    }

    return (
        <>
            <Modal show={props.show} onHide={handleClose} centered size='lg'>
                {ready ? <>
                    <Modal.Header closeButton>
                        {ready && results.length > 0 ? <Modal.Title>{results[index].name}</Modal.Title> : ''}
                    </Modal.Header>
                    <Modal.Body>
                        <Table striped bordered>
                            <thead>
                                {ready && results.length > 0 ? <tr>
                                    <th>Question</th>
                                    <th>Answer</th>
                                </tr> : <tr><th>No replies.</th></tr>}
                            </thead>
                            <tbody>
                                {ready && results.length > 0 ? <TableRow results={results[index]} /> : <tr></tr>}
                            </tbody>
                        </Table>
                        <div className='review-btn'>
                            <Button onClick={() => handlePrev()}>Prev</Button>
                            <Button onClick={() => handleNext()}>Next</Button>
                        </div>
                    </Modal.Body>
                </>
                    : ''}


            </Modal>
        </>
    )

}

function TableRow(props) {

    /* State where to store parsed list of replies to questions..*/
    const [replies, setReplies] = useState([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {


        setReplies(JSON.parse(props.results.replies));
        setReady(true);


    }, [props.results.replies, props]);

    return (
        <>
            {ready ? replies.map((reply, key) => <tr key={key}>
                <Question reply={reply} />
                {reply.open ? <td>{reply.text}</td> : <Answer reply={reply} dirty={props.dirty} />}
            </tr>) : <tr></tr>}
        </>
    )
}

function Question(props) {

    const [question, setQuestion] = useState('');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        API.getSingleQuestion(props.reply.questionId).then((data) => {
            setQuestion(data.text);
            setReady(true);
        });

    }, [props.reply.questionId]);

    return (
        <td>
            {ready ? question : ''}
        </td>
    )
}


function Answer(props) {

    const [answers, setAnswers] = useState([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {

        const doStuff = async () => {
            const data = await API.getSingleAnswer(props.reply.options);
            setAnswers(data);
            setReady(true);
        }

        doStuff();


    }, [props.reply.options]);

    return (
        <>
            {props.reply.open ? <td>{props.reply.text}</td> : (ready ? <MultiRow answers={answers} /> : <td></td>)}
        </>
    )
}

function MultiRow(props) {
    return (
        <td>
            {props.answers.map((ans, key) => <li key={key}>{ans.text}</li>)}
        </td>
    )
}

export default Dashboard;