import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import CreateChannel from "./pages/CreateChannel";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import DirectChat from "./pages/DirectChat";
import PrivateChat from "./pages/PrivateChat";

class AppRouter extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Home}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/register" exact component={Register}/>
        <Route path="/chat/:chatId" exact component={Chat}/>
        <Route path="/pchat/:chatId" exact component={PrivateChat}/>
        <Route path="/direct/:directId" exact component={DirectChat}/>
        <Route path="/create" exact component={CreateChannel}/>
        <Route path="/profile/:userId" exact component={Profile}/>
        <Route path="/edit" exact component={EditProfile}/>
      </Router>
    );
  }
}

export default AppRouter;
