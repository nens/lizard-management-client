import styles from "./TemplateTypeSelection.module.css";
import React, { Component } from "react";

class TemplateTypeSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    const { type } = this.props;
    return (
      <div
        onClick={(e) => console.log("O so you want to change the template type?")}
        className={`${styles.TemplateTypeBadge}`}
        style={{
          textTransform: "uppercase"
        }}
      >
        {type}
      </div>
    );
  }
}

export default TemplateTypeSelection;
