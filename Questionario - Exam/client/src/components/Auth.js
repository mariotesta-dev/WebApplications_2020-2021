import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap';
import validator from 'validator';

function Auth(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (event) => {

        event.preventDefault();

        let valid = true;

        if (!validator.isEmail(email)) {
            valid = false;
        }
        if (password < 6) {
            valid = false;
        }

        if (valid) {
            var credentials = {
                username: email,
                password: password
            }

            try {
                await props.login(credentials);
            } catch (err) {
                setErrorMsg(err);
            }

        } else {
            setErrorMsg('Invalid mail and/or password.');
        }

    }

    return (
        <div className='auth-page'>
            <div className='auth-color'></div>

            <div className='auth-form-container'>
                <Form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <Form.Group >
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    </Form.Group>
                    {errorMsg ? <Alert variant='danger' className='auth-alert'>{errorMsg}</Alert> : ''}
                    <Button variant="primary" type="submit">
                        Sign in
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default Auth
