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

  const url = "/api/v4/rasters/";
  // if (!this.props.currentRaster) {
    const opts = {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: validatedData.rasterName,
        organisation: validatedData.selectedOrganisation.replace(/-/g, ""),
        access_modifier: validatedData.accesModifier,
        observation_type: validatedData.observationType, // observationTypeId, //this.state.observationType,
        description: validatedData.description,
        supplier: validatedData.username,
        supplier_code: validatedData.supplierCode,
        temporal: validatedData.temporalBool,
        interval: validatedData.duration, //isoIntervalDuration, //'P1D', // P1D is default, = ISO 8601 datetime for 1 day",
        rescalable: false,
        optimizer: false, // default
        aggregation_type: validatedData.aggregationType,//intAggregationType,
        options: validatedData.colormap,//this.state.options,
        shared_with: validatedData.sharedWithOrganisations.map(orgUuid => orgUuid.replace(/-/g, ""))
      })
    };

    fetch(url, opts)
      .then(responseParsed => {
        this.handleResponse(responseParsed);
        return responseParsed.json();
      })
      .then(parsedBody => {
        console.log("parsedBody", parsedBody);
        this.setState({ createdRaster: parsedBody });
      });
  // } else {
  //   let body = {
  //     name: this.state.rasterName,
  //     organisation: this.state.selectedOrganisation.uuid.replace(/-/g, ""), // required
  //     access_modifier: this.state.accesModifier,
  //     observation_type: observationTypeId, // required

  //     description: this.state.description,
  //     supplier: this.state.supplierId && this.state.supplierId.username,
  //     supplier_code: this.state.supplierCode,
  //     aggregation_type: intAggregationType,
  //     shared_with: this.state.sharedWith.map(e => e.uuid)
  //   };
  //   if (!optionsHasLayers(this.state.options)) {
  //     body.options = this.state.options;
  //   }
  //   const opts = {
  //     credentials: "same-origin",
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(body)
  //   };
  //   // only add colormap in options if not multiple layers

  //   fetch(url + "uuid:" + this.props.currentRaster.uuid + "/", opts)
  //     .then(responseParsed => {
  //       console.log("responseParsed put", responseParsed);
  //       this.handleResponse(responseParsed);
  //       return responseParsed.json();
  //     })
  //     .then(parsedBody => {
  //       console.log("parsedBody", parsedBody);
  //       this.setState({ createdRaster: parsedBody });
  //     });
  // }
};

class RasterFormModel extends Component {

  


  render() {

    const {currentRaster} = this.props;

    console.log('currentRaster', currentRaster)

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
          choices={this.props.organisations.available.map(organisation=>
            [organisation.uuid.replace(/-/g, ""), organisation.name]
          )}
          validators={[required("Please select an organisation.")]}
          showSearchField={true}
          initial ={
            currentRaster && 
            currentRaster.organisation && 
            currentRaster.organisation.uuid &&
            currentRaster.organisation.uuid.replace(/-/g, "")
          }
        />
        <SlushBucket
          name="sharedWithOrganisations"
          title="Shared With Organisation"
          choices={this.props.organisations.availableForRasterSharedWith.map(e =>{
            return {
              display: e.name, 
              value : e.uuid.replace(/-/g, "")
            }
          })}
          readOnly={false}
          placeholder={"search organisations"}
          initial={
            currentRaster && 
            currentRaster.shared_with && 
            currentRaster.shared_with.map((orgUuid) => {
              return orgUuid.uuid.replace(/-/g, "")
            })
          }
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
          validators={[minLength(1)]}
        />
        <SelectBox
          name="aggregationType"
          title="Aggregation Type"
          subTitle="Specify how data should be displayed in region selection mode"
          placeholder="click to select aggregation type"
          choices={[
            [
              "0",
              "none",
              "no aggregation"
            ],
            [
              "1",
              "counts",
              "area per category"
            ],
            [
              "2",
              "curve",
              "cumulative distribution"
            ],
            [
              "4",
              "sum",
              "values in the region are summed"
            ],
            [
              "5",
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
          validators={[function(value, allValues){
            if (!value || !value.colorMap) {
              return "Colormap must be selected"
            }
            
            if (isFilled(value.min) &&  !isFilled(value.max)) {
              return "If Min is filled, then Max is mandatory";
            }
            if (!isFilled(value.min) &&  isFilled(value.max)) {
              return "If Max is filled, then Min is mandatory";
            }

            if ((isFilled(value.min) && isNaN(value.min)) ||  (isFilled(value.max) && isNaN(value.max))) {
              return "Min and Max need to be numbers";
            }

            if (value && (value.min > value.max)) {
              return "Max must be larger then Min";
            }
            return false;

            function isFilled (minOrMax) {
              if (minOrMax === 0) {
                return true;
              } else if (minOrMax) {
                return true;
              } else {
                return false;
              }
            }
          }]}
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
          label="Select whether you are creating a raster that contains multiple rasters over time"
        />
        <DurationField
          name="duration"
          title="Raster Series Interval"
          subtitle="Interval of raster series"
          validators={[durationValidator(true)]}
        />
      </ManagementForm>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    organisations: state.organisations,
    bootstrap: state.bootstrap,
    observationTypes: state.observationTypes,
    colorMaps: state.colorMaps,
    supplierIds: state.supplierIds
  };
};

const mapDispatchToProps = (dispatch) => {
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
