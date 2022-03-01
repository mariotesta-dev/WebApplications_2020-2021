import { Navbar, Nav, Form, FormControl, Image } from 'react-bootstrap';
import userlogo from '../userlogo.svg';
import logo from '../logo.svg';

function Header() {
    return (
        <header>
            <Navbar variant="dark" className='nav'>
                <Nav className='nav-bar'>
                    <div>
                        <img src={logo} alt='logo' />
                        <Navbar.Brand href=".">ToDo Manager</Navbar.Brand>
                    </div>
                    <Form>
                        <FormControl type="text" placeholder="Search" />
                    </Form>
                    <Image src={userlogo} alt='userlogo' className='userlogo' style={{ "cursor": "pointer" }} />
                </Nav>
            </Navbar>
        </header>
    )
}

export default Header;