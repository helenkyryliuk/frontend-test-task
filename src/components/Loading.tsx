import React, { Component } from "react";
import loading from "../assets/loading.svg";

class Loading extends Component {
  render () {
    return (
      <div className="spinner">
        <img src={loading} alt="Loading" />
      </div>
    );
  }
}

export default Loading;
