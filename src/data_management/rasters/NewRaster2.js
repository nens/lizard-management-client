import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ManagementForm from "../../forms/ManagementForm";
import TextInput from "../../forms/TextInput";

function nonEmpty(s) {
  if (!s || s.length < 10) {
    return "Please enter a value.";
  }
}

class NewRasterModel extends Component {
  render() {
    return (
      <ManagementForm onSubmit={form => null}>
        <TextInput
          name="othertest"
          placeHolder="Enter a test"
          initial="whee"
        />
        <TextInput
          name="test"
          placeHolder="Enter a test"
          initial="whee"
          validators={[nonEmpty]}
        />
      </ManagementForm>
    );
  }
}

const NewRaster2 = withRouter(connect()(NewRasterModel));

export { NewRaster2 };
