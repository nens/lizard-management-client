import React, { Component } from "react";
import { addNotification } from "../../actions";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
// import ActionBar from "./ActionBar";
import PaginationBar from "./PaginationBar";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styles from "./App.css";
import gridStyles from "../../styles/Grid.css";
import tableStyles from "../../styles/Table.css";
import buttonStyles from "../../styles/Buttons.css";
import { withRouter, NavLink } from "react-router-dom";
import templatesIcon from "../../images/templates@3x.svg";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: "",
      page: 1,
      total: 0,
      isFetching: true,
      templates: [],
      ordering: {
        column: "name",
        direction: ""
      }
    };
    this.handleDeleteTemplate = this.handleDeleteTemplate.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleNewTemplateClick = this.handleNewTemplateClick.bind(this);
    this.loadTemplatesOnPage = this.loadTemplatesOnPage.bind(this);
  }
  componentDidMount() {
    this.loadTemplatesOnPage(1);
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedOrganisation &&
      prevProps.selectedOrganisation.uuid !== this.props.selectedOrganisation.uuid
    ) {
      const { page } = this.state;
      this.loadTemplatesOnPage(page);
    }
  }
  handleDeleteTemplate(template) {
    const { addNotification } = this.props;
    const sure = window.confirm("Are you sure?");
    if (sure) {
      fetch(`/api/v3/messages/${template.id}/`, {
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      }).then(response => {
        if (response.status === 204) {
          addNotification(`Template deleted`, 2000);
          this.loadTemplatesOnPage(1);
        } else {
          addNotification(`Something went wrong, template not deleted`, 2000);
        }
      });
    }
  }
  loadTemplatesOnPage(page) {
    const { ordering } = this.state;
    const organisationId = this.props.selectedOrganisation.uuid;

    const url = `/api/v3/messages/?page=${page}&organisation__unique_id=${organisationId}
      ${ordering.column
        ? `&ordering=${ordering.direction}${ordering.column}`
        : ""}`;
    const opts = { credentials: "same-origin" };

    fetch(url, opts)
      .then(responseObj => responseObj.json())
      .then(responseData => {
        this.setState({
          total: responseData.count,
          templates: responseData.results,
          page: page,
          isFetching: false
        });
      });
  }
  handleFilter(e) {
    this.setState({
      filterValue: e.target.value
    });
  }
  handleNewTemplateClick() {
    this.props.history.push("templates/new");
  }
  render() {
    const {
      templates,
      filterValue,
      isFetching,
      page,
      total,
      ordering
    } = this.state;
    const numberOfTemplates = total;

    const filteredTemplates = templates.filter((template, i) => {
      if (template.name.toLowerCase().indexOf(filterValue) !== -1) {
        return template;
      }
      return false;
    });

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
        <div className={`${gridStyles.Row} ${styles.App}`}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            <FormattedMessage
              id="alarmtemplates_app.number_of_templates"
              defaultMessage={`{numberOfTemplates, number} {numberOfTemplates, plural, 
                one {TEMPLATE}
                other {TEMPLATES}}`}
              values={{ numberOfTemplates }}
            />

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

        {total === 0 ? (
          <div className={styles.NoResults}>
            <img src={templatesIcon} alt="Templates" />
            <h5>
              <FormattedMessage
                id="alarmtemplates_app.no_templates_configured"
                defaultMessage="No templates configured..."
              />
            </h5>
          </div>
        ) : (
          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <div>
                <table
                  className={`${tableStyles.Table} ${tableStyles.Responsive}`}
                >
                  <thead style={{ backgroundColor: "#D8D8D8" }}>
                    <tr className="text-muted">
                      <td
                        style={{
                          cursor: "pointer",
                          position: "relative"
                        }}
                        onClick={() =>
                          this.setState(
                            {
                              ordering: {
                                column: "name",
                                direction: ordering.direction === "-" ? "" : "-"
                              }
                            },
                            () => this.loadTemplatesOnPage(page)
                          )}
                      >
                        {" "}
                        <FormattedMessage
                          id="alarmtemplates_app.name"
                          defaultMessage="Name"
                        />
                        {ordering.column === "name" ? (
                          ordering.direction === "-" ? (
                            <i
                              style={{ position: "absolute", right: 0 }}
                              className="material-icons"
                            >
                              arrow_drop_up
                            </i>
                          ) : (
                            <i
                              style={{ position: "absolute", right: 0 }}
                              className="material-icons"
                            >
                              arrow_drop_down
                            </i>
                          )
                        ) : null}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          cursor: "pointer",
                          position: "relative"
                        }}
                        onClick={() =>
                          this.setState(
                            {
                              ordering: {
                                column: "type",
                                direction: ordering.direction === "-" ? "" : "-"
                              }
                            },
                            () => this.loadTemplatesOnPage(page)
                          )}
                      >
                        <FormattedMessage
                          id="alarmtemplates_app.type"
                          defaultMessage="Type"
                        />
                        {ordering.column === "type" ? (
                          ordering.direction === "-" ? (
                            <i
                              style={{ position: "absolute", right: 0 }}
                              className="material-icons"
                            >
                              arrow_drop_up
                            </i>
                          ) : (
                            <i
                              style={{ position: "absolute", right: 0 }}
                              className="material-icons"
                            >
                              arrow_drop_down
                            </i>
                          )
                        ) : null}
                      </td>
                      <td>&nbsp;</td>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.map((template, i) => {
                      return (
                        <tr key={template.id} className={styles.TemplateRow}>
                          <td className={tableStyles.TdCol8}>
                            <NavLink to={`/alarms/templates/${template.id}`}>
                              <strong>{template.name}</strong>{" "}
                            </NavLink>
                            - {template.subject}
                          </td>
                          <td
                            style={{ textAlign: "center" }}
                            className={tableStyles.TdCol1}
                          >
                            <span className={styles.TemplateTypeBadge}>
                              {template.type}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() =>
                                this.handleDeleteTemplate(template)}
                              className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Danger2} ${gridStyles.FloatRight}`}
                            >
                              <FormattedMessage
                                id="alarmtemplates_app.delete"
                                defaultMessage="Delete"
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        <div className={gridStyles.Row}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            <PaginationBar
              page={page}
              pages={Math.ceil(total / 10)}
              loadTemplatesOnPage={this.loadTemplatesOnPage}
            />
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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
