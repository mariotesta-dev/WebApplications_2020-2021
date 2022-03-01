import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
import adminpicture from '../assets/admin.jpg';

function Nav(props) {
    return (
        <nav className='my-navbar'>
            <div className='my-navbrand'>
                <Link to='/' style={{ color: 'black', textDecoration: 'none' }}><h2><strong>Forms</strong></h2></Link>
            </div>
            <div className='my-navauth'>
                {!props.loggedIn ?
                    <Link to='/login' style={{ color: 'black', textDecoration: 'none' }}><p className='clickable'>Sign in</p></Link> : <>
                        <div style={{ display: 'flex' }}>
                            <NavDropdown title={"Hi, " + props.user} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={props.logOut} style={{ position: 'relative', zIndex: '1' }}>Sign out</NavDropdown.Item>
                            </NavDropdown>
                            <img src={adminpicture} alt='admin' className='user-icon' />
                        </div>
                    </>
                }
            </div>
        </nav>
    )
}

export default Nav
