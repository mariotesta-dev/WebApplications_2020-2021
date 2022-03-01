import { Navbar, Nav, Form, FormControl, Image, NavDropdown } from 'react-bootstrap';
import userlogo from '../userlogo.svg';
import logo from '../logo.svg';

function Header(props) {
    return (
        <header>
            <Navbar variant="dark" className='nav'>
                <Nav className='nav-bar'>
                    <div>
                        <img src={logo} alt='logo' />
                        <Navbar.Brand href=".">ToDo Manager</Navbar.Brand>
                    </div>
                    <Form>
                        <FormControl type="text" placeholder="Search" style={{ visibility: props.loggedIn ? 'visible' : 'hidden' }} />
                    </Form>
                    <span style={{ display: 'flex' }}>
                        {props.loggedIn ? <NavDropdown title={"Hi, " + props.user} id="navbarScrollingDropdown" drop={'down'}>
                            <NavDropdown.Item onClick={props.logout}>Log Out</NavDropdown.Item>
                        </NavDropdown> : ''}
                        <Image src={userlogo} alt='userlogo' className='userlogo' style={{ "cursor": "pointer", visibility: props.loggedIn ? 'visible' : 'hidden' }} />
                    </span>
                </Nav>
            </Navbar>
        </header>
    )
}

export default Header;