import { Col, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function Sidebar() {

    const style = {
        "color": "black",
        "cursor": "pointer",
    };

    return (
        <Col className='side-bar col-4 p-2'>
            <Table className='table-hover'>
                <tbody>
                    <tr>
                        <td><button type="button" className="btn btn-block"><Link to="/" style={style}>All</Link></button></td>
                    </tr>
                    <tr>
                        <td><button type="button" className="btn btn-block"><Link to="/important" style={style}>Important</Link></button></td>
                    </tr>
                    <tr>
                        <td><button type="button" className="btn btn-block"><Link to="/today" style={style}>Today</Link></button></td>
                    </tr>
                    <tr>
                        <td><button type="button" className="btn btn-block"><Link to="/nextsevendays" style={style}>Next 7 Days</Link></button></td>
                    </tr>
                    <tr>
                        <td><button type="button" className="btn btn-block"><Link to="/private" style={style}>Private</Link></button></td>
                    </tr>
                </tbody>
            </Table>
        </Col >
    )
}

export default Sidebar;