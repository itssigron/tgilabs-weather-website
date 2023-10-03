import './App.css';
import { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import NavBar from './components/NavBar';
import EventBus from './services/EventBus.service';
import AuthService from './services/auth.service';
import RequestPasswordReset from './components/RequestPasswordReset';
import ResetPassword from './components/ResetPassword';

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.updateProfile = this.updateProfile.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  updateProfile() {
    let user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user
      });
    }
    else {
      this.logOut();
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  componentDidMount() {
    EventBus.on("logout", () => {
      this.logOut();
    });

    EventBus.on("updateProfile", () => {
      this.updateProfile();
    })

    // set the initial profile (so page will render smoothly)
    EventBus.dispatch("updateProfile");
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }


  render() {
    const { currentUser } = this.state;

    return (
      <div className="App">
        <Router>
          <NavBar currentUser={currentUser} />
          <Routes>
            {
              // Allow access to "/logout" only for logged users
              currentUser ?
                <>
                  <Route path="/logout" Component={() => { this.logOut(); return <Navigate to="/" /> }} />
                </>
                : // Allow access to "/login" and "/register" for guests only
                <>
                  <Route path="/login" Component={Login} />
                  <Route path="/register" Component={Register} />
                  <Route path="/reset-password" Component={RequestPasswordReset} />
                  <Route path="/reset-password/*" Component={ResetPassword} />
                </>
            }

            {/* Define the routes that are accessible by both guests and logged users */}
            <Route path="/" Component={Home} />

            {/* For unknown routes, just navigate to '/' */}
            <Route path="*" Component={() => <Navigate to='/' />} />
          </Routes>
        </Router>
      </div>
    );
  }
}


export default App;
