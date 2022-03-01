import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from './API';
import Nav from './components/Nav';
import Auth from './components/Auth';
import Dashboard from './routes/Dashboard';
import Feed from './routes/Feed';
import CompileForm from './routes/CompileForm';
import NotFound from './routes/NotFound';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    };
    checkAuth();
  }, [loggedIn])

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
      return user;
    } catch (err) {
      throw err;
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    //setCourses([]);
    //setExams([]);
  }

  return (
    <Router>

      <Nav loggedIn={loggedIn} logOut={doLogOut} user={user.name} />

      <Switch>

        <Route exact path='/' render={() => <>{loggedIn ? <Redirect to='/dashboard' /> : <Feed />}</>} />
        <Route exact path='/dashboard' render={() => <>{loggedIn ? <Dashboard user={user} /> : <Redirect to='/' />}</>} />
        <Route exact path='/compile' render={() => <>{loggedIn ? <Redirect to='/dashboard' /> : <CompileForm />}</>} />
        <Route exact path='/login' render={() => <>{loggedIn ? <Redirect to="/" /> : <Auth login={doLogIn} />}</>} />
        <Route component={NotFound} />

      </Switch>



    </Router>
  )
}

export default App;
