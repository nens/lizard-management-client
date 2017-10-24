import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import ActionBar from "./ActionBar";
import { FormattedMessage } from "react-intl";
import pluralize from "pluralize";
import { connect } from "react-redux";
import { fetchAlarmTemplates } from "../../actions";
import styles from "./App.css";
import { withRouter, NavLink } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleNewTemplateClick = this.handleNewTemplateClick.bind(this);
  }
  componentDidMount() {
    this.props.doFetchTemplates();
  }
  handleNewTemplateClick() {
    console.log("New template plz");
  }
  render() {
    const { templates, isFetching } = this.props;
    const numberOfTemplates = templates.length;
    return (
      <div className="container">
        <div className={`row align-items-center ${styles.App}`}>
          <div className="col-sm-8 justify-content-center text-muted">
            {numberOfTemplates} {pluralize("TEMPLATE", numberOfTemplates)}
          </div>
          <div className="col-sm-4">
            <button
              type="button"
              className="btn btn-success float-right"
              onClick={this.handleNewTemplateClick}
            >
              <FormattedMessage
                id="alarmtemplates_app.new_group"
                defaultMessage="New template"
              />
              <Ink />
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            {isFetching ? (
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
            ) : templates.length > 0 ? (
              <div>
                <ActionBar doDeleteContactsById={() => console.log("test")} />
                <table className="table table-responsive">
                  <thead style={{ backgroundColor: "#D8D8D8" }}>
                    <tr className="text-muted">
                      <td>&nbsp;</td>
                      <td>Name</td>
                      <td>Type</td>
                    </tr>
                  </thead>

                  <tbody>
                    {templates.map((template, i) => {
                      return (
                        <tr key={i} className={styles.TemplateRow}>
                          <td>
                            <input
                              type="checkbox"
                              name="template"
                              className="checkbox"
                              value={template.id}
                            />
                          </td>
                          <td
                            className="col-md-8"
                            onClick={() =>
                              console.log(
                                `Go to detail page of ${template.name}`
                              )}
                          >
                            <NavLink to={`/alarms/templates/${template.id}`}>
                              <strong>{template.name}</strong>{" "}
                            </NavLink>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span className={styles.TemplateTypeBadge}>
                              {template.type}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.NoResults}>
                <img src="/images/templates@3x.svg" alt="Templates" />
                <h5>No templates configured...</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    templates: state.alarms.templates,
    isFetching: state.alarms.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doFetchTemplates: () => dispatch(fetchAlarmTemplates())
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
