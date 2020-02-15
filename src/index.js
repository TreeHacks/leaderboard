import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import './index.scss';
import Leaderboard from './leaderboard';
import * as serviceWorker from './serviceWorker';
import API from "@aws-amplify/api";
import queryString from "query-string";

const LOGIN_URL = process.env.REACT_APP_LOGIN_URL;
const ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL;

API.configure({
  endpoints: [
    {
      name: "treehacks",
      endpoint: ENDPOINT_URL
    }
  ]
});

function Main() {
  return (
    <Leaderboard />
  )
}

ReactDOM.render(<Main />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
