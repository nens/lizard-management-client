import React, { Component } from "react";

import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import ErrorOverlay from "./ErrorOverlay.js";

import "../../forms/validators";

import ManagementForm from "../../forms/ManagementForm";
import TextInput from "../../forms/TextInput";
import IntegerInput from "../../forms/IntegerInput";
import TextArea from "../../forms/TextArea";
import SelectBox from "../../forms/SelectBox";
import CheckBox from "../../forms/CheckBox";
import SlushBucket from "../../forms/SlushBucket";
import SpatialBoundsField, { spatialBoundsValidator } from "../../forms/SpatialBoundsField";

import {
  minLength,
  maxLength,
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
      geoServerError: false,
    }
  }

  showGeoServerError = () => {
    this.setState({
        geoServerError: true
    });
  }

  hideGeoServerError = () => {
    this.setState({
        geoServerError: false
    });
  }

  minZoomValidator = (value, allValues) => {
    if (
      parseInt(value) >= 0 &&
      parseInt(value) <= 31 //&&
    ) {
      return false;
    } else {
      return this.props.intl.formatMessage({ id: "wms_layer_form.choose_between_0_31" }); // "Choose a value between 0 and 31"
    }
  }
  
  maxZoomValidator = (value, allValues) => {
    const minZoom = 
      ( allValues.wmsLayerMinZoom === "" || allValues.wmsLayerMinZoom === null || allValues.wmsLayerMinZoom === undefined)?
      0
      :
      allValues.wmsLayerMinZoom
  
    if (
      parseInt(value) >= 0 &&
      parseInt(value) <= 31 &&
      parseInt(value) >= minZoom 
    ) {
      return false;
    } else if (
      parseInt(value) >= 0 &&
      parseInt(value) <= 31 &&
      parseInt(value) < minZoom
    ) {
      return this.props.intl.formatMessage({ id: "wms_layer_form.choose_maxzoom_greater_minzoom" }); //'Choose "max zoom" greater then "min zoom"';
    } else {
      return this.props.intl.formatMessage({ id: "wms_layer_form.choose_between_0_31" }); // "Choose a value between 0 and 31"
    }
  }

  getFeatureInfoUrlValidator = (value, allValues) => {
    if (allValues.wmsLayerGetFeatureInfo !== true) {
      return false;
    } else if (value === null || value === undefined || value.length === 0) {
      return this.props.intl.formatMessage({ id: "wms_layer_form.isrequired_if_getfeatureinfo_is_true" }); 
    } else {
      return false;
    }
  }

  optionsValidator = (value) => {
    try{
      JSON.parse(value);
      return false;
    } catch (error) {
      console.log(error);
      return this.props.intl.formatMessage({ id: "wms_layer_form.options_must_be_json" }); 
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
          wms_url: validatedData.wmsLayerUrl,
          slug: validatedData.wmsLayerSlug,
          download_url: validatedData.wmsLayerDownloadUrl,
          min_zoom: validatedData.wmsLayerMinZoom,
          max_zoom: validatedData.wmsLayerMaxZoom,
          spatial_bounds: validatedData.wmsLayerSpatialBounds,
          options: validatedData.wmsLayerOptions,
          get_feature_info: validatedData.wmsLayerGetFeatureInfo,
          get_feature_info_url: validatedData.wmsLayerGetFeatureInfoUrl,
          legend_url: validatedData.wmsLayerLegendUrl,
          shared_with: validatedData.sharedWithOrganisations,
          access_modifier: validatedData.accessModifier,
          supplier: validatedData.supplierName,
        })
      };

      fetch(url, opts)
        .then(responseParsed => {
          this.handleResponse(responseParsed);
          return responseParsed.json();
        })
        .then(parsedBody => {
          this.setState({ createdWmsLayer: parsedBody });
        });
    } else {
      let body = {
        organisation: validatedData.selectedOrganisation,
        name: validatedData.wmsLayerName,
        description: validatedData.description,
        wms_url: validatedData.wmsLayerUrl,
        slug: validatedData.wmsLayerSlug,
        download_url: validatedData.wmsLayerDownloadUrl,
        min_zoom: validatedData.wmsLayerMinZoom,
        max_zoom: validatedData.wmsLayerMaxZoom,
        spatial_bounds: validatedData.wmsLayerSpatialBounds,
        options: validatedData.wmsLayerOptions,
        get_feature_info: validatedData.wmsLayerGetFeatureInfo,
        get_feature_info_url: validatedData.wmsLayerGetFeatureInfoUrl,
        legend_url: validatedData.wmsLayerLegendUrl,
        shared_with: validatedData.sharedWithOrganisations,
        access_modifier: validatedData.accessModifier,
        supplier: validatedData.supplierName,
      };
      const opts = {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      };

      fetch(url + "uuid:" + currentWmsLayer.uuid + "/", opts)
        .then(responseParsed => {
          this.handleResponse(responseParsed);
          return responseParsed.json();
        })
        .then(parsedBody => {
          this.setState({ createdWmsLayer: parsedBody });
        });
    }
  };

  render() {

    const { currentWmsLayer, intl, organisations } = this.props;

    //Format message for placeholder in the input form for translation
    const placeholderWmsLayerName = intl.formatMessage({ id: "placeholder_wms_layer_name" });
    const placeholderDescription = intl.formatMessage({ id: "placeholder_description" });
    const placeholderSlug = intl.formatMessage({ id: "placeholder_slug" });
    const placeholderMinZoom = intl.formatMessage({ id: "placeholder_min_zoom" });
    const placeholderMaxZoom = intl.formatMessage({ id: "placeholder_max_zoom" });
    const placeholderUrl = intl.formatMessage({ id: "placeholder_url" });
    const placeholderLegendUrl = intl.formatMessage({ id: "placeholder_legend_url" });
    const placeholderGetFeatureInfoUrl = intl.formatMessage({ id: "placeholder_get_feature_info_url" });
    const placeholderOrganisationSelection = intl.formatMessage({ id: "placeholder_organisation_selection" });
    const placeholderOrganisationSearch = intl.formatMessage({ id: "placeholder_organisation_search" });
    const placeholderSupplierName = intl.formatMessage({ id: "placeholder_supplier_name" });

    return (
      <div onClick={this.hideGeoServerError}>
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
          subtitle={<FormattedMessage id="wms_layer_form.organisation_subtitle"  />}
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
              currentWmsLayer.organisation.uuid.replace(/-/g, "") //pass in organisation uuid without dashes
            ) || organisations.selected.uuid
          }
        />
        <SlushBucket
          name="sharedWithOrganisations"
          title={<FormattedMessage id="raster_form.sharedOrganisation" />}
          subtitle={<FormattedMessage id="wms_layer_form.sharedOrganisation_subtitle" />}
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
            currentWmsLayer && 
            currentWmsLayer.shared_with && 
            currentWmsLayer.shared_with.map((orgUuid) => {
              return orgUuid.uuid.replace(/-/g, "") //pass in organisation uuid without dashes
            })
            ) || [] // passing this empty array is somehow required. Somehow only if I also have the colormapInput component.
          }
          validators={[]}
        />
        <SelectBox
          name="accessModifier"
          title={<FormattedMessage id="raster_form.authorization" />}
          subtitle={<FormattedMessage id="wms_layer_form.authorization_subtitle" />}
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
          validators={[required(this.props.intl.formatMessage({ id: "wms_layer_form.please_select_accesmodifier" }))]}
          initial ={
            (
              currentWmsLayer && 
              currentWmsLayer.access_modifier
            ) ||
            "Private" 
          }
          showSearchField={false}
        />
        <SelectBox
          name="supplierName"
          title={<FormattedMessage id="raster_form.supplierName" />}
          subtitle={<FormattedMessage id="wms_layer_form.supplierName_subtitle" />}
          placeholder={placeholderSupplierName}
          choices={this.props.supplierIds.available.map(obsT=>
            [obsT.username, obsT.username]
          )}
          // validators={[required("Please select a Supplier Name.")]}
          validators={[]}
          showSearchField={true}
          initial = {
            (
            currentWmsLayer && 
            currentWmsLayer.supplier
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
          validators={[minLength(5), maxLength(80)]}
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
              currentWmsLayer.wms_url
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
        <TextInput
          name="wmsLayerDownloadUrl"
          title={<FormattedMessage id="wms_layer_form.download_url" />}
          placeholder={placeholderUrl}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.download_url
          }
        />
        <IntegerInput
          name="wmsLayerMinZoom"
          title={<FormattedMessage id="wms_layer_form.min_zoom" />}
          subtitle={<FormattedMessage id="wms_layer_form.integer_from_0_till_31" />}
          placeholder={placeholderMinZoom}
          initial = {
            (currentWmsLayer &&
            (currentWmsLayer.min_zoom || currentWmsLayer.min_zoom === 0) && 
              currentWmsLayer.min_zoom.toString()) || '0'
          }
          validators={[this.minZoomValidator]}
        />
        <IntegerInput
          name="wmsLayerMaxZoom"
          title={<FormattedMessage id="wms_layer_form.max_zoom" />}
          subtitle={<FormattedMessage id="wms_layer_form.integer_from_0_till_31_more_then_minzoom" />}
          placeholder={placeholderMaxZoom}
          initial = {
            (currentWmsLayer &&
              (currentWmsLayer.max_zoom || currentWmsLayer.max_zoom === 0) && 
                currentWmsLayer.max_zoom.toString()) || 31
          }
          validators={[this.maxZoomValidator]}
        />
        <SpatialBoundsField
          name="wmsLayerSpatialBounds"
          title={<FormattedMessage id="wms_layer_form.spatial_bounds" />}
          subtitle={<FormattedMessage id="wms_layer_form.add_spatial_bounds" />}
          initial = {
            (
              currentWmsLayer &&
              currentWmsLayer.spatial_bounds
            ) || null
          }
          validators={[spatialBoundsValidator]}
          geoServerError={this.state.geoServerError}
          showGeoServerError={this.showGeoServerError}
        />
        <TextArea
          name="wmsLayerOptions"
          title={<FormattedMessage id="wms_layer_form.options" />}
          subtitle={<FormattedMessage id="wms_layer_form.options_must_be_json" />}
          initial = {
            (currentWmsLayer &&
              JSON.stringify(currentWmsLayer.options)) || '{"transparent": "True"}'
          }
          validators={[this.optionsValidator]}
        />
        <CheckBox
          name="wmsLayerGetFeatureInfo"
          title={<FormattedMessage id="wms_layer_form.get_feature_info" />}
          initial = {
            (currentWmsLayer &&
              currentWmsLayer.get_feature_info) || false
          }
        />
        <TextInput
          name="wmsLayerGetFeatureInfoUrl"
          title={<FormattedMessage id="wms_layer_form.get_feature_info_url" />}
          placeholder={placeholderGetFeatureInfoUrl}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.get_feature_info_url
          }
          validators={[this.getFeatureInfoUrlValidator]}
        />
        <TextInput
          name="wmsLayerLegendUrl"
          title={<FormattedMessage id="wms_layer_form.legend_url" />}
          placeholder={placeholderLegendUrl}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.legend_url
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

const WmsLayerForm = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(WmsLayerFormModel))
);

export { WmsLayerForm };
