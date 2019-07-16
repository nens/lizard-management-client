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
          title={<FormattedMessage id="wms_layer_form.wmsLayerName" />}
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
          title={<FormattedMessage id="wms_layer_form.description" />}
          subtitle={<FormattedMessage id="wms_layer_form.description_subtitle" />}
          placeholder={placeholderDescription}
          validators={[minLength(1)]}
          initial = {
            currentWmsLayer && 
              currentWmsLayer.description
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
