import React from 'react';
import API from "@aws-amplify/api";
import Loading from "./loading";
import logo from "./logo.svg";

const ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL;

class Leaderboard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: [],
      event_types: []
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
    const leaderboard_body = await API.get("treehacks", "/leaderboard", {});
    let event_types = [];
    leaderboard_body["data"].forEach(event =>
      event_types.push(event["type"])
    );
    console.log(event_types);
    this.setState({
      data: leaderboard_body["data"],
      event_types: event_types
    });
  }


  render () {
    let tableClasses = ["dark", "light"];
    let category = this.state.event_types[this.state.display_number % this.state.event_types.length];
    let displayData = this.state.data[this.state.display_number % this.state.event_types.length];
    console.log(displayData);

    if (this.state.data.length == 0) {
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
              {displayData.map((datapoint, index) =>
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
