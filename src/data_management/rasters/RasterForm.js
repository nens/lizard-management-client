import React, { Component } from "react";

// import gridStyles from "../../styles/Grid.css";
// import buttonStyles from "../../styles/Buttons.css";
// import "./NewRaster.css";
// import React, { Component } from "react";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormattedMessage } from "react-intl";

// import GenericTextInputComponent from "../../components/GenericTextInputComponent";
// import GenericSelectBoxComponent from "../../components/GenericSelectBoxComponent";
// import GenericCheckBoxComponent from "../../components/GenericCheckBoxComponent";
// import ColorMapComponent from "../../components/ColorMapComponent";
// import GenericStep from "../../components/GenericStep";
// import DurationComponent from "../../components/DurationComponent";
// import inputStyles from "../../styles/Input.css";
import {
  calculateNewStyleAndOptions,
  optionsHasLayers,
  getColorMapFromStyle,
  getColorMinFromStyle,
  getColorMaxFromStyle,
  getStyleFromOptions,
  validateStyleObj
} from "../../utils/rasterOptionFunctions";
import ErrorOverlay from "./ErrorOverlay.js";

// import SlushBucket from "../../components/SlushBucket";
// import SelectBoxSimple from "../../components/SelectBoxSimple.js";
import "../../forms/validators";




import ManagementForm from "../../forms/ManagementForm";
import ColorMapInput, { colorMapValidator } from "../../forms/ColorMapInput";
import DurationField, { durationValidator } from "../../forms/DurationField";
import TextInput from "../../forms/TextInput";
import TextArea from "../../forms/TextArea";
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

class RasterFormModel extends Component {
  render() {
    return (
      <ManagementForm onSubmit={onSubmitExample}
                      initial={{
                        first: "This initial was set through the form"
                      }}
                      wizardStyle
      >

        <SelectBox
          name="selectedOrganisation"
          title="Organisation"
          placeholder="Choose an organisation"
          // choices={[
          //   ["abc", "Display string", "An example of an organisation"],
          //   ["nens", "Nelen & Schuurmans", "We work here"],
          //   ["home", "Thuis"],
          // ]}
          choices={this.props.organisations.available.map(organisation=>
            [organisation.uuid, organisation.name]
          )}
          validators={[required("Please select an organisation.")]}
          showSearchField={true}
        />
        <SlushBucket
          name="sharedWithOrganisation"
          title="Shared With Organisation"
          choices={this.props.organisations.availableForRasterSharedWith.map(e =>{
            return {
              display: e.name, 
              value : e.uuid
            }
          })}
          readOnly={false}
          placeholder={"search organisations"}
        />
        <SelectBox
          name="accesModifier"
          title="Authorization type"
          choices={[
            [
              "Private",
              "Private",
              "Just the selected organisations can view"
            ],
            [
              "Common",
              "Common",
              "All logged in users can view"
            ],
            [
              "Public",
              "Public",
              "All users can view"
            ] 
          ]}
          validators={[required("Please select an acces modifier.")]}
          initial={"Private"}
          showSearchField={false}
        />
        <TextInput
          name="rasterName"
          title="Name of this Raster"
          placeholder="Name of this Raster"
          validators={[minLength(5)]}
        />
        <TextArea
          name="description"
          placeholder="Fill in your description here"
          subtitle="Add a clear description of this raster with reference to the data source."
          // initial="whee"
          validators={[minLength(1)]}
        />
        <SelectBox
          name="aggregationType"
          title="Aggregation Type"
          subTitle="Specify how data should be displayed in region selection mode"
          placeholder="click to select aggregation type"
          choices={[
            [
              0,
              "none",
              "no aggregation"
            ],
            [
              1,
              "counts",
              "area per category"
            ],
            [
              2,
              "curve",
              "cumulative distribution"
            ],
            [
              4,
              "sum",
              "values in the region are summed"
            ],
            [
              5,
              "average",
              "values in the region are averaged"
            ]
          ]}
          validators={[required("Please select an aggregation type.")]}
          showSearchField={false}
        />
        <SelectBox
          name="observationType"
          title="Observation Type"
          subTitle="Specify the physical quantity and unit of the data"
          placeholder="click to select observation type"
          choices={this.props.observationTypes.available.map(obsT=>
            [obsT.code, obsT.code]
          )}
          validators={[required("Please select an observation type.")]}
          showSearchField={true}
        />
        <ColorMapInput
          name="colormap"
          title="Choose a color map"
          colorMaps={this.props.colorMaps.available.map(colM=>
            [colM.name, colM.name, colM.description]
          )}
        />
        <SelectBox
          name="supplierName"
          title="Supplier Name"
          subTitle="Select the user that is allowed to change and delete this raster"
          placeholder="click to select supplier name"
          choices={this.props.supplierIds.available.map(obsT=>
            [obsT.username, obsT.username]
          )}
          validators={[required("Please select a Supplier Name.")]}
          showSearchField={true}
        />
        <TextInput
          name="supplierCode"
          title="Supplier Code"
          placeholder="Fill in a supplier code here"
          subtitle="Provide a code for your own administration."
          validators={[minLength(1)]}
        />
        <CheckBox
          name="temporal"
          title="Raster Series"
          // subtitle="Select whether you are creating a raster that contains multiple rasters over time"
          label="Select whether you are creating a raster that contains multiple rasters over time"
          // initial={true}
        />
        <DurationField
          name="duration"
          title="Raster Series Interval"
          subtitle="Interval of raster series"
          validators={[durationValidator(true)]}
        />
        {/* <SlushBucket
          name="sharedWithOrganisation"
          title="Shared With Organisation"
          choices={[
            { value: "abc", display: "aBc" },
            { value: "nens", display: "nEns" },
            { value: "home", display: "hOmbre" },
          ]}
          readOnly={false}
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
          /> */}


      </ManagementForm>
    );
  }
}

// export { NewRaster2 };


const mapStateToProps = (state, ownProps) => {
  return {
    organisations: state.organisations,
    bootstrap: state.bootstrap,
    observationTypes: state.observationTypes,
    colorMaps: state.colorMaps,
    supplierIds: state.supplierIds
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

const RasterForm = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RasterFormModel)
);

export { RasterForm };
