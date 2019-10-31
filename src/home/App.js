import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./App.css";
import AppIcon from "../components/AppIcon";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";
import doArraysHaveEqualElement from '../utils/doArraysHaveEqualElement';

import {appIcons} from './HomeAppIconConfig';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleLink = this.handleLink.bind(this);
    this.handleExternalLink = this.handleExternalLink.bind(this);
  }

  handleInternalLink(destination) {
    this.props.history.push(destination);
  }

  handleExternalLink(destination) {
    window.location.href = destination;
  }

  handleLink (linksToObject) {
    if (linksToObject.external === true) {
      this.handleExternalLink(linksToObject.path);
    } else {
      this.handleInternalLink(linksToObject.path);
    }
  }

  render() {
    const currentOrganisationRoles = (this.props.selectedOrganisation && this.props.selectedOrganisation.roles) || [];
    const appIconsWithReadOnlyInfo = appIcons.map(appIcon=>{
      return {
        ...appIcon,
        readonly: !doArraysHaveEqualElement(appIcon.requiredRoles, currentOrganisationRoles),
      }
    });
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className={styles.Apps}>
              <Trail
                native
                from={{ opacity: 0, x: -5 }}
                to={{ opacity: 1, x: 0 }}
                keys={appIcons.map(item => item.key)}
              >
                {appIconsWithReadOnlyInfo.map((appIcon, i) => ({ x, opacity }) => (
                  <animated.div
                    style={{
                      opacity,
                      transform: x.interpolate(x => `translate3d(${x}%,0,0)`)
                    }}
                  >
                    <AppIcon
                      handleClick={()=>{ this.handleLink(appIcon.linksTo)}}
                      key={+new Date()}
                      src={appIcon.icon}
                      title={appIcon.title}
                      subTitle={appIcon.subTitle}
                      readonly={appIcon.readonly}
                      requiredRoles={appIcon.requiredRoles}
                    />
                  </animated.div>
                ))}
              </Trail>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedOrganisation: state.organisations.selected,
  };
};

App = withRouter(connect(mapStateToProps, null)(
  App
));

export { App };
