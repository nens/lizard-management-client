import React, { Component } from "react";

import ManagementForm from "../../forms/ManagementForm";
import TextInput from "../../forms/TextInput";
import SelectBox from "../../forms/SelectBox";
import CheckBox from "../../forms/CheckBox";

import {
  nonEmptyString,
  minLength,
  testRegex,
  required
} from "../../forms/validators";

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
        <CheckBox
          name="checkcheck"
          title="Testing a checkbox"
          label="Check this if you want to see a nice checkmark"
          initial={true}
        />
        <SelectBox
          name="organisation"
          title="Organisation"
          placeHolder="Choose an organisation"
          choices={[
            ["abc", "Display string", "An example of an organisation"],
            ["nens", "Nelen & Schuurmans", "We work here"],
            ["home", "Thuis"],
          ]}
          validators={[required("Please select an organisation.")]}
          showSearchField={true}
        />
        <TextInput
          name="first"
          title="The first field"
          placeHolder="Enter a test"
          initial="whee"
        />
        <TextInput
          name="test"
          title="A validator test"
          subtitle="This is the subtitle. Enter at least 5 characters."
          placeHolder="Enter a test"
          validators={[minLength(5)]}
        />
        <TextInput
          name="maybedisabled"
          placeHolder="Enter a test"
          validators={[nonEmptyString]}
          disabled={(formValues) => formValues.test !== 'temporal' }
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
          subtitle="Hmm."
          initial="whee"
          validators={[testRegex(/hmm/, 'Please enter a string containing "hmm".')]}
        />
      </ManagementForm>
    );
  }
}

export { NewRaster2 };
