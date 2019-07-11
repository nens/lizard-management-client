import React, { Component } from "react";

import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import ErrorOverlay from "./ErrorOverlay.js";

import "../../forms/validators";
import {toISOValue, rasterIntervalStringServerToDurationObject} from "../../utils/isoUtils"

import ManagementForm from "../../forms/ManagementForm";
import ColorMapInput, { colorMapValidator } from "../../forms/ColorMapInput";
import DurationField, { durationValidator } from "../../forms/DurationField";
import TextInput from "../../forms/TextInput";
import TextArea from "../../forms/TextArea";
import SelectBox from "../../forms/SelectBox";
import CheckBox from "../../forms/CheckBox";
import SlushBucket from "../../forms/SlushBucket";

import {
  minLength,
  required
} from "../../forms/validators";
import { optionsHasLayers} from "../../utils/rasterOptionFunctions";


class RasterFormModel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      openOverlay: false,
      modalErrorMessage: "",
      createdRaster: null,
    }
  }

  handleResponse(response) {
    this.setState({
      modalErrorMessage: response,
      isFetching: false,
      handlingDone: true
    });
  }

  
  onSubmit = (validatedData, currentRaster) => {

    this.setState({ isFetching: true, openOverlay: true });
  
    const url = "/api/v4/rasters/";
     if (!currentRaster) {
      const opts = {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: validatedData.rasterName,
          organisation: validatedData.selectedOrganisation.replace(/-/g, ""),
          access_modifier: validatedData.accessModifier,
          observation_type: validatedData.observationType, // observationTypeId, //this.state.observationType,
          description: validatedData.description,
          supplier: validatedData.supplierName,
          supplier_code: validatedData.supplierCode,
          temporal: validatedData.temporal,
          interval: validatedData.duration, //isoIntervalDuration, //'P1D', // P1D is default, = ISO 8601 datetime for 1 day",
          rescalable: validatedData.colormap.rescalable,
          optimizer: false, // default
          aggregation_type: validatedData.aggregationType, 
          options: validatedData.colormap.options,
          shared_with: validatedData.sharedWithOrganisations,
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
    } else {
      let body = {
        name: validatedData.rasterName,
        organisation: validatedData.selectedOrganisation.replace(/-/g, ""),
        access_modifier: validatedData.accessModifier,
        observation_type: validatedData.observationType, // observationTypeId, //this.state.observationType,
        description: validatedData.description,
        supplier: validatedData.supplierName,
        supplier_code: validatedData.supplierCode,
        aggregation_type: validatedData.aggregationType,//intAggregationType,
        shared_with: validatedData.sharedWithOrganisations,
        rescalable: validatedData.colormap.rescalable,
        
      };
      // only add colormap in options if not multiple layers
      if (!optionsHasLayers(validatedData.colormap.options)) {
        body.options = validatedData.colormap.options;
      }
      const opts = {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      };
      
  
      fetch(url + "uuid:" + currentRaster.uuid + "/", opts)
        .then(responseParsed => {
          console.log("responseParsed put", responseParsed);
          this.handleResponse(responseParsed);
          return responseParsed.json();
        })
        .then(parsedBody => {
          console.log("parsedBody", parsedBody);
          this.setState({ createdRaster: parsedBody });
        });
    }
  };

  render() {

    const {currentRaster} = this.props;

    return (
      <div>
      {this.state.openOverlay ? (
        <ErrorOverlay
          isFetching={this.state.isFetching}
          history={this.props.history}
          errorMessage={this.state.modalErrorMessage}
          handleClose={() =>
            this.setState({ handlingDone: false, openOverlay: false })}
          currentRaster={this.props.currentRaster || this.state.createdRaster}
        />
      ) : null}
      <ManagementForm onSubmit={formData => this.onSubmit(formData, currentRaster)}
                      wizardStyle={this.props.wizardStyle}
      >

        <SelectBox
          name="selectedOrganisation"
          title="Organisation"
          subtitle="Specify which organisation owns this raster"
          placeholder="Choose an organisation"
          choices={this.props.organisations.available.map(organisation=>
            [organisation.uuid, organisation.name]
          )}
          validators={[required("Please select an organisation.")]}
          showSearchField={true}
          initial ={
            (
              currentRaster && 
              currentRaster.organisation && 
              currentRaster.organisation.uuid &&
              currentRaster.organisation.uuid
            ) || null
          }
        />
        <SlushBucket
          name="sharedWithOrganisations"
          title="Shared With Organisation"
          subtitle="Select other organisations that need read acces to this raster"
          choices={this.props.organisations.availableForRasterSharedWith.map(e =>{
            return {
              display: e.name, 
              value : e.uuid
            }
          })}
          readOnly={false}
          placeholder={"search organisations"}
          initial={
            (
            currentRaster && 
            currentRaster.shared_with && 
            currentRaster.shared_with.map((orgUuid) => {
              return orgUuid.uuid
            })
            ) || [] // passing this empty array is somehow required. Somehow only if I also have the colormapInput component.
          }
          validators={[]}
        />
        <SelectBox
          name="accessModifier"
          title="Authorization type"
          subtitle="Specify who can view this raster"
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
          validators={[required("Please select an access modifier.")]}
          initial ={
            (
              currentRaster && 
              currentRaster.access_modifier
            ) ||
            "Private" 
          }
          showSearchField={false}
        />
        <TextInput
          name="rasterName"
          title="Name of this Raster"
          placeholder="Name of this Raster"
          validators={[minLength(5)]}
          initial = {
            currentRaster && 
              currentRaster.name
          }
        />
        <TextArea
          name="description"
          placeholder="Fill in your description here"
          subtitle="Add a clear description of this raster with reference to the data source."
          validators={[minLength(1)]}
          initial = {
            currentRaster && 
              currentRaster.description
          }
        />
        <SelectBox
          name="aggregationType"
          title="Aggregation Type"
          subtitle="Specify how data should be displayed in region selection mode"
          placeholder="click to select aggregation type"
          choices={[
            [
              "none",
              "none",
              "no aggregation"
            ],
            [
              "counts",
              "counts",
              "area per category"
            ],
            [
              "curve",
              "curve",
              "cumulative distribution"
            ],
            [
              "sum",
              "sum",
              "values in the region are summed"
            ],
            [
              "average",
              "average",
              "values in the region are averaged"
            ]
          ]}
          validators={[required("Please select an aggregation type.")]}
          showSearchField={false}
          initial = {
            (
            currentRaster && 
            currentRaster.aggregation_type
            ) || null
          }
        />
        <SelectBox
          name="observationType"
          title="Observation Type"
          subtitle="Specify the physical quantity and unit of the data"
          placeholder="click to select observation type"
          choices={this.props.observationTypes.available.map(obsT=>{

            let parameterString = obsT.parameter + '';
            if (obsT.unit || obsT.reference_frame) {
              parameterString += ' ('
              if (obsT.unit) {
                parameterString += obsT.unit;
              }
              if (obsT.unit && obsT.reference_frame) {
                parameterString += ' ';
              }
              if (obsT.reference_frame) {
                parameterString += obsT.reference_frame;
              }
              parameterString += ')'
            }

            return [obsT.code, obsT.code, parameterString]

          })}
          validators={[required("Please select an observation type.")]}
          showSearchField={true}
          initial = {
            (
            currentRaster && 
            currentRaster.observation_type && 
            currentRaster.observation_type.code
            ) || null 
          }
        />
        <ColorMapInput
          name="colormap"
          title="Choose a color map"
          colorMaps={this.props.colorMaps.available.map(colM=>
            [colM.name, colM.name, colM.description]
          )}
          validators={[colorMapValidator(true)]}
          initial = {
            currentRaster && 
            { 
              options: currentRaster.options,
              rescalable: currentRaster.rescalable
            }

          }
        />
        <SelectBox
          name="supplierName"
          title="Supplier Name"
          subtitle="Optional: select the user that is allowed to change and delete this raster"
          placeholder="click to select supplier name"
          choices={this.props.supplierIds.available.map(obsT=>
            [obsT.username, obsT.username]
          )}
          // validators={[required("Please select a Supplier Name.")]}
          validators={[]}
          showSearchField={true}
          initial = {
            (
            currentRaster && 
            currentRaster.supplier
            ) || null
          }
        />
        <TextInput
          name="supplierCode"
          title="Supplier Code"
          placeholder="Fill in a supplier code here"
          subtitle="Provide a code for your own administration."
          validators={[minLength(1)]}
          initial = {
            currentRaster && 
            currentRaster.supplier_code
          }
        />
        <CheckBox
          name="temporal"
          title="Raster Series"
          label="Select whether you are creating a raster that contains multiple rasters over time"
          readonly={currentRaster}
          initial = {
            (
            currentRaster && 
            currentRaster.temporal
            ) || false
          }
        />
        <DurationField
          name="duration"
          disabled={(formValues) => formValues.temporal == false }
          title="Raster Series Interval"
          subtitle="Interval of raster series"
          validators={currentRaster?[]:[durationValidator(true)]}
          readOnly={currentRaster}
        />
      </ManagementForm>
      </div>
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
