import { useEffect, useState } from 'react';
import { Modal, Form, Card, Button, Alert } from 'react-bootstrap';

import API from '../API';

function AddForm(props) {

    //id state: used just to keep track of questions and relate their answers, it WON'T be used further by the server
    const [id, setId] = useState(0);

    //new form datas: title, questions: [{q1, open, ...params},{q2, open, ...params}, ...]
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([]);

    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        let valid = true;

        if (questions.length === 0) {
            valid = false;
        }

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (!question.open) {
                if (question.min > question.max || question.min > question.options.length || question.max > question.options.length || question.options.length === 0) {
                    valid = false;
                }
                if (question.min === 0 && question.max === 0) {
                    valid = false;
                }
                if (valid)
                    for (let j = 0; j < question.options.length; j++) {
                        if (question.options[j].answer.length === 0) {
                            valid = false;
                        }
                    }
            }
        }

        if (!valid) {
            setError('Check error(s) in the form!');
        } else {
            /* API... post to DB */
            const data = { userId: props.user.id, title: title, questions: questions }

            API.addForm(data);

            API.getFormsById().then(data => props.setForms(data));

            handleClose();
        }

    }

    /*** Component HANDLES ***/

    /**
     * closing modal will clean all states
     */
    const handleClose = () => {
        props.setShowNew(false);
        setQuestions([]);
        setTitle('');
        setError('');
        setId(0);
    }

    /**
     * Add/Delete questions Handles
     */
    const handleAddQuestion = async () => {

        setQuestions(state => {
            let list = [...state];
            list.push({ id: id, title: '', open: true, required: false, min: 0, max: 0, options: [] });
            setId(id + 1);
            return list;
        });
    }

    const handleDeleteQuestion = async (question) => {

        setQuestions(state => {
            let list = [...state];
            list = list.filter(q => q.id !== question.id);
            return list;
        });
    }


    /**
    * Order Handles
    */
    const handleUp = (question) => {

        setQuestions(state => {
            let list = [...state];
            const index = list.findIndex(q => q.id === question);

            if (list[index - 1]) {
                const tmp = list[index];
                list[index] = list[index - 1];
                list[index - 1] = tmp;
            }

            return list;
        });

    }

    const handleDown = (question) => {

        setQuestions(state => {
            let list = [...state];
            const index = list.findIndex(q => q.id === question);

            if (list[index + 1]) {
                const tmp = list[index];
                list[index] = list[index + 1];
                list[index + 1] = tmp;
            }

            return list;
        });

    }

    /**
     * Title Handles
     */
    const handleUpdateQuestionTitle = async (question, title) => {

        setQuestions(state => {
            let list = [...state];
            const index = list.findIndex(q => q.id === question);
            list[index].title = title;
            return list;
        });
    }

    /**
    * Type Handles
    */
    const handleUpdateQuestionType = async (question, value) => {

        setQuestions(state => {
            let list = [...state];
            const index = list.findIndex(q => q.id === question);
            list[index].open = (value === 'false');
            return list;
        });
    }

    /**
    * Required Handles
    */
    const handleUpdateQuestionRequired = async (question, value) => {

        setQuestions(state => {
            let list = [...state];
            const index = list.findIndex(q => q.id === question);
            list[index].required = (value === 'false');
            return list;
        });
    }

    /**
    * Min/Max Handles
    */
    const handleUpdateQuestionMin = async (question, min) => {

        setQuestions(state => {
            let list = [...state];
            const index = list.findIndex(q => q.id === question);
            list[index].min = Number.parseInt(min);

            return list;
        });
    }

    const handleUpdateQuestionMax = async (question, max) => {

        setQuestions(state => {
            let list = [...state];
            const index = list.findIndex(q => q.id === question);
            list[index].max = Number.parseInt(max);

            return list;
        });
    }

    /**
    * Options Handles
    */
    const handleUpdateQuestionOptions = async (question, options) => {

        setQuestions(state => {
            let list = [...state];
            const index = list.findIndex(q => q.id === question);
            list[index].options = options;
            return list;
        });
    }


    /* HANDLES WRAPPER: Contains all handle methods that enables updating the main state (questions) from child components */
    const Handles = { handleAddQuestion, handleDeleteQuestion, handleUp, handleDown, handleUpdateQuestionTitle, handleUpdateQuestionRequired, handleUpdateQuestionType, handleUpdateQuestionMin, handleUpdateQuestionMax, handleUpdateQuestionOptions };

    return (
        <Modal show={props.showNew} onHide={handleClose} backdrop="static"
            keyboard={false} centered size='xl'>
            <Form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>

                <Modal.Header closeButton>
                    <Modal.Title className='new-header new-margin'>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control type='text' required style={{ marginLeft: '10px' }} value={title} onChange={(event) => setTitle(event.target.value)} />
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className='new-margin'>
                    {questions.map((question) => <Question question={question} key={question.id} Handles={Handles} />)}

                    <Button variant='primary' style={{ marginTop: '10px' }} onClick={() => handleAddQuestion()}><strong>+ </strong>Add Question</Button>
                </Modal.Body>
                <Modal.Footer>
                    {error ? <Alert variant='danger'>{error}</Alert> : ''}
                    <Button variant='primary' type='submit' disabled={questions.length === 0}>Save</Button>
                </Modal.Footer>
            </Form>
        </Modal >
    )
}

