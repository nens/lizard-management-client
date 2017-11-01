import React, { Component } from "react";
// import Ink from "react-ink";
// import { FormattedMessage } from "react-intl";
import styles from "./ActionBar.css";

class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    // this.handleCheckboxes = this.handleCheckboxes.bind(this);
    // this.handleDeleteSelected = this.handleDeleteSelected.bind(this);
    // this.handleSelectAllCheckboxes = this.handleSelectAllCheckboxes.bind(this);
    // this.handleDeselectAllCheckboxes = this.handleDeselectAllCheckboxes.bind(
    //   this
    // );
    // this.toggleManageContacts = this.toggleManageContacts.bind(this);
    // this.toggleGroupSettings = this.toggleGroupSettings.bind(this);
  }

  // toggleManageContacts() {
  //   this.setState({
  //     showManageContacts: !this.state.showManageContacts,
  //     showGroupSettings: false
  //   });
  // }
  //
  // toggleGroupSettings() {
  //   this.setState({
  //     showGroupSettings: !this.state.showGroupSettings,
  //     showManageContacts: false
  //   });
  // }

  // handleCheckboxes(e) {
  //   const checkboxes = [
  //     ...document.querySelectorAll("input[type=checkbox]:checked")
  //   ];
  //   const values = checkboxes.map(cb => cb.value);
  //   console.log("Selected:", values);
  // }

  // handleSelectAllCheckboxes() {
  //   this.setState(
  //     {
  //       showManageContacts: false
  //     },
  //     () => {
  //       document
  //         .querySelectorAll("input[type=checkbox]")
  //         .forEach(checkbox => (checkbox.checked = true));
  //     }
  //   );
  // }

  // handleDeselectAllCheckboxes() {
  //   this.setState(
  //     {
  //       showManageContacts: false
  //     },
  //     () => {
  //       document
  //         .querySelectorAll("input[type=checkbox]")
  //         .forEach(checkbox => (checkbox.checked = false));
  //     }
  //   );
  // }

  // handleDeleteSelected() {
  //   const checkboxes = [
  //     ...document.querySelectorAll("input[type=checkbox]:checked")
  //   ];
  //   const values = checkboxes.map(cb => cb.value);
  //
  //   if (window.confirm("Are you sure?")) {
  //     this.props.doDeleteContactsById(values);
  //   }
  // }

  render() {
    // const { showManageContacts } = this.state;
    return (
      <div className={styles.ActionBar}>
        <div className={styles.ActionBarItemsWrapper}>
          <div
            className={styles.ActionBarItem}
            onClick={this.toggleManageContacts}
          >
            <i className="material-icons">keyboard_arrow_down</i>Manage contacts

          </div>
        </div>
        <div className={styles.Search}>
          <input className="form-control form-control-sm" type="text" placeholder="Type to filter" />
        </div>
      </div>
    );
  }
}

export default ActionBar;
