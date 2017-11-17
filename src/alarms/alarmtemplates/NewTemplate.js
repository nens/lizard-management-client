import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { createTemplate } from "../../actions";
import styles from "./NewTemplate.css";
import tableStyles from "../../styles/Table.css";
import gridStyles from "../../styles/Grid.css";
import buttonStyles from "../../styles/Buttons.css";
import formStyles from "../../styles/Forms.css";
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

class NewTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateType: "email"
    };
    this.handleClickCreateTemplateButton = this.handleClickCreateTemplateButton.bind(
      this
    );
  }
  componentDidMount() {
    try {
      document.getElementById("templateName").focus();
    } catch (e) {
      console.log("Could not focus() on input element..");
    }
  }
  handleClickCreateTemplateButton() {
    const { templateType } = this.state;
    const { doCreateTemplate, organisation, history } = this.props;
    doCreateTemplate({
      name: document.getElementById("templateName").value,
      organisation: organisation.unique_id,
      type: templateType,
      subject:
        templateType === "email"
          ? document.getElementById("subject").value
          : document.getElementById("templateName").value,
      text: document.getElementById("templatePreview").value,
      html: document.getElementById("templatePreview").value
    });
    history.push("/alarms/templates");
  }
  render() {
    const { template, isFetching } = this.props;
    const { templateType } = this.state;

    const availableParameters = [
      {
        parameter: "[[var:from]]",
        description: "Name of the sender",
        templateType: "email"
      },
      {
        parameter: "[[var:from_email]]",
        description: "E-mail address of the sender",
        templateType: "email"
      },
      {
        parameter: "[[var:organisation_name]]",
        description: "Name of the sending organisation"
      },
      {
        parameter: "[[var:threshold_value]]",
        description: "Value of the threshold"
      },
      {
        parameter: "[[var:threshold_status]]",
        description: "Status of the threshold"
      },
      {
        parameter: "[[var:name]]",
        description: "First and last name of recipient"
      },
      {
        parameter: "[[var:email]]",
        description: "E-mail address of the recipient",
        templateType: "email"
      },
      {
        parameter: "[[var:phone_number]]",
        description: "Telephone number of recipient",
        templateType: "sms"
      }
    ];

    const parameterTableRows = availableParameters.map((parameter, i) => {
      if (
        !parameter.templateType ||
        parameter.templateType === this.state.templateType
      ) {
        return (
          <tr
            key={i}
            onClick={() => {
              document
                .getElementById("templatePreview")
                .insertAtCaret(parameter.parameter);
            }}
          >
            <td>{parameter.parameter}</td>
            <td>{parameter.description}</td>
          </tr>
        );
      }
      return null;
    });

    const parameterTable = (
      <table className={`${tableStyles.TableSmall} ${tableStyles.TableStriped} ${styles.ParameterTable}`}>
        <thead>
          <tr>
            <td><strong>Parameter</strong></td>
            <td><strong>Description</strong></td>
          </tr>
        </thead>
        <tbody>{parameterTableRows}</tbody>
      </table>
    );

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
      <div className={gridStyles.Container}>
        <div className={`${gridStyles.Row}`}>
          <div
            className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6} ${formStyles.FormGroup}`}
          >
            <input
              className={formStyles.FormControl}
              type="text"
              id="templateName"
              defaultValue=""
              placeholder=""
            />
            <small id="helpText" className="form-text text-muted">
              Please provide a name for this template
            </small>
          </div>
          <div
            className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6} ${formStyles.FormGroup}`}
          >
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  onChange={() => this.setState({ templateType: "email" })}
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  value="email"
                  checked={templateType === "email" ? true : false}
                />{" "}
                E-mail
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  onChange={() => this.setState({ templateType: "sms" })}
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio2"
                  value="sms"
                  checked={templateType === "sms" ? true : false}
                />{" "}
                SMS
              </label>
            </div>
          </div>
        </div>
        {templateType === "email" ? (
          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12} ${formStyles.FormGroup}`}
            >
              <input
                className={formStyles.FormControl}
                type="text"
                id="subject"
                defaultValue={template.subject}
              />
              <small id="helpText" className="form-text text-muted">
                The subject will be used in e-mail messages
              </small>
            </div>
          </div>
        ) : null}
        <div className={`${gridStyles.Row}`}>
          <div
            className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs12} ${formStyles.FormGroup}`}
          >
            <textarea
              spellCheck={false}
              className={formStyles.FormControl}
              id="templatePreview"
              rows="12"
              defaultValue={template.text}
            />
            <small className="text-muted">TEMPLATE</small>
          </div>
          <div
            className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs12} ${formStyles.FormGroup}`}
          >
            {parameterTable}
          </div>
        </div>
        <div className={`${gridStyles.Row}`}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12} ${formStyles.FormGroup}`}
          >
            <button
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              onClick={() => {
                this.handleClickCreateTemplateButton();
              }}
            >
              <FormattedMessage
                id="alarmtemplates_new.create_template"
                defaultMessage="Create template"
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
    isFetching: state.alarms.isFetching,
    organisation: state.bootstrap.organisation
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doCreateTemplate: data => dispatch(createTemplate(data))
  };
};

const App = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewTemplate)
);

export { App };