function Question(props) {

    const [id, setId] = useState(0);

    /* answers contains only the ones used in multiple choice questions 
    *  since we need to add the separately inside "closedanswersdb" table
    */
    const [answers, setAnswers] = useState([]);
    const [multiple, setMultiple] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (answers.length < 10) {
            setErrorMsg('');
        }
    }, [answers.length]);

    /**
     * Answer Handles
     */
    const handleAddAnswer = () => {
        if (answers.length < 10) {
            setAnswers(state => {
                const list = state.slice();
                list.push({ id: id, questionId: props.question.id, answer: '' });
                setId(id + 1);
                props.Handles.handleUpdateQuestionOptions(props.question.id, list);
                return list;
            });
        } else {
            setErrorMsg('You reached the limit of 10 answers!');
        }
    }


    const handleDeleteAnswer = (answerId) => {

        setAnswers(state => {
            let list = [...state];
            list = list.filter(a => a.id !== answerId);
            props.Handles.handleUpdateQuestionOptions(props.question.id, list);
            return list;
        });

    }

    const handleChangeAnswer = (answerId, value) => {

        setAnswers(state => {
            let list = [...state];
            const index = list.findIndex(a => a.id === answerId);
            list[index].answer = value;
            props.Handles.handleUpdateQuestionOptions(props.question.id, list);
            return list;
        });
    }

    const getAnswer = (answerId) => {
        const index = answers.findIndex(a => a.id === answerId);
        return answers[index].answer;
    }


    return (
        <Card className='spacing'>
            <Card.Header as="h5" className='new-card-header'>

                <div>

                    <Form.Label>Question:</Form.Label>
                    <Form.Control type='text' required value={props.question.title} onChange={(event) => props.Handles.handleUpdateQuestionTitle(props.question.id, event.target.value)} />

                    {multiple ? '' : <Form.Check label='Required' defaultChecked={props.question.required} value={props.question.required} onChange={(event) => props.Handles.handleUpdateQuestionRequired(props.question.id, event.target.value)} />}

                </div>

                <div>

                    <Form.Check label='Multiple Choice' value={props.question.open} onChange={(event) => { props.Handles.handleUpdateQuestionType(props.question.id, event.target.value); setMultiple(!multiple) }} />

                    <div style={{ display: 'flex', width: '100%' }}>
                        {multiple ? <>
                            <Form.Label>Min</Form.Label>
                            <Form.Control type='number' min={0} max={props.question.max} value={props.question.min} onChange={(event) => props.Handles.handleUpdateQuestionMin(props.question.id, event.target.value)} required isInvalid={props.question.min > props.question.options.length || props.question.min > props.question.max || (props.question.options.length > 0 && props.question.min === 0 && props.question.max === 0)} style={{ marginLeft: '10px' }} />
                            <Form.Label>Max</Form.Label>
                            <Form.Control type='number' required min={0} max={answers.length} value={props.question.max} onChange={(event) => props.Handles.handleUpdateQuestionMax(props.question.id, event.target.value)} style={{ marginLeft: '10px' }} isInvalid={props.question.max > props.question.options.length || (props.question.options.length > 0 && props.question.min === 0 && props.question.max === 0)} />
                        </> : ''}
                    </div>

                </div>



                <div className='ctrl-btns' style={{ display: 'flex', flexDirection: 'column', height: '100%', alignSelf: 'center' }}>
                    <Button variant='success' className='btn-sm' style={{ width: '40px' }} onClick={() => props.Handles.handleUp(props.question.id)}>&#8593;</Button>
                    <Button variant='danger' className='btn-sm' style={{ width: '40px' }} onClick={() => props.Handles.handleDeleteQuestion(props.question)}>X</Button>
                    <Button variant='success' className='btn-sm' style={{ width: '40px' }} onClick={() => props.Handles.handleDown(props.question.id)}>&#8595;</Button>
                </div>

            </Card.Header>
            <Card.Body>

                {errorMsg ? <Alert variant='danger'>{errorMsg}</Alert> : ''}

                {multiple ? answers.map((answer, key) => <Answer key={answer.id} answer={answer} id={answer.id} handleDeleteAnswer={handleDeleteAnswer} handleChangeAnswer={handleChangeAnswer} getAnswer={getAnswer} />) : <Form.Control type='text' placeholder='Answer will be added here...' disabled />}


                {multiple ? <Button variant='info' style={{ marginTop: '10px' }} onClick={() => handleAddAnswer()}><strong>+ </strong>Answer</Button> : ''}
            </Card.Body>
        </Card >
    )
}

function Answer(props) {
    return (
        <div style={{ display: 'flex', marginTop: '10px' }}>
            <Form.Control type='text' value={props.answer.answer} onChange={(event) => props.handleChangeAnswer(props.id, event.target.value)} placeholder='Please insert the answer here...' isInvalid={!props.answer.answer} />
            <Button variant='danger' className='btn-sm' style={{ width: '40px' }} onClick={() => props.handleDeleteAnswer(props.id)}>X</Button>
        </div>
    )
}

export default AddForm
