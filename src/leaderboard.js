import React from 'react';
import API from "@aws-amplify/api";
import Loading from "./loading";
import logo from "./logo.svg";

const ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL;

class Leaderboard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      user_json: [],
      display: "individualNames"
    }
  }

  async componentDidMount() {
    const body = await API.get("treehacks", "/users", {});
    let user_list = [];
    body["results"].map(
      one_user_json =>
        one_user_json.year == 2020 &&
        one_user_json.status == "admitted" &&
        one_user_json["forms"]["application_info"]["first_name"] &&
        user_list.push(one_user_json)
    );
    console.log(user_list);
    this.setState({user_json: user_list});
  }


  render () {
    let columns = ["", "Name", "# Attended"]
    if (this.state.user_json.length == 0) {
      return <Loading />;
    }
    else {
      return (
        <div id="leaderboard">
          <div className="header">
            <img src={logo} alt="treehacks small logo" />
            <div className="header">
              <span className="logo-text-tree">tree</span>
              <span className="logo-text-hacks">hacks</span>
              <span className="logo-text-leaderboard">leaderboard</span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                {columns.map(column => (
                  <th>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.state.user_json.map(datapoint => (
                <tr>
                  <td>
                    {datapoint["forms"]["meet_info"]["profilePicture"] && <img src={datapoint["forms"]["meet_info"]["profilePicture"]} />}
                  </td>
                  <td>
                    {datapoint["forms"]["application_info"]["first_name"] && datapoint["forms"]["application_info"]["first_name"]} {datapoint["forms"]["application_info"]["last_name"] && datapoint["forms"]["application_info"]["last_name"].charAt(0)}
                  </td>
                  <td>
                    5
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
}


class Table extends React.Component {
}

export default Leaderboard;
