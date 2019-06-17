import React, { Component } from "react";

import ManagementForm from "../../forms/ManagementForm";
import ColorMapInput, { colorMapValidator } from "../../forms/ColorMapInput";
import DurationField, { durationValidator } from "../../forms/DurationField";
import TextInput from "../../forms/TextInput";
import SelectBox from "../../forms/SelectBox";
import CheckBox from "../../forms/CheckBox";
import SlushBucket from "../../forms/SlushBucket";

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
        <SlushBucket
          name="sharedWithOrganisation"
          title="Shared With Organisation"
          choices={[
            { value: "abc", display: "aBc" },
            { value: "nens", display: "nEns" },
            { value: "home", display: "hOmbre" },
          ]}
          readonly={false}
          placeholder={"search organisations"}
        />
        <DurationField
          name="duration"
          title="Your duration here"
          validators={[durationValidator(true)]}
        />
        <ColorMapInput
          name="colormap"
          title="Choose a color map"
          colorMaps={[
            ["autumn", "Herfst"],
            ["Blues", "Blauwen"],
            ["jet", "Everybody loves jet"]
          ]}
        />
        <CheckBox
          name="checkcheck"
          title="Testing a checkbox"
          label="Check this if you want to see a nice checkmark"
          initial={true}
        />
        <SelectBox
          name="organisation"
          title="Organisation"
          placeholder="Choose an organisation"
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
          placeholder="Enter a test"
          initial="whee"
        />
        <TextInput
          name="test"
          title="A validator test"
          subtitle="This is the subtitle. Enter at least 5 characters."
          placeholder="Enter a test"
          validators={[minLength(5)]}
        />
        <TextInput
          name="maybedisabled"
          placeholder="Enter a test"
          validators={[nonEmptyString]}
          disabled={(formValues) => formValues.test !== 'temporal' }
        />
        <TextInput
          name="test2"
          placeholder="Enter a test"
          initial="whee"
          validators={[nonEmptyString]}
        />
        <TextInput
          name="test3"
          placeholder="Enter a test"
          subtitle="Hmm."
          initial="whee"
          validators={[testRegex(/hmm/, 'Please enter a string containing "hmm".')]}
        />
        <TextInput
          name="test4"
          disabled={true}
          />
      </ManagementForm>
    );
  }
}

export { NewRaster2 };
