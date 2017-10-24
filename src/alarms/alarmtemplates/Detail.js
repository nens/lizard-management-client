import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
// import pluralize from "pluralize";
import { connect } from "react-redux";
import { fetchAlarmTemplateDetailsById } from "../../actions";
import styles from "./Detail.css";
import { withRouter } from "react-router-dom";

HTMLTextAreaElement.prototype.insertAtCaret = function(text) {
  text = text || "";
  if (document.selection) {
    // IE
    this.focus();
    var sel = document.selection.createRange();
    sel.text = text;
  } else if (this.selectionStart || this.selectionStart === 0) {
    // Others
    var startPos = this.selectionStart;
    var endPos = this.selectionEnd;
    this.value =
      this.value.substring(0, startPos) +
      text +
      this.value.substring(endPos, this.value.length);
    this.selectionStart = startPos + text.length;
    this.selectionEnd = startPos + text.length;
  } else {
    this.value += text;
  }
};

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { match, doFetchTemplateDetails } = this.props;
    doFetchTemplateDetails(match.params.id);
  }
  render() {
    const { template, isFetching } = this.props;
    if (isFetching) {
      return (
        <div
          style={{
            position: "relative",
            top: 50,
            height: 300,
            bottom: 50,
            marginLeft: "50%"
          }}
        >
          <MDSpinner size={24} />
        </div>
      );
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h5>
              {template.name}{" "}
              <span className={`float-right ${styles.TemplateTypeBadge}`}>
                {template.type}
              </span>
            </h5>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 form-group">
            <input
              className="form-control"
              type="text"
              defaultValue={template.subject}
              placeholder="Provide a subject, please"
            />
          </div>
        </div>
        <div className="row">
          <div className="col form-group">
            <textarea
              spellCheck={false}
              className="form-control"
              id="templatePreview"
              rows="12"
              defaultValue={template.text}
            />
            <small className="text-muted">Template</small>
          </div>
          <div className="col">
            <table
              className={`table table-sm table-responsive table-striped ${styles.ParameterTable}`}
            >
              <thead>
                <tr>
                  <td>Parameter</td>
                  <td>Description</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  onClick={() => {
                    document
                      .getElementById("templatePreview")
                      .insertAtCaret("[[var:from]]");
                  }}
                >
                  <td>[[var:from]]</td>
                  <td>Name of the sender</td>
                </tr>
                <tr
                  onClick={() => {
                    document
                      .getElementById("templatePreview")
                      .insertAtCaret("[[var:from_email]]");
                  }}
                >
                  <td>[[var:from_email]]</td>
                  <td>E-mail address of the sender</td>
                </tr>
                <tr
                  onClick={() => {
                    document
                      .getElementById("templatePreview")
                      .insertAtCaret("[[var:organisation_name]]");
                  }}
                >
                  <td>[[var:organisation_name]]</td>
                  <td>Name of the sending organisation</td>
                </tr>
                <tr
                  onClick={() => {
                    document
                      .getElementById("templatePreview")
                      .insertAtCaret("[[var:threshold_value]]");
                  }}
                >
                  <td>[[var:threshold_value]]</td>
                  <td>Value of the threshold</td>
                </tr>
                <tr
                  onClick={() => {
                    document
                      .getElementById("templatePreview")
                      .insertAtCaret("[[var:threshold_status]]");
                  }}
                >
                  <td>[[var:threshold_status]]</td>
                  <td>Status of the threshold</td>
                </tr>
                <tr
                  onClick={() => {
                    document
                      .getElementById("templatePreview")
                      .insertAtCaret("[[var:name]]");
                  }}
                >
                  <td>[[var:name]]</td>
                  <td>First and last name of recipient</td>
                </tr>
                <tr
                  onClick={() => {
                    document
                      .getElementById("templatePreview")
                      .insertAtCaret("[[var:email]]");
                  }}
                >
                  <td>[[var:email]]</td>
                  <td>E-mail address of the recipient</td>
                </tr>
                <tr
                  onClick={() => {
                    document
                      .getElementById("templatePreview")
                      .insertAtCaret("[[var:phone_number]]");
                  }}
                >
                  <td>[[var:phone_number]]</td>
                  <td>Telephone number of recipient</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => console.log("Save template")}
            >
              <FormattedMessage
                id="alarmtemplates_app.save_template"
                defaultMessage="Save template"
              />
              <Ink />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    template: state.alarms.template,
    isFetching: state.alarms.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doFetchTemplateDetails: id => {
      dispatch(fetchAlarmTemplateDetailsById(id));
    }
  };
};

Detail = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));

export { Detail };
