import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
// import pluralize from "pluralize";
import { connect } from "react-redux";
import {
  fetchAlarmTemplateDetailsById,
  fetchPaginatedTemplates,
  updateTemplate,
  removeAlarmById
} from "../../actions";
import styles from "./Detail.css";
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

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSaveTemplate = this.handleSaveTemplate.bind(this);
    this.handleDeleteTemplate = this.handleDeleteTemplate.bind(this);
  }
  componentDidMount() {
    const { match, doFetchTemplateDetails } = this.props;
    doFetchTemplateDetails(match.params.id);
  }
  handleDeleteTemplate() {
    const { doDeleteTemplateById, match } = this.props;
    doDeleteTemplateById(match.params.id);
  }
  handleSaveTemplate() {
    const { doSaveTemplateById, match } = this.props;
    const subject = this.messageSubject.value;
    const body = this.messageBody.value;

    if (body) {
      doSaveTemplateById(
        {
          subject,
          body
        },
        match.params.id
      );
    } else {
      alert("Please provide a template text");
    }
  }
  render() {
    const { template, isFetching } = this.props;

    if (isFetching || !template) {
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
      if (!parameter.templateType || parameter.templateType === template.type) {
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
      <table
        className={`${tableStyles.TableSmall} ${tableStyles.TableStriped} ${styles.ParameterTable}`}
      >
        <thead>
          <tr>
            <td>Parameter</td>
            <td>Description</td>
          </tr>
        </thead>
        <tbody>{parameterTableRows}</tbody>
      </table>
    );

    return (
      <div className={gridStyles.Container}>
        <div className={`${gridStyles.Row}`}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            <div
              className={`${gridStyles.FloatRight} ${styles.TemplateTypeBadge}`}
            >
              {template.type}
            </div>
            <h5>{template.name} </h5>
            <hr />
          </div>
        </div>
        <div className={`${gridStyles.Row}`}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12} ${formStyles.FormGroup}`}
          >
            <input
              className={formStyles.FormControl}
              type="text"
              defaultValue={template.subject}
              placeholder="Provide a subject, please"
              ref={subject => {
                this.messageSubject = subject;
              }}
            />
          </div>
        </div>
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
              ref={body => {
                this.messageBody = body;
              }}
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
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            <button
              type="button"
              style={{
                float: "right"
              }}
              className={`${buttonStyles.Button} ${buttonStyles.Danger} ${buttonStyles.Small}`}
              onClick={this.handleDeleteTemplate}
            >
              <FormattedMessage
                id="alarmtemplates_app.delete_template"
                defaultMessage="Delete template"
              />
              <Ink />
            </button>
            <button
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              onClick={this.handleSaveTemplate}
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
    template: state.alarms._templates.currentTemplate || null,
    isFetching: state.alarms._templates.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doDeleteTemplateById: id => {
      dispatch(removeAlarmById(id));
      ownProps.history.push("/alarms/templates");
      setTimeout(() => {
        dispatch(fetchPaginatedTemplates());
      }, 500);
    },
    doSaveTemplateById: (data, id) => {
      dispatch(updateTemplate(data, id));
      ownProps.history.push("/alarms/templates");
      setTimeout(() => {
        dispatch(fetchPaginatedTemplates());
      }, 500);
    },
    doFetchTemplateDetails: id => {
      dispatch(fetchAlarmTemplateDetailsById(id));
    }
  };
};

Detail = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));

export { Detail };
