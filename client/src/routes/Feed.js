import React from 'react'
import './style/Feed.css';
import { Card, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import API from '../API';

function Feed(props) {

    const [forms, setForms] = useState([]);
    const [ready, setReady] = useState('');


    useEffect(() => {
        let isMounted = true;

        const getForms = async () => {
            const forms = await API.getAllForms();
            return forms;
        };

        getForms()
            .then(data => {
                if (isMounted) {
                    setForms(data);
                    setReady(true);
                }
            })
            .catch(err => {
                console.log(err + ": Can't get forms from db.");
            })
        return () => {
            isMounted = false;
        }
    }, [forms.length])

    return (
        <>
            <div className='feed'>
                <div className='feed-container'>
                    {ready ? forms.map((form, key) => <FormPanel
                        key={key}
                        id={form.id}
                        title={form.title}
                        number={form.voters}
                    />) : ''}
                </div>
            </div>
        </>
    )
}

function FormPanel(props) {

    return (
        <div className='spacing'>
            <Card>
                <Card.Header as="h5">{props.title}</Card.Header>
                <Card.Body>
                    <Card.Title as="h6">Replied <strong>{props.number} </strong>times</Card.Title>
                    <Card.Text>
                        Click the button below to access the form and start filling the replies.
                    </Card.Text>
                    <Link to={{ pathname: "/compile", search: `?form=${props.id}` }}><Button>Reply</Button></Link>
                </Card.Body>
            </Card>
        </div >
    )
}


export default Feed
