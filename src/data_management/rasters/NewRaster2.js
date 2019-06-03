import React, { Component } from "react";

import ManagementForm from "../../forms/ManagementForm";
import TextInput from "../../forms/TextInput";

import { nonEmptyString, minLength, testRegex } from "../../forms/validators";

// For example
// Realistically we would fire off some Redux actions or change React routes,
// something to cause the data to be submitted and the form to be not shown
// anymore.
const onSubmitExample = (validatedData) => {
  console.log("Submitted data: ", validatedData);
};

class NewRaster2 extends Component {
  render() {
    return (
      <ManagementForm onSubmit={onSubmitExample} wizardStyle>
        <TextInput
          name="othertest"
          placeHolder="Enter a test"
          initial="whee"
        />
        <TextInput
          name="test"
          subtitle="This is the subtitle. Enter at least 5 characters."
          placeHolder="Enter a test"
          validators={[minLength(5)]}
        />
        <TextInput
          name="test1"
          placeHolder="Enter a test"
          initial="whee"
          validators={[nonEmptyString]}
          disabled={(formValues) => formValues.test === 'blaat' }
        />
        <TextInput
          name="test2"
          placeHolder="Enter a test"
          initial="whee"
          validators={[nonEmptyString]}
        />
        <TextInput
          name="test3"
          placeHolder="Enter a test"
          initial="whee"
          validators={[testRegex(/hmm/, 'Please enter a string containing "hmm".')]}
        />
      </ManagementForm>
    );
  }
}

export { NewRaster2 };
