import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import Header from './components/Header';
import All from './routes/All';
import Important from './routes/Important';
import Today from './routes/Today';
import NextSevenDays from './routes/NextSevenDays';
import Private from './routes/Private';
import AddTask from './components/AddTask';
import API from './API';
import Auth from './components/Auth';
import NotFound from './components/NotFound';

import { Container, Row } from 'react-bootstrap';
import { TaskList } from './components/Task';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

const tasklist = new TaskList();
tasklist.add(1, 'Complete Big Lab 1', false, false, dayjs('2021-05-24'));
tasklist.add(2, 'Buy some groceries', false, true, dayjs('2021-05-20'));
tasklist.add(3, 'Pet your dog', false, false, dayjs('2021-06-19'));
tasklist.add(4, 'Read a good book!', true, false, dayjs('2021-06-20'));
tasklist.add(5, "Today's example task", false, false, dayjs());
tasklist.add(6, "This week's example task", false, false, dayjs().add(3, 'day'));
tasklist.add(7, "Important and private task", true, true, dayjs('2021-06-22'));

function App() {

  const [allTasks, setAllTasks] = useState(tasklist.list);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');


  async function checkAuth() {
    try {
      const user = await API.getUserInfo();
      setLoggedIn(true);
      setUsername(user.name);
      setUserId(user.id);
    } catch (err) {
      console.error(err.error);
    }
  };


  useEffect(() => {
    checkAuth();
  }, [])

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUsername(user);
    } catch (err) {
      setMessage('Wrong email and/or password.');
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
  }

  return (
    <>
      <Router>
        <Header login={doLogIn} logout={doLogOut} loggedIn={loggedIn} user={username} />

        <Container fluid>
          <Row className='vh-100'> {/* CSS: .vh-100 { height: 100vh; } */}

            <Switch>

              <Route path="/login" render={() =>
                <>{loggedIn ? <Redirect to="/" /> : <Auth login={doLogIn} message={message} setMessage={setMessage} />}</>
              } />


              <Route path="/" exact={true} render={() =>
                <>
                  {loggedIn ? <All id={userId} check={checkAuth} /> : <Redirect exact={true} to='/login' />}
                </>
              } />
              <Route path="/important" exact={true} render={() => <Important loggedIn={loggedIn} id={userId} check={checkAuth} allTasks={allTasks} setAllTasks={setAllTasks} />} />
              <Route path="/today" exact={true} render={() => <Today loggedIn={loggedIn} id={userId} check={checkAuth} allTasks={allTasks} setAllTasks={setAllTasks} />} />
              <Route path="/nextsevendays" exact={true} render={() => <NextSevenDays loggedIn={loggedIn} id={userId} check={checkAuth} allTasks={allTasks} setAllTasks={setAllTasks} />} />
              <Route path="/private" exact={true} render={() => <Private loggedIn={loggedIn} id={userId} check={checkAuth} allTasks={allTasks} setAllTasks={setAllTasks} />} />
              <Route path="/new" exact={true} render={() => <>{loggedIn ? <AddTask id={userId} check={checkAuth} allTasks={allTasks} setAllTasks={setAllTasks} /> : ''}</>} />
              <Route component={NotFound} />
            </Switch>

          </Row>
        </Container>
      </Router>
    </>
  );
}


export default App;
