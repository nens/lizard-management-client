import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import styles from "./Detail.module.css";
import TemplateTypeSelection from "./TemplateTypeSelection";
import tableStyles from "../../styles/Table.module.css";
import gridStyles from "../../styles/Grid.module.css";
import buttonStyles from "../../styles/Buttons.module.css";
import formStyles from "../../styles/Forms.module.css";
import { withRouter } from "react-router-dom";
import { availableParameters } from "./NewTemplate";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      template: null,
      isFetching: true
    };
    this.handleSaveTemplate = this.handleSaveTemplate.bind(this);
    this.handleDeleteTemplate = this.handleDeleteTemplate.bind(this);
    this.insertTextInTemplateText = this.insertTextInTemplateText.bind(this);
  }
  componentDidMount() {
    const { match, history } = this.props;
    fetch(`/api/v3/messages/${match.params.id}/`, {
      credentials: "same-origin"
    })
      .then(response => {
        if (response.status === 404) {
          history.push("/alarms/templates");
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          isFetching: false,
          template: data
        });
      });
  }
  handleDeleteTemplate() {
    const { match, history, addNotification } = this.props;
    const confirmed = window.confirm("Are you sure?");
    if (confirmed) {
      fetch(`/api/v3/messages/${match.params.id}/`, {
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      }).then(response => {
        if (response.status === 204) {
          addNotification("Template removed", 2000);
          history.push("/alarms/templates");
        } else {
          alert("Unable to delete template");
        }
      });
    }
  }
  handleSaveTemplate() {
    const { match, history, addNotification } = this.props;
    const subject = this.messageSubject.value;
    const body = this.messageBody.value;

    if (body) {
      fetch(`/api/v3/messages/${match.params.id}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject,
          text: body
        })
      })
        .then(response => response.json())
        .then(data => {
          addNotification(`Template "${subject}" updated`, 2000);
          history.push("/alarms/templates");
        });
    } else {
      alert("Please provide a template text");
    }
  }
  insertTextInTemplateText(templateText, addedText) {
    var newTemplateText = "";
    var element = document.getElementById("templatePreview");

    if (element.selectionStart || element.selectionStart === 0) {
      newTemplateText = templateText.substring(0, element.selectionStart) +
        addedText + templateText.substring(element.selectionEnd);
    } else {
      newTemplateText = templateText + addedText;
    }

    var newTemplate = this.state.template;
    newTemplate.text = newTemplateText;
    this.setState({
      template: newTemplate
    });
  }
  render() {
    const { template, isFetching } = this.state;

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

    const parameterTableRows = availableParameters.map((parameter, i) => {
      if (!parameter.templateType || parameter.templateType === template.type) {
        return (
          <tr
            key={parameter.parameter}
            onClick={() => {
              this.insertTextInTemplateText(template.text, parameter.parameterText);
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
            <div className={`${gridStyles.FloatRight}`}>
              <TemplateTypeSelection type={template.type} />
            </div>
            <h4>{template.name} </h4>
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
              value={this.state.template.text}
              onChange={e => {
                this.setState({
                  template: {
                    ...this.state.template,
                    text: e.target.value
                  }
                });
              }}
              ref={body => {
                this.messageBody = body;
              }}
            />
            <small className="text-muted">
              <FormattedMessage
                id="alarmtemplates_detail.template"
                defaultMessage="TEMPLATE"
              />{" "}
              ({this.state.template.text.length}{" "}
              <FormattedMessage
                id="alarmtemplates_detail.characters"
                defaultMessage="characters"
              />)
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
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

Detail = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));

export { Detail };
