import { Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
//import { Redirect } from 'react-router';

function Auth(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        props.setMessage('');
        const credentials = { username, password };

        let valid = true;
        if (username === '' || password === '' || password.length < 6)
            valid = false;

        if (valid) {
            props.login(credentials);
        }
        else {
            props.setMessage('Error(s) in the form, please fix it.')
        }
    };

    return (
        <div className='login-form'>
            <Form>
                {props.message ? <Alert variant='danger'>{props.message}</Alert> : ''}
                <h2>Login</h2>
                <Form.Group controlId='username'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' value={username} onChange={event => setUsername(event.target.value)} />
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' value={password} onChange={event => setPassword(event.target.value)} />
                </Form.Group>
                <Button variant='success' onClick={handleSubmit}>Login</Button>
            </Form>
        </div>)
}

export default Auth;