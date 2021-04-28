import React from "react";
import $ from 'jquery';
import Header from './Сomponents/Header';
import UserInfo from './Сomponents/UserInfo';
import VideoChat from './Сomponents/VideoChat';
import ConsultantLogin from './Сomponents/ConsultantLogin';
import ConsultantProfile from './Сomponents/ConsultantProfile';
import AdminProfile from './Сomponents/AdminProfile';
import RatingConsultation from './Сomponents/RatingConsultation';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Route path="/" component={UserInfo} exact />
        <Route path="/chat" component={VideoChat} exact />
        <Route path="/login" component={ConsultantLogin} exact />
        <Route path="/profile" component={ConsultantProfile} exact />
        <Route path="/rating" component={RatingConsultation} exact />
        <Route path="/admin" component={AdminProfile} exact />
      </Router>
    </>
  );
}