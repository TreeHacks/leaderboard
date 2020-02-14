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
      display_number: 0,
      display_options: [],
      display_data: [],
      mode: "normal"
    }
    window.setInterval(this.iterateDisplayNumber.bind(this), 8000);
    window.setInterval(this.componentDidMount.bind(this), 30000);
  }

  iterateDisplayNumber() {
    this.setState(state => {
      const display_number = state.display_number + 1;
      return {
        display_number
      }
    });
  }

  async componentDidMount() {
    const users_body = await API.get("treehacks", "/users", {});
    let user_list = [];
    users_body["results"].map(
      one_user_json =>
        one_user_json.year == 2020 &&
        one_user_json.status == "admitted" &&
        one_user_json["forms"]["application_info"]["first_name"] &&
        user_list.push(one_user_json)
    );
    console.log(user_list);

    const leaderboard_body = await API.get("treehacks", "/leaderboard", {});
    let display_options = [];
    for (var key in leaderboard_body["data"]) {
      var user_id = leaderboard_body["data"][key]["data"]["data_1580776107879"]
      var data = leaderboard_body["data"][key]["attendance"];
      Object.keys(data).map(key =>
        !display_options.includes(key) && display_options.push(key)
      );
      user_list.map(user =>
        user_id == user["user"]["id"] && (user["attendance"] = data)
      );
    }

    let display_data = [];
    display_options.forEach(category => {
      let ordered_data = [];
      user_list.map(user => {
        let user_picture = null;
        if (user["forms"]["meet_info"]) {
          user_picture = user["forms"]["meet_info"]["profilePicture"];
        }
        let user_name = user["forms"]["application_info"]["first_name"];
        if (user["forms"]["application_info"]["last_name"]) {
          user_name += " " + user["forms"]["application_info"]["last_name"].charAt(0);
        }
        if (user["attendance"]) {
          ordered_data.push({
            id: user["user"]["id"],
            picture: user_picture,
            name: user_name,
            attendance: user["attendance"][category]
          })
        }
      });
      ordered_data.sort(
        function (a,b) {
          return b["attendance"] - a["attendance"];
        }
      );
      display_data.push({
        category: category,
        data: ordered_data
      });
    });

    console.log(user_list)
    console.log(display_options)
    console.log(display_data)
    this.setState({
      user_json: user_list,
      display_options: display_options,
      display_data: display_data
    });
  }


  render () {
    let tableClasses = ["dark", "light"];
    let categoryIndex, category, displayData;
    if (this.state.mode == "registration") {
      categoryIndex = 0;
      category = "Registered";
      displayData = this.state.display_data[categoryIndex];
      console.log(displayData);
    } else {
      categoryIndex = this.state.display_number % this.state.display_options.length;
      category = this.state.display_options[categoryIndex];
      displayData = this.state.display_data[categoryIndex];
      console.log(displayData);
    }

    if (this.state.user_json.length == 0) {
      return <Loading />;
    }
    else {
      return (
        <div id="leaderboard">
          <div className="header">
            <img src={logo} alt="treehacks small logo" />
              <span className="logo-text-tree">tree</span>
              <span className="logo-text-hacks">hacks</span>
              <span className="logo-text-leaderboard">leaderboard</span>
          </div>
          <table cellSpacing="0">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th># <span>{category}</span> Attended</th>
              </tr>
            </thead>
            <tbody>
              {displayData["data"].map((datapoint, index) =>
                <tr className={tableClasses[index % 2]}>
                  <td className="rank">{index + 1}.</td>
                  <td>
                    <img src={datapoint["picture"]} />
                    {datapoint["name"]}
                  </td>
                  <td>{datapoint["attendance"]}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default Leaderboard;
