import React, { Component } from "react";
import onClickOutside from "react-onclickoutside";
import styles from "./LanguageSwitcher.module.css";
import buttonStyles from "../styles/Buttons.module.css";

class LanguageSwitcherContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleOpen(e) {
    e.preventDefault();
    this.props.handleListenToClickOutside(true);
    this.setState({
      isOpen: true,
    });
  }
  handleSelect(code) {
    localStorage.setItem("lizard-preferred-language", code);
    this.props.handleListenToClickOutside(false);
    this.setState(
      {
        isOpen: false,
      },
      () => {
        window.location.reload();
      }
    );
  }
  handleClickOutside(e) {
    this.setState({
      isOpen: false,
    });
    this.props.handleListenToClickOutside(false);
  }
  render() {
    const { isOpen } = this.state;
    const { languages, locale } = this.props;

    let selectedLanguage = languages[0];

    if (locale) {
      selectedLanguage = languages.filter((lang) => {
        if (lang.code === locale) return lang;
        else return false;
      })[0];
    }

    return (
      <div>
        <button
          onClick={this.handleOpen}
          className={buttonStyles.ButtonLink}
          style={{ color: "#009F86" }}
        >
          <i
            style={{
              position: "relative",
              top: 5,
              fontSize: "20px",
            }}
            className="material-icons"
          >
            mode_comment
          </i>
          &nbsp;{selectedLanguage.language.toUpperCase()}
        </button>
        {isOpen ? (
          <div className={styles.LanguageSwitcher}>
            {languages.map((language, i) => {
              return (
                <div
                  key={language.code}
                  className={styles.ListItem}
                  onClick={() => this.handleSelect(language.code)}
                >
                  <span>{language.language}</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}

const EnhancedComponent = onClickOutside(LanguageSwitcherContainer);

class LanguageSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listenToClickOutside: false,
    };
    this.handleListenToClickOutside = this.handleListenToClickOutside.bind(this);
  }
  handleListenToClickOutside(value) {
    this.setState({
      listenToClickOutside: value,
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

export default LanguageSwitcher;
