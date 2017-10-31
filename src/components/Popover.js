import React, { Component } from "react";
import ReactDOM from "react-dom";
import onClickOutside from "react-onclickoutside";
import styles from "./Popover.css";

class PopoverContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.handleOpen = this.handleOpen.bind(this);
  }
  componentDidMount() {
    const { x, y } = ReactDOM.findDOMNode(this).getBoundingClientRect();
    this.setState({
      elementX: x,
      elementY: y,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
  }
  handleOpen(e) {
    e.preventDefault();
    this.props.handleListenToClickOutside(true);
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleClickOutside(e) {
    this.setState({
      isOpen: false
    });
    this.props.handleListenToClickOutside(false);
  }
  render() {
    const { element, children } = this.props;
    const { isOpen, elementX, screenWidth } = this.state;
    return (
      <div onClick={this.handleOpen}>
        {element}
        {isOpen ? <div
          style={{
            left: (elementX > (screenWidth - 200)) ? -145 : 25
          }}
          className={styles.Popover}>{children}</div> : null}
      </div>
    );
  }
}

const EnhancedComponent = onClickOutside(PopoverContainer);

class Popover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listenToClickOutside: false
    };
    this.handleListenToClickOutside = this.handleListenToClickOutside.bind(
      this
    );
  }
  handleListenToClickOutside(value) {
    this.setState({
      listenToClickOutside: value
    });
  }
  render(e) {
    return (
      <EnhancedComponent
        {...this.props}
        handleListenToClickOutside={this.handleListenToClickOutside}
        disableOnClickOutside={!this.state.listenToClickOutside}
      />
    );
  }
}

class PopoverItem extends Component {
  render() {
    const { children, handleOnClick } = this.props;
    return (
      <div className={styles.ListItem} onClick={handleOnClick}>
        {children}
      </div>
    );
  }
}

export { Popover };
export { PopoverItem };
