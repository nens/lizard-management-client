import React, { Component } from "react";
import { addNotification } from "../../actions";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import ActionBar from "./ActionBar";
import PaginationBar from "./PaginationBar";
import { FormattedMessage } from "react-intl";
import pluralize from "pluralize";
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
      templates: []
    };
    this.handleDeleteTemplate = this.handleDeleteTemplate.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleNewTemplateClick = this.handleNewTemplateClick.bind(this);
    this.loadTemplatesOnPage = this.loadTemplatesOnPage.bind(this);
  }
  componentDidMount() {
    this.loadTemplatesOnPage(1);
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
    const { bootstrap } = this.props;
    const organisationId = bootstrap.organisation.unique_id;
    fetch(
      `/api/v3/messages/?page=${page}&organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          total: data.count,
          templates: data.results,
          page: 1,
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
    const { templates, filterValue, isFetching, page, total } = this.state;
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

        {total === 0 ? (
          <div className={styles.NoResults}>
            <img src={templatesIcon} alt="Templates" />
            <h5>No templates configured...</h5>
          </div>
        ) : (
          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <div>
                <ActionBar
                  handleFilter={this.handleFilter}
                  doDeleteContactsById={() => console.log("test")}
                />
                <table
                  className={`${tableStyles.Table} ${tableStyles.Responsive}`}
                >
                  <thead style={{ backgroundColor: "#D8D8D8" }}>
                    <tr className="text-muted">
                      <td>Name</td>
                      <td style={{ textAlign: "center" }}>Type</td>
                      <td>&nbsp;</td>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.map((template, i) => {
                      return (
                        <tr key={i} className={styles.TemplateRow}>
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
                              Delete
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
            <PaginationBar page={page} pages={Math.ceil(total / 10)} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    bootstrap: state.bootstrap
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
