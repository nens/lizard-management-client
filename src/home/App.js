import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./App.module.css";
import AppTile from "../components/AppTile";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";
import doArraysHaveEqualElement from '../utils/doArraysHaveEqualElement';
import {appTiles} from './AppTileConfig';

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

    const currentRelativeUrl = this.props.location.pathname;
    console.log('currentRelativeUrl app', currentRelativeUrl);

    const currentOrganisationRoles = (this.props.selectedOrganisation && this.props.selectedOrganisation.roles) || [];
    // const appTilesWithReadOnlyInfo = appTiles.map(appTile=>{
    //   return {
    //     ...appTile,
    //     readonly: !doArraysHaveEqualElement(appTile.requiredRoles, currentOrganisationRoles)
    //   }
    // });
    return (
      <div>
        
        <div className="container">
          <div className="row">
            <div className={styles.Apps}>
              <Trail
                native
                from={{ opacity: 0, x: -5 }}
                to={{ opacity: 1, x: 0 }}
                keys={appTiles.map(item => item.key)}
              >
                {appTiles.filter(appTile=>{
                  return ( 
                    appTile.onPage === currentRelativeUrl ||
                    (appTile.onPage + '/') === currentRelativeUrl ||
                    appTile.onPage === ( currentRelativeUrl + '/')
                  );
                }).sort((appTileA, appTileB)=>{
                  return appTileA.order - appTileB.order;
                }).map((appTile) => ({ x, opacity }) => (
                  <animated.div
                    style={{
                      opacity,
                      transform: x.interpolate(x => `translate3d(${x}%,0,0)`)
                    }}
                  >
                    <AppTile
                      handleClick={()=>{ this.handleLink({
                        external: appTile.linksTo === "/management/users/" ? true : false,
                        path: appTile.linksTo
                      })}}
                      key={appTile.title + appTile.order + ""}
                      title={appTile.title}
                      icon={appTile.icon}
                      readonly={!doArraysHaveEqualElement(appTile.requiresOneOfRoles, currentOrganisationRoles)}
                      requiredRoles={appTile.requiresOneOfRoles}
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
