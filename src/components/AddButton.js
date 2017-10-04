import React, { Component } from "react";
import styles from "./AddButton.css";

class AddButton extends Component {
  render() {
    const { title, handleClick } = this.props;
    return (
      <div className={styles.AddButton} onClick={handleClick}>
        <div className={styles.Plus}>
          <i className={`${styles.AddIcon} material-icons`}>add</i>
        </div>
        <div className={styles.Title}>
          {title || ""}
        </div>
      </div>
    );
  }
}

export default AddButton;
