import React, { Component } from "react";

import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import ErrorOverlay from "./ErrorOverlay.js";

import "../../forms/validators";
import {toISOValue, rasterIntervalStringServerToDurationObject} from "../../utils/isoUtils"
import { createRaster, patchRaster } from "../../api/rasters";

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

    if (!currentRaster) {
      const raster = {
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
      };

      createRaster(raster).then(
        responseParsed => {
          this.handleResponse(responseParsed);
          return responseParsed.json();
        }).then(
          parsedBody => {
            console.log("parsedBody", parsedBody);
            this.setState({ createdRaster: parsedBody });
          });
    } else {
      const body = {
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

      patchRaster(currentRaster.uuid, body).then(({response, raster}) => {
        this.handleResponse(response);
        this.setState({ createdRaster: raster });
      });
    }
  };

  render() {

    const { currentRaster, intl } = this.props;

    //Format message for placeholder in the input form for translation
    const placeholderOrganisationSelection = intl.formatMessage({ id: "placeholder_organisation_selection" });
    const placeholderOrganisationSearch = intl.formatMessage({ id: "placeholder_organisation_search" });
    const placeholderRasterName = intl.formatMessage({ id: "placeholder_raster_name" });
    const placeholderDescription = intl.formatMessage({ id: "placeholder_description" });
    const placeholderAggregation = intl.formatMessage({ id: "placeholder_aggregation" });
    const placeholderObservation = intl.formatMessage({ id: "placeholder_observation" });
    const placeholderSupplierName = intl.formatMessage({ id: "placeholder_supplier_name" });
    const placeholderSupplierCode = intl.formatMessage({ id: "placeholder_supplier_code" });

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
          title={<FormattedMessage id="raster_form.organisation" />}
          subtitle={<FormattedMessage id="raster_form.organisation_subtitle"  />}
          placeholder={placeholderOrganisationSelection}
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
              currentRaster.organisation.uuid.replace(/-/g, "")
            ) || null
          }
        />
        <SlushBucket
          name="sharedWithOrganisations"
          title={<FormattedMessage id="raster_form.sharedOrganisation" />}
          subtitle={<FormattedMessage id="raster_form.sharedOrganisation_subtitle" />}
          choices={this.props.organisations.availableForRasterSharedWith.map(e =>{
            return {
              display: e.name, 
              value : e.uuid
            }
          })}
          readOnly={false}
          placeholder={placeholderOrganisationSearch}
          initial={
            (
            currentRaster && 
            currentRaster.shared_with && 
            currentRaster.shared_with.map((orgUuid) => {
              return orgUuid.uuid.replace(/-/g, "")
            })
            ) || [] // passing this empty array is somehow required. Somehow only if I also have the colormapInput component.
          }
          validators={[]}
        />
        <SelectBox
          name="accessModifier"
          title={<FormattedMessage id="raster_form.authorization" />}
          subtitle={<FormattedMessage id="raster_form.authorization_subtitle" />}
          choices={[
            [
              "Private",
              "Private",
              <FormattedMessage id="raster_form.authorization_private_message" />
            ],
            [
              "Common",
              "Common",
              <FormattedMessage id="raster_form.authorization_common_message" />
            ],
            [
              "Public",
              "Public",
              <FormattedMessage id="raster_form.authorization_public_message" />
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
          title={<FormattedMessage id="raster_form.rasterName" />}
          placeholder={placeholderRasterName}
          validators={[minLength(5)]}
          initial = {
            currentRaster && 
              currentRaster.name
          }
        />
        <TextArea
          name="description"
          title={<FormattedMessage id="raster_form.description" />}
          subtitle={<FormattedMessage id="raster_form.description_subtitle" />}
          placeholder={placeholderDescription}
          validators={[minLength(1)]}
          initial = {
            currentRaster && 
              currentRaster.description
          }
        />
        <SelectBox
          name="aggregationType"
          title={<FormattedMessage id="raster_form.aggregation" />}
          subtitle={<FormattedMessage id="raster_form.aggregation_subtitle" />}
          placeholder={placeholderAggregation}
          choices={[
            [
              "none",
              "none",
              <FormattedMessage id="raster_form.aggregation_type_none" />
            ],
            [
              "counts",
              "counts",
              <FormattedMessage id="raster_form.aggregation_type_counts" />
            ],
            [
              "curve",
              "curve",
              <FormattedMessage id="raster_form.aggregation_type_curve" />
            ],
            [
              "sum",
              "sum",
              <FormattedMessage id="raster_form.aggregation_type_sum" />
            ],
            [
              "average",
              "average",
              <FormattedMessage id="raster_form.aggregation_type_average" />
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
          title={<FormattedMessage id="raster_form.observation" />}
          subtitle={<FormattedMessage id="raster_form.observation_subtitle" />}
          placeholder={placeholderObservation}
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
          title={<FormattedMessage id="raster_form.colormap" />}
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
          title={<FormattedMessage id="raster_form.supplierName" />}
          subtitle={<FormattedMessage id="raster_form.supplierName_subtitle" />}
          placeholder={placeholderSupplierName}
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
          title={<FormattedMessage id="raster_form.supplierCode" />}
          subtitle={<FormattedMessage id="raster_form.supplierCode_subtitle" />}
          placeholder={placeholderSupplierCode}
          validators={[minLength(1)]}
          initial = {
            currentRaster && 
            currentRaster.supplier_code
          }
        />
        <CheckBox
          name="temporal"
          title={<FormattedMessage id="raster_form.rasterSeries" />}
          label={<FormattedMessage id="raster_form.rasterSeries_label" />}
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
          disabled={(formValues) => formValues.temporal === false }
          title={<FormattedMessage id="raster_form.duration" />}
          subtitle={<FormattedMessage id="raster_form.duration_subtitle" />}
          validators={currentRaster?[]:[durationValidator(true)]}
          readOnly={currentRaster}
          initial = {
            currentRaster && 
            currentRaster.interval &&
            toISOValue(rasterIntervalStringServerToDurationObject(currentRaster.interval))
          }
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
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(RasterFormModel))
);

export { RasterForm };
