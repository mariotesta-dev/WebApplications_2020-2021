import React, { useEffect, useState } from 'react';
import { Form, FormCheck, Card, Button, Alert } from 'react-bootstrap';
import { useLocation, Link, Redirect } from 'react-router-dom';
import querystring from 'query-string';
import API from '../API';

function CompileForm() {

    //retrieve formId from URL
    const { search } = useLocation();
    const values = querystring.parse(search);
    const formId = values.form;

    //question fetched from database + ready state to avoid rendering before actual fetch succeded
    const [questions, setQuestions] = useState([]);
    const [ready, setReady] = useState(false);

    /* form (survey) data */
    const [name, setName] = useState(''); //nome utilizzatore
    const [isNameSet, setIsNameSet] = useState(false);

    const [tempReplies, setTempReplies] = useState([]); //state di risposte temporaneo 
    const [compiledForm, setCompiledForm] = useState({ formId: formId, name: '', list: [] }); //oggetto che verrà inviato al submit post validazione

    const [errorMsg, setErrorMsg] = useState('');
    const [checkErr, setCheckErr] = useState(false);
    const [done, setDone] = useState(false);

    const setTempArray = (list) => {
        //per ogni domanda, creo un oggetto risposta con campi vuoti all'interno di tempReplies
        for (let i = 0; i < list.length; i++) {
            const question = list[i];

            if (question.open) {
                setTempReplies(state => {
                    const newlist = state.concat({ questionId: question.id, open: true, text: '', required: question.required });
                    return newlist;
                })
            } else {
                setTempReplies(state => {
                    const newlist = state.concat({ questionId: question.id, open: false, min: question.min, max: question.max, options: [] });
                    return newlist;
                })
            }
        }
    }


    //retrieve list of questions from database
    useEffect(() => {

        let isMounted = true;

        const getQuestions = async () => {
            const questions = await API.getQuestionsById(formId);
            return questions;
        };

        getQuestions()
            .then(data => {
                if (isMounted) {
                    setQuestions(data);
                    setTempArray(data);
                    setReady(true);
                }
            })
            .catch(err => {
                console.log(err + ": Can't get forms from db.");
            });

        /* Clean up */
        return () => { isMounted = false; setQuestions([]); };

    }, [formId]);

    /* Quando done===true, triggera sendForm che manda i risultati al db */
    useEffect(() => {
        if (done) {
            API.sendForm(compiledForm);
        }
    }, [done, compiledForm]);

    //check sul nome, se valid -> lascia compilare il questionario e setta il nome all'interno dello stato
    const handleSetName = () => {
        if (name.length === 0) {
            alert('Error: "Insert a name to continue"');
        } else {
            setIsNameSet(true);
            setCompiledForm({ ...compiledForm, name: name });
        }
    }

    //validation dei dati in ingresso, se valid -> POST al db
    const handleSubmit = () => {

        /* validation */
        let valid = true;

        tempReplies.forEach((reply) => {
            if (reply.open) {
                if (reply.text.length > 200) {
                    valid = false;
                }
                if (reply.required && reply.text.length === 0) {
                    valid = false;
                }
            } else {
                if (reply.options.length < reply.min || reply.options.length > reply.max) {
                    valid = false;
                }
            }
        });

        if (valid) {

            setErrorMsg('');
            setCheckErr(false);
            setCompiledForm({ ...compiledForm, list: tempReplies });
            setDone(true);

        } else {
            setCheckErr(true);
            setErrorMsg("Form is either empty or contains error(s)!");
        }
    }


    return (
        <>

            {/*avoid loading page for unknown forms*/ ready && questions.length === 0 ? <Redirect to='/' /> : ''}

            {!done ? '' :
                <div className='completed-overlay'>
                    <h3>Form sent!</h3>
                    <p>Click the button below to go back to the main page.</p>
                    <Button><Link to='/' style={{ color: 'white', textDecoration: 'none' }}>Back to Feed</Link></Button>
                </div>
            }

            <div className='side-form'>

                <Link to='/' className='back-btn'><div>Back to Feed</div></Link>

                <div className='sidefeed-container'>

                    {isNameSet ?

                        <Form>
                            <Form.Text className='text-black'>* Required</Form.Text>
                            {ready ? questions.map((question, key) =>
                                <Question key={key} question={question} tempReplies={tempReplies} setTempReplies={setTempReplies} checkErr={checkErr} />
                            )
                                : ''}

                            <div className='info-box'>
                                <h3>Ciao, <strong>{name}</strong>!</h3>
                                <Button variant='primary' onClick={() => handleSubmit()}>Send</Button>
                                {errorMsg ? <Alert variant='danger' style={{ margin: '10px' }}>{errorMsg}</Alert> : ''}
                            </div>


                        </Form>
                        :
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Form.Label style={{ fontWeight: 'bold' }}>Name:</Form.Label>
                            <Form.Control type='text' required placeholder="Your name" onChange={(event) => setName(event.target.value)}></Form.Control>
                            <Button variant='primary' style={{ width: '60%', margin: '10px' }} onClick={() => handleSetName()}>Start</Button>
                        </div>}


                </div>

            </div>
        </>
    )
}

