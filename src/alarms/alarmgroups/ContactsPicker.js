import CSSTransition from "react-transition-group/CSSTransition";
import formStyles from "../../styles/Forms.css";
import MDSpinner from "react-md-spinner";
import React, { Component } from "react";
import styles from "./ContactsPicker.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Scrollbars } from "react-custom-scrollbars";

class ContactsPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      filterValue: null,
      contacts: [],
      isFetching: true
    };
    this.handleResize = this.handleResize.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.hideContactsPicker = this.hideContactsPicker.bind(this);
  }
  componentDidMount() {
    document.getElementById("contactName").focus();

    window.addEventListener("resize", this.handleResize, false);
    document.addEventListener("keydown", this.hideContactsPicker, false);

    const organisationId = this.props.selectedOrganisation.unique_id;
    const url = `/api/v3/contacts/?page_size=100000&organisation__unique_id=${organisationId}`;
    const opts = { credentials: "same-origin" };

    fetch(url, opts)
      .then(responseObj => responseObj.json())
      .then(responseData => {
        this.setState({
          contacts: responseData.results,
          isFetching: false
        });
      });
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
    document.removeEventListener("keydown", this.hideContactsPicker, false);
  }
  hideContactsPicker(e) {
    if (e.key === "Escape") {
      this.props.handleClose();
    }
  }
  handleResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  handleInput(e) {
    this.setState({
      filterValue: e.target.value
    });
  }
  addContact(contact) {
    const {
      contactsPickerGroupId,
      loadContactGroupsOnPage,
      addNotification
    } = this.props;

    (async () => {
      const getContactGroups = await fetch(
        `/api/v3/contactgroups/${contactsPickerGroupId}/`,
        {
          credentials: "same-origin",
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      );
      const contactGroupsJson = await getContactGroups.json();
      const contacts = contactGroupsJson.contacts;
      contacts.push(contact);

      fetch(`/api/v3/contactgroups/${contactsPickerGroupId}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contacts: contacts.map(contact => contact.id)
        })
      })
        .then(response => response.json())
        .then(group => {
          addNotification(`Contact added`, 2000);
          loadContactGroupsOnPage(1);
        });
    })();
  }
  render() {
    const { handleClose, contactsPickerIds } = this.props;
    const { contacts, isFetching, filterValue } = this.state;

    const contactsWithoutContactsAlreadyInGroup = contacts.filter(contact => {
      if (contactsPickerIds.some(id => id === contact.id)) {
        return false;
      }
      return contact;
    });

    const filteredContacts = filterValue
      ? contactsWithoutContactsAlreadyInGroup.filter(contact => {
          if (
            contact.first_name.toLowerCase().indexOf(filterValue) !== -1 ||
            contact.last_name.toLowerCase().indexOf(filterValue) !== -1
          ) {
            return contact;
          }
          return false;
        })
      : contactsWithoutContactsAlreadyInGroup;

    return (
      <div className={styles.ContactsPickerContainer}>
        <CSSTransition
          in={true}
          appear={true}
          timeout={500}
          classNames={{
            enter: styles.Enter,
            enterActive: styles.EnterActive,
            leave: styles.Leave,
            leaveActive: styles.LeaveActive,
            appear: styles.Appear,
            appearActive: styles.AppearActive
          }}
        >
          <div className={styles.ContactsPicker}>
            <div className={styles.CloseButton} onClick={handleClose}>
              <i className="material-icons">close</i>
            </div>
            <h3>
              <FormattedMessage
                id="alarmgroups_app.quickly_add_contacts"
                defaultMessage="Quickly add contacts"
              />
            </h3>
            <br />
            <div className={formStyles.FormGroup}>
              <input
                id="contactName"
                tabIndex="-1"
                type="text"
                className={formStyles.FormControl}
                placeholder="Type here to filter the list of contacts..."
                onChange={this.handleInput}
              />
            </div>
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
            ) : (
              <Scrollbars
                style={{ width: "100%", height: this.state.height - 400 }}
              >
                {filteredContacts
                  ? filteredContacts.map((contact, i) => {
                      let contactString;
                      if (contact.user) {
                        contactString = `${contact.user.first_name} ${contact
                          .user.last_name} ${contact.user.email
                          ? `(${contact.user.email})`
                          : ""}`;
                      } else {
                        contactString = `${contact.first_name} ${contact.last_name} ${contact.email
                          ? `(${contact.email})`
                          : ""} ${contact.phone_number
                          ? `(${contact.phone_number})`
                          : ""}`;
                      }

                      return (
                        <div
                          key={i}
                          className={`${styles.ContactRow}`}
                          onClick={() => {
                            this.addContact(contact);
                            this.props.addIdToContactsPickerIds(contact.id);
                          }}
                        >
                          <i className="material-icons">group</i>
                          <div className={styles.ContactName}>
                            {contactString}
                          </div>
                        </div>
                      );
                    })
                  : null}
              </Scrollbars>
            )}
          </div>
        </CSSTransition>
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactsPicker);
