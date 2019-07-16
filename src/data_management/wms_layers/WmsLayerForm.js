import React, { Component } from "react";

import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import ErrorOverlay from "../rasters/ErrorOverlay.js";

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
      <ManagementForm wizardStyle={this.props.wizardStyle}
      >
        <TextInput
          name="wmsLayerName"
          title={<FormattedMessage id="Wms layer name" />}
          placeholder={placeholderWmsLayerName}
          validators={[minLength(5)]}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.name
          }
          readOnly = {true}
        />
        <TextArea
          name="description"
          title={<FormattedMessage id="Description" />}
          subtitle={<FormattedMessage id="wms_layer_form.description_subtitle" />}
          placeholder={placeholderDescription}
          validators={[minLength(1)]}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.description
          }
          readOnly = {true}
        />
        <TextInput
          name="wmsLayerSlug"
          title={<FormattedMessage id="Slug" />}
          placeholder={placeholderSlug}
          validators={[minLength(5)]}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.slug
          }
          readOnly = {true}
        />
        <TextInput
          name="wmsLayerGetFeatureInfo"
          title={<FormattedMessage id="GetFeatureInfo" />}
          placeholder={placeholderGetFeatureInfo}
          validators={[minLength(1)]}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.get_feature_info
          }
          readOnly = {true}
        />
        <TextInput
          name="wmsLayerMinZoom"
          title={<FormattedMessage id="Min zoom" />}
          placeholder={placeholderMinZoom}
          validators={[minLength(1)]}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.min_zoom
          }
          readOnly = {true}
        />
        <TextInput
          name="wmsLayerMaxZoom"
          title={<FormattedMessage id="Max zoom" />}
          placeholder={placeholderMaxZoom}
          validators={[minLength(1)]}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.max_zoom
          }
          readOnly = {true}
        />
        <TextInput
          name="wmsLayerUrl"
          title={<FormattedMessage id="Url" />}
          placeholder={placeholderUrl}
          validators={[minLength(1)]}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.url
          }
          readOnly = {true}
        />
        <TextInput
          name="wmsLayerTiled"
          title={<FormattedMessage id="Tiled" />}
          placeholder={placeholderTiled}
          validators={[minLength(1)]}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.tiled
          }
          readOnly = {true}
        />
        <TextArea
          name="wmsLayerOptions"
          title={<FormattedMessage id="Options" />}
          subtitle={<FormattedMessage id="wms_layer_form.description_subtitle" />}
          placeholder={placeholderOptions}
          validators={[minLength(1)]}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.options
          }
          readOnly = {true}
        />
        <TextInput
          name="wmsLayerLegendUrl"
          title={<FormattedMessage id="Legend Url" />}
          placeholder={placeholderLegendUrl}
          validators={[minLength(1)]}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.legend_url
          }
          readOnly = {true}
        />
        <TextInput
          name="wmsLayerGetFeatureInfoUrl"
          title={<FormattedMessage id="GetFeatureInfo url" />}
          placeholder={placeholderGetFeatureInfoUrl}
          validators={[minLength(1)]}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.get_feature_info_url
          }
          readOnly = {true}
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
