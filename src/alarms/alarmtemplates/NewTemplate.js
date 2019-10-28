import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styles from "./NewTemplate.css";
import tableStyles from "../../styles/Table.css";
import gridStyles from "../../styles/Grid.css";
import buttonStyles from "../../styles/Buttons.css";
import formStyles from "../../styles/Forms.css";
import { withRouter } from "react-router-dom";

class NewTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateType: "email",
      templateText: ""
    };
    this.handleClickCreateTemplateButton = this.handleClickCreateTemplateButton.bind(
      this
    );
    this.updateTemplateText = this.updateTemplateText.bind(this);
  }
  componentDidMount() {
    try {
      document.getElementById("templateName").focus();
    } catch (e) {
      console.error("Could not focus() on input element..");
    }
  }
  handleClickCreateTemplateButton() {
    const { templateType, templateText } = this.state;
    const { selectedOrganisation, history } = this.props;
    const organisationId = selectedOrganisation.uuid;

    const url = "/api/v3/messages/";
    const opts = {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("templateName").value,
        organisation: organisationId,
        type: templateType,
        subject:
          templateType === "email"
            ? document.getElementById("subject").value
            : document.getElementById("templateName").value,
        text: templateText,
        html: templateText
      })
    };

    fetch(url, opts)
      .then(response => response.json()) // TODO: kan dit weg?
      .then(_ => {
        history.push("/alarms/templates/");
      });
  }
  updateTemplateText(templateText, text) {
    var newTemplateText = templateText + text;
    console.log(newTemplateText);
    this.setState({
      templateText: newTemplateText
    });
  }
  render() {
    const { templateType, templateText, isFetching } = this.state; // isFetching staat niet in state?

    const availableParameters = [
      {
        parameter: "[[var:from]]", // [[var:{{from}}]]
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
      if (!parameter.templateType || parameter.templateType === templateType) {
        return (
          <tr
            key={parameter.parameter}
            onClick={() => {
              console.log(templateText); //aasdsd
              this.updateTemplateText(templateText, parameter.parameter);
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
      <table
        className={`${tableStyles.TableSmall} ${tableStyles.TableStriped} ${styles.ParameterTable}`}
      >
        <thead>
          <tr>
            <td>
              <strong>
                {" "}
                <FormattedMessage
                  id="alarmtemplates_app.parameter"
                  defaultMessage="Parameter"
                />
              </strong>
            </td>
            <td>
              <strong>
                {" "}
                <FormattedMessage
                  id="alarmtemplates_app.description"
                  defaultMessage="Description"
                />
              </strong>
            </td>
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
              <FormattedMessage
                id="alarmtemplates_app.please_provide_a_name"
                defaultMessage="Please provide a name for this template"
              />
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
                defaultValue=""
              />
              <small id="helpText" className="form-text text-muted">
                <FormattedMessage
                  id="alarmtemplates_app.the_subject_will_be_used_in_email_messages"
                  defaultMessage="The subject will be used in e-mail messages"
                />
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
              value={templateText}
              onChange={e =>
                // console.log(templateText)
                this.setState({
                  templateText: e.target.value
                })}
            />
            <small className="text-muted">
              <FormattedMessage
                id="alarmtemplates_app.template"
                defaultMessage="Template"
              />{" "}
              ({templateText.length}{" "}
              <FormattedMessage
                id="alarmtemplates_new.characters"
                defaultMessage="characters"
              />)<br />
              {templateType === "sms" ? (
                <i>
                  <FormattedMessage
                    id="alarmtemplates_new.sms_max_char_warning"
                    defaultMessage="SMS messages have a limit of 160 characters after substituting the parameter tags"
                  />
                </i>
              ) : null}
            </small>
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
    selectedOrganisation: state.organisations.selected
  };
};

const App = withRouter(connect(mapStateToProps, null)(NewTemplate));

export { App };
