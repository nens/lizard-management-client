import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import ActionBar from "./ActionBar";
import { FormattedMessage } from "react-intl";
import pluralize from "pluralize";
import { connect } from "react-redux";
import { fetchAlarmTemplates } from "../../actions";
import styles from "./App.css";
import gridStyles from "../../styles/Grid.css";
import tableStyles from "../../styles/Table.css";
import buttonStyles from "../../styles/Buttons.css";
import { withRouter, NavLink } from "react-router-dom";
import templatesIcon from "../../images/templates@3x.svg";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleNewTemplateClick = this.handleNewTemplateClick.bind(this);
  }
  componentDidMount() {
    this.props.doFetchTemplates();
  }
  handleNewTemplateClick() {
    this.props.history.push("templates/new");
  }
  render() {
    const { templates, isFetching } = this.props;
    const numberOfTemplates = templates.length;
    return (
      <div className={gridStyles.Container}>
        <div className={`${gridStyles.Row} ${styles.App}`}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            {numberOfTemplates} {pluralize("TEMPLATE", numberOfTemplates)}

            <button
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Success} ${gridStyles.FloatRight}`}
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
        <hr />
        <div className={`${gridStyles.Row}`}>
          <div className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}>
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
                <table className={`${tableStyles.Table} ${tableStyles.Responsive}`}>
                  <thead style={{ backgroundColor: "#D8D8D8" }}>
                    <tr className="text-muted">
                      <td>&nbsp;</td>
                      <td>Name</td>
                      <td style={{ textAlign: "center" }}>Type</td>
                    </tr>
                  </thead>

                  <tbody>
                    {templates.map((template, i) => {
                      return (
                        <tr key={i} className={styles.TemplateRow}>
                          <td className={tableStyles.TdCol1}>
                            <input
                              type="checkbox"
                              name="template"
                              className="checkbox"
                              value={template.id}
                            />
                          </td>
                          <td className={tableStyles.TdCol8}>
                            <NavLink to={`/alarms/templates/${template.id}`}>
                              <strong>{template.name}</strong>{" "}
                            </NavLink>
                          </td>
                          <td style={{ textAlign: "center" }} className={tableStyles.TdCol1}>
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
                <img src={templatesIcon} alt="Templates" />
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
