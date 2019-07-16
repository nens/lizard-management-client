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

  onSubmit = (validatedData, currentWmsLayer) => {

    this.setState({ isFetching: true, openOverlay: true });

    const url = "/api/v3/wmslayers/";
     if (!currentWmsLayer) {
      const opts = {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: validatedData.wmsLayerName,
          description: validatedData.description,
          options: validatedData.colormap.options,
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
        description: validatedData.description,
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
        <TextInput
          name="wmsLayerName"
          title={<FormattedMessage id="Wms layer name" />}
          placeholder={placeholderWmsLayerName}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.name
          }
        />
        <TextArea
          name="description"
          title={<FormattedMessage id="Description" />}
          subtitle={<FormattedMessage id="wms_layer_form.description_subtitle" />}
          placeholder={placeholderDescription}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.description
          }
        />
        <TextInput
          name="wmsLayerSlug"
          title={<FormattedMessage id="Slug" />}
          placeholder={placeholderSlug}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.slug
          }
        />
        <TextInput
          name="wmsLayerGetFeatureInfo"
          title={<FormattedMessage id="GetFeatureInfo" />}
          placeholder={placeholderGetFeatureInfo}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.get_feature_info
          }
        />
        <TextInput
          name="wmsLayerMinZoom"
          title={<FormattedMessage id="Min zoom" />}
          placeholder={placeholderMinZoom}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.min_zoom
          }
        />
        <TextInput
          name="wmsLayerMaxZoom"
          title={<FormattedMessage id="Max zoom" />}
          placeholder={placeholderMaxZoom}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.max_zoom
          }
        />
        <TextInput
          name="wmsLayerUrl"
          title={<FormattedMessage id="Url" />}
          placeholder={placeholderUrl}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.url
          }
        />
        <TextInput
          name="wmsLayerTiled"
          title={<FormattedMessage id="Tiled" />}
          placeholder={placeholderTiled}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.tiled
          }
        />
        <TextArea
          name="wmsLayerOptions"
          title={<FormattedMessage id="Options" />}
          subtitle={<FormattedMessage id="wms_layer_form.description_subtitle" />}
          placeholder={placeholderOptions}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.options
          }
        />
        <TextInput
          name="wmsLayerLegendUrl"
          title={<FormattedMessage id="Legend Url" />}
          placeholder={placeholderLegendUrl}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.legend_url
          }
        />
        <TextInput
          name="wmsLayerGetFeatureInfoUrl"
          title={<FormattedMessage id="GetFeatureInfo url" />}
          placeholder={placeholderGetFeatureInfoUrl}
          initial = {
            currentWmsLayer &&
              currentWmsLayer.get_feature_info_url
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
