import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import All from './routes/All';
import Important from './routes/Important';
import Today from './routes/Today';
import NextSevenDays from './routes/NextSevenDays';
import Private from './routes/Private';
import AddTask from './components/AddTask';

import { Container, Row } from 'react-bootstrap';
import { TaskList } from './components/Task';
import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

const tasklist = new TaskList();
tasklist.add('Complete Big Lab 1', false, false, dayjs('2021-05-24'));
tasklist.add('Buy some groceries', false, true, dayjs('2021-05-20'));
tasklist.add('Pet your dog', false, false, dayjs('2021-06-19'));
tasklist.add('Read a good book!', true, false, dayjs('2021-06-20'));
tasklist.add("Today's example task", false, false, dayjs());
tasklist.add("This week's example task", false, false, dayjs().add(3, 'day'));
tasklist.add("Important and private task", true, true, dayjs('2021-06-22'));

function App() {

  const [allTasks, setAllTasks] = useState(tasklist.list); //la lista originale di task di cui teniamo traccia

  return (
    <>
      <Header />

      <Router>
        <Container fluid>
          <Row className='vh-100'> {/* CSS: .vh-100 { height: 100vh; } */}
            <Sidebar />

            <Switch>
              <Route path="/" exact={true} render={() => <All allTasks={allTasks} setAllTasks={setAllTasks} />} />
              <Route path="/important" exact={true} render={() => <Important allTasks={allTasks} setAllTasks={setAllTasks} />} />
              <Route path="/today" exact={true} render={() => <Today allTasks={allTasks} setAllTasks={setAllTasks} />} />
              <Route path="/nextsevendays" exact={true} render={() => <NextSevenDays allTasks={allTasks} setAllTasks={setAllTasks} />} />
              <Route path="/private" exact={true} render={() => <Private allTasks={allTasks} setAllTasks={setAllTasks} />} />
              <Route path="/new" exact={true} render={() => <AddTask allTasks={allTasks} setAllTasks={setAllTasks} />} />


            </Switch>

          </Row>
        </Container>
      </Router>
    </>
  );
}

/* <Route path="/important" component={Important}/>
              <Route path="/today" component={Today}/>
              <Route path="/nextsevendays" component={NextSevenDays}/>
              <Route path="/private" component={Private}/>
              <Route path="/add" component={AddTask}/>
              <Route path="/edit" component={EditTask}/> */


export default App;
