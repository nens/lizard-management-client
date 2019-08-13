import React, { Component } from "react";

import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import ErrorOverlay from "./ErrorOverlay.js";

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
  minLength,
  required
} from "../../forms/validators";


class WmsLayerFormModel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      openOverlay: false,
      modalErrorMessage: "",
      createdWmsLayer: null,
    }
  }

  handleResponse(response) {
    this.setState({
      modalErrorMessage: response,
      isFetching: false,
      handlingDone: true
    });
  }

  onSubmit = (validatedData, currentWmsLayer) => {

    this.setState({ isFetching: true, openOverlay: true });

    const url = "/api/v4/wmslayers/";
     if (!currentWmsLayer) {
      const opts = {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organisation: validatedData.selectedOrganisation,
          name: validatedData.wmsLayerName,
          description: validatedData.description,
          url: validatedData.wmsLayerUrl,
          slug: validatedData.wmsLayerSlug,
          min_zoom: validatedData.wmsLayerMinZoom,
          max_zoom: validatedData.wmsLayerMaxZoom,
          options: validatedData.wmsLayerOptions,
          get_feature_info: validatedData.wmsLayerGetFeatureInfo,
          get_feature_info_url: validatedData.wmsLayerGetFeatureInfoUrl,
          legend_url: validatedData.wmsLayerLegendUrl,
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
        organisation: validatedData.selectedOrganisation,
        name: validatedData.wmsLayerName,
        description: validatedData.description,
        url: validatedData.wmsLayerUrl,
        slug: validatedData.wmsLayerSlug,
        min_zoom: validatedData.wmsLayerMinZoom,
        max_zoom: validatedData.wmsLayerMaxZoom,
        options: validatedData.wmsLayerOptions,
        get_feature_info: validatedData.wmsLayerGetFeatureInfo,
        get_feature_info_url: validatedData.wmsLayerGetFeatureInfoUrl,
        legend_url: validatedData.wmsLayerLegendUrl,
      };
      const opts = {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      };

      fetch(url + "uuid:" + currentWmsLayer.uuid + "/", opts)
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

    const { currentWmsLayer, intl } = this.props;

    //Format message for placeholder in the input form for translation
    const placeholderWmsLayerName = intl.formatMessage({ id: "placeholder_wms_layer_name" });
    const placeholderDescription = intl.formatMessage({ id: "placeholder_description" });
    const placeholderSlug = intl.formatMessage({ id: "placeholder_slug" });
    const placeholderGetFeatureInfo = intl.formatMessage({ id: "placeholder_get_feature_info" });
    const placeholderMinZoom = intl.formatMessage({ id: "placeholder_min_zoom" });
    const placeholderMaxZoom = intl.formatMessage({ id: "placeholder_max_zoom" });
    const placeholderUrl = intl.formatMessage({ id: "placeholder_url" });
    const placeholderTiled = intl.formatMessage({ id: "placeholder_tiled" });
    const placeholderOptions = intl.formatMessage({ id: "placeholder_options" });
    const placeholderLegendUrl = intl.formatMessage({ id: "placeholder_legend_url" });
    const placeholderGetFeatureInfoUrl = intl.formatMessage({ id: "placeholder_get_feature_info_url" });
    const placeholderOrganisationSelection = intl.formatMessage({ id: "placeholder_organisation_selection" });

    return (
      <div>
      {this.state.openOverlay ? (
        <ErrorOverlay
          isFetching={this.state.isFetching}
          history={this.props.history}
          errorMessage={this.state.modalErrorMessage}
          handleClose={() =>
            this.setState({ handlingDone: false, openOverlay: false })}
          currentWmsLayer={this.props.currentWmsLayer || this.state.createdWmsLayer}
        />
      ) : null}
      <ManagementForm  onSubmit={formData => this.onSubmit(formData, currentWmsLayer)}
                       wizardStyle={this.props.wizardStyle}
      >
        <SelectBox
          name="selectedOrganisation"
          title={<FormattedMessage id="wms_layer_form.organisation" />}
          subtitle={<FormattedMessage id="raster_form.organisation_subtitle"  />}
          placeholder={placeholderOrganisationSelection}
          choices={this.props.organisations.available.map(organisation=>
            [organisation.uuid, organisation.name]
          )}
          validators={[required("Please select an organisation.")]}
          showSearchField={true}
          initial ={
            (
              currentWmsLayer && 
              currentWmsLayer.organisation && 
              currentWmsLayer.organisation.uuid &&
              currentWmsLayer.organisation.uuid
            ) || null
          }
        />
        <TextInput
          name="wmsLayerName"
          title={<FormattedMessage id="wms_layer_form.wmsLayerName" />}
          placeholder={placeholderWmsLayerName}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.name
          }
          validators={[minLength(5)]}
        />
        <TextArea
          name="description"
          title={<FormattedMessage id="wms_layer_form.description" />}
          subtitle={<FormattedMessage id="wms_layer_form.description_subtitle" />}
          placeholder={placeholderDescription}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.description
          }
          validators={[minLength(1)]}
        />
        <TextInput
          name="wmsLayerUrl"
          title={<FormattedMessage id="wms_layer_form.url" />}
          placeholder={placeholderUrl}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.url
          }
          validators={[minLength(1)]}
        />
        <TextInput
          name="wmsLayerSlug"
          title={<FormattedMessage id="wms_layer_form.slug" />}
          placeholder={placeholderSlug}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.slug
          }
          validators={[minLength(1)]}
        />
        {/* According to my (Tom) understanding this field is no longer needed */}
        {/* <TextInput
          name="wmsLayerTiled"
          title={<FormattedMessage id="wms_layer_form.tiled" />}
          placeholder={placeholderTiled}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.tiled
          }
        /> */}
        <TextInput
          name="wmsLayerMinZoom"
          title={<FormattedMessage id="wms_layer_form.min_zoom" />}
          placeholder={placeholderMinZoom}
          initial = {
            (currentWmsLayer &&
            (currentWmsLayer.min_zoom || currentWmsLayer.min_zoom === 0) && 
              currentWmsLayer.min_zoom.toString()) || null
          }
          validators={[minLength(1)]}
        />
        <TextInput
          name="wmsLayerMaxZoom"
          title={<FormattedMessage id="wms_layer_form.max_zoom" />}
          placeholder={placeholderMaxZoom}
          initial = {
            (currentWmsLayer &&
              (currentWmsLayer.max_zoom || currentWmsLayer.max_zoom === 0) && 
                currentWmsLayer.max_zoom.toString()) || null
          }
          validators={[minLength(1)]}
        />
        <TextArea
          name="wmsLayerOptions"
          title={<FormattedMessage id="wms_layer_form.options" />}
          placeholder={placeholderOptions}
          initial = {
            currentWmsLayer &&
              JSON.stringify(currentWmsLayer.options)
          }
          validators={[minLength(1)]}
        />
        <TextInput
          name="wmsLayerGetFeatureInfo"
          title={<FormattedMessage id="wms_layer_form.get_feature_info" />}
          placeholder={placeholderGetFeatureInfo}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.get_feature_info
          }
          validators={[minLength(1)]}
        />
        <TextInput
          name="wmsLayerGetFeatureInfoUrl"
          title={<FormattedMessage id="wms_layer_form.get_feature_info_url" />}
          placeholder={placeholderGetFeatureInfoUrl}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.get_feature_info_url
          }
          validators={[minLength(1)]}
        />
        <TextInput
          name="wmsLayerLegendUrl"
          title={<FormattedMessage id="wms_layer_form.legend_url" />}
          placeholder={placeholderLegendUrl}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.legend_url
          }
          validators={[minLength(1)]}
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

const WmsLayerForm = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(WmsLayerFormModel))
);

export { WmsLayerForm };
