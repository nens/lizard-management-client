import React, { Component } from "react";

import ManagementForm from "../../forms/ManagementForm";
import TextInput from "../../forms/TextInput";
import SelectBox from "../../forms/SelectBox";
import CheckBox from "../../forms/CheckBox";
import Slushbucket from "../../forms/Slushbucket";

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
        {/* <SlushBucket
          choices={this.props.organisations.availableForRasterSharedWith.map(
            e => e.name
          )}
          readonly={
            false 
          }
          selected={this.state.sharedWith.map(e => e.name)}
          isFetching={this.props.organisations.isFetching}
          placeholder={"search organisations"}
          updateModelValue={selected => {
            this.setState({
              sharedWith: selected
                .map(selectedItem => {
                  const found = this.props.organisations.availableForRasterSharedWith.find(
                    availableItem =>
                      availableItem.name === selectedItem
                  );
                  if (found) {
                    let adaptebleFound = Object.assign({}, found);
                    adaptebleFound.roles = undefined;
                    return adaptebleFound;
                  } else {
                    return undefined;
                  }
                })
                .filter(e => e !== undefined)
            });
          }}
        /> */}
        <Slushbucket
          name="sharedWithOrganisation"
          title="Shared With Organisation"
          choices={[
            ["abc", "Display string", "An example of an organisation"],
            ["nens", "Nelen & Schuurmans", "We work here"],
            ["home", "Thuis"],
          ]}
          readonly={false}
          isFetching={false}
          placeholder={"search organisations"}
          initial={[]}
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
