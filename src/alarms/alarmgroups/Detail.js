import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import ActionBar from "./ActionBar";
import pluralize from "pluralize";
import { connect } from "react-redux";
import { fetchAlarmGroupDetailsById } from "../../actions";
import styles from "./Detail.css";
import { withRouter } from "react-router-dom";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.handleCheckboxes = this.handleCheckboxes.bind(this);
    this.handleSelectAllCheckboxes = this.handleSelectAllCheckboxes.bind(this);
    this.handleDeselectAllCheckboxes = this.handleDeselectAllCheckboxes.bind(
      this
    );
  }
  componentDidMount() {
    const { match, doFetchGroupDetails } = this.props;
    doFetchGroupDetails(match.params.id);
  }

  handleCheckboxes(e) {
    const checkboxes = [
      ...document.querySelectorAll("input[type=checkbox]:checked")
    ];
    const values = checkboxes.map(cb => cb.value);
    console.log("Selected:", values);
  }

  handleSelectAllCheckboxes() {
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach(checkbox => (checkbox.checked = true));
  }

  handleDeselectAllCheckboxes() {
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach(checkbox => (checkbox.checked = false));
  }

  render() {
    const { isFetching, group, doDeleteContactsById } = this.props;

    if (isFetching) {
      return (
        <div className={styles.LoadingIndicator}>
          <MDSpinner size={24} />
        </div>
      );
    }

    if (group.contacts) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <button
                type="button"
                className="btn btn-success float-right"
              >
                <FormattedMessage
                  id="alarmgroups_detail.add_contacts"
                  defaultMessage="Add contacts"
                />
                <Ink />
              </button>
              <h4>{group.name}</h4>
              <p className="text-muted">
                {group.contacts.length}{" "}
                {pluralize("recipients", group.contacts.length)}
              </p>
            </div>
          </div>

          <ActionBar doDeleteContactsById={doDeleteContactsById} />

          <table className="table table-responsive">
            <thead style={{ backgroundColor: "#D8D8D8" }}>
              <tr className="text-muted">
                <td>&nbsp;</td>
                <td>E-mail address</td>
                <td>Phone number</td>
                <td>First name</td>
                <td>Last name</td>
              </tr>
            </thead>
            <tbody>
              {group.contacts.map((contact, i) => {
                const email = contact.user ? contact.user.email : contact.email;
                return (
                  <tr key={i}>
                    <td>
                      <input
                        type="checkbox"
                        name="contact"
                        className="checkbox"
                        value={contact.id}
                      />
                    </td>
                    <td>{email || "-"}</td>
                    <td>{contact.phone_number || "-"}</td>
                    <td>{contact.first_name || "-"}</td>
                    <td>{contact.last_name || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    group: state.alarms.group,
    isFetching: state.alarms.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doDeleteContactsById: ids => {
      console.log("Deleting id's", ids);
      // dispatch(deleteContactsById(ids));
    },
    doFetchGroupDetails: id => {
      dispatch(fetchAlarmGroupDetailsById(id));
    }
  };
};

Detail = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));

export { Detail };
