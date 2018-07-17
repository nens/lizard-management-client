import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import last from "lodash/last";

class FormatMessage extends Component {
  getDefaultMessage(fullId) {
    const words = last(fullId.split(".")).split("_");
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ");
  }
  render() {
    const id = this.props.id,
      defaultMessage = this.props.defaultMessage || this.getDefaultMessage(id);

    return <FormattedMessage id={id} defaultMessage={defaultMessage} />;
  }
}

export default FormatMessage;
