import React from "react";
import UserInfo from './Сomponents/UserInfo';
import VideoChat from './Сomponents/VideoChat';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Route path="/" component={UserInfo} exact/>
      <Route path="/chat" component={VideoChat} exact/>
    </Router>
  );
}