function Question(props) {

    const [errorMsg, setErrorMsg] = useState('');

    const handleOpenChange = (event, question) => {
        const value = event.target.value;
        props.setTempReplies(state => {
            const list = [...state];
            const index = list.findIndex(reply => reply.questionId === question.id);
            list[index].text = value;

            return list;
        })
    }

    const findValue = (id) => {
        const index = props.tempReplies.findIndex(reply => reply.questionId === id);
        return props.tempReplies[index].text;
    }

    const findOptions = (id) => {
        const index = props.tempReplies.findIndex(reply => reply.questionId === id);
        return props.tempReplies[index].options;
    }

    const handleCloseChange = (question, option) => {
        var list = [...props.tempReplies];
        const index = list.findIndex(reply => reply.questionId === question.id);

        let choices = list[index].options;

        if (choices.includes(option.id)) {
            choices = choices.filter(el => el !== option.id);
        } else {
            choices.push(option.id);
        }

        if (choices.length < question.min || choices.length > question.max) {
            /* SetState */
            props.setTempReplies(state => {
                const list = [...state];
                const index = list.findIndex(reply => reply.questionId === question.id);
                list[index].options = choices;

                return list;
            });
            /* SetError */
            setErrorMsg(`Min: ${question.min}, Max: ${question.max}`);
            return;

        } else {
            props.setTempReplies(state => {
                const list = [...state];
                const index = list.findIndex(reply => reply.questionId === question.id);
                list[index].options = choices;

                return list;
            });
            setErrorMsg(``);
        }
    }

    return (
        <div className='spacing'>
            <Card style={{ width: '50vw' }}>
                <Card.Header as="h5" className='question-header'>{props.question.text + (props.question.open ? (props.question.required ? ` *` : '') : '')}
                    {props.question.open ? '' : <Form.Text className={(findOptions(props.question.id).length < props.question.min || findOptions(props.question.id).length > props.question.max) && props.checkErr ? "text-danger selection-constraints" : "text-muted selection-constraints"}>Choose between {props.question.min} and {props.question.max} options</Form.Text>}
                </Card.Header>

                <Card.Body >

                    {errorMsg ? <Alert variant='danger'>{errorMsg}</Alert> : ''}
                    {props.question.open ?
                        <>
                            <Form.Control type='text' value={findValue(props.question.id)} placeholder='Your reply goes here' onChange={(event) => handleOpenChange(event, props.question)} isInvalid={props.question.required && findValue(props.question.id).length === 0 && props.checkErr}></Form.Control>
                            <Form.Text className={findValue(props.question.id).length > 200 ? "text-danger" : "text-muted"}>
                                {findValue(props.question.id).length}/200
                            </Form.Text>
                        </> :
                        props.question.options.map((option, key) => <FormCheck key={option.id} label={option.text} onChange={() => handleCloseChange(props.question, option)} />)}


                </Card.Body>
            </Card>
        </div>
    )
}

export default CompileForm
