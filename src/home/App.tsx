import React from "react";
import {  useSelector } from "react-redux";
import styles from "./App.module.css";
import AppTile from "../components/AppTile";
import AppTileHomeType from "../components/AppTileHomeType";

import { Trail, animated } from "react-spring";
import doArraysHaveEqualElement from '../utils/doArraysHaveEqualElement';
import {getCurrentNavigationLinkTiles, NavigationLinkTile} from './AppTileConfig';
import {getSelectedOrganisation, getUsername} from '../reducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';




const AppComponent = (props: RouteComponentProps) => {

    const handleInternalLink = (destination:string) => {
      props.history.push(destination);
    }
  
    const handleExternalLink = (destination:string) => {
      window.location.href = destination;
    }
  
    const handleLink = (linksToUrlObject: {path:string; external:boolean}) => {
      if (linksToUrlObject.external === true) {
        handleExternalLink(linksToUrlObject.path);
      } else {
        handleInternalLink(linksToUrlObject.path);
      }
    }

    // todo resolve any. x:any because x needs to support  x.interpolate
    const AppTileRow = (appTile: NavigationLinkTile) => (obj:{ x:any, opacity:number }) => (
      <animated.div
        style={{
          opacity: obj.opacity,
          transform: obj.x.interpolate((x:number) => `translate3d(${x}%,0,0)`)
        }}
      >
        {
          appTile.homePageIcon?
          <AppTileHomeType
            handleClick={()=>{ handleLink({
              external: appTile.linksToUrlExternal? true : false,
              path: appTile.linksToUrl
            })}}
            key={appTile.title + appTile.order + ""}
            title={appTile.title}
            icon={appTile.icon}
            readonly={
              !doArraysHaveEqualElement(appTile.requiresOneOfRoles, currentOrganisationRoles) &&
              appTile.requiresOneOfRoles.length !== 0
            }
            requiredRoles={appTile.requiresOneOfRoles}
          />
          :
          <AppTile
            handleClick={()=>{ handleLink({
              external: appTile.linksToUrlExternal? true : false,
              path: appTile.linksToUrl
            })}}
            key={appTile.title + appTile.order + ""}
            title={appTile.title}
            icon={appTile.icon}
            readonly={
              !doArraysHaveEqualElement(appTile.requiresOneOfRoles, currentOrganisationRoles) &&
              appTile.requiresOneOfRoles.length !== 0
            }
            requiredRoles={appTile.requiresOneOfRoles}
          />
        }
      </animated.div>
    );

    const currentRelativeUrl = props.location.pathname;
    const username = useSelector(getUsername);
    const selectedOrganisation = useSelector(getSelectedOrganisation);

    const currentOrganisationRoles = (selectedOrganisation && selectedOrganisation.roles) || [];

    const filterednavigationLinkTiles = getCurrentNavigationLinkTiles().filter((navigationLinkTile)=>{
      if (
        selectedOrganisation &&
        selectedOrganisation.name === "Nelen & Schuurmans" &&
        ( username === "tom.deboer" ||
          username === "lex.vandolderen" ||
          username === "remco.gerlich" ||
          username === "hoan.phung" ||
          username === "joeri.verheijden" ||
          username === "lirry.pinter" ||
          username === "tom.deboer"
        )
      ) {
        return true;
      }
      if (navigationLinkTile.linksToUrl === "/management/map_viewer") {
        return false;
      }
      return true;
    })
    
    return (
      <div>
        
        <div className="container">
          <div className="row">
            <div className={styles.Apps}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              
              {currentRelativeUrl === '/'? 
                <div>
                <h3
                  className={`${styles.HomeTilesHeader} ${styles.HomeTilesHeaderFirst}`}
                >
                  Home
                </h3>
                <hr/>
                </div>
              :null}
              
              <div>
                {/* Not sure why this ts-ignore is needed. Compiler complaints <Trail needs multiple children?  */}
                {/*  
                // @ts-ignore */}
                <Trail
                  native
                  from={{ opacity: 0, x: -5 }}
                  to={{ opacity: 1, x: 0 }}
                  keys={filterednavigationLinkTiles.map(item => item.title)}
                >
                  {filterednavigationLinkTiles
                    .filter(appTile=> appTile.onUrl === currentRelativeUrl )
                    .filter(appTile=> appTile.homePageLinkOrHome === "HOME")
                    .sort((appTileA, appTileB)=> appTileA.order - appTileB.order )
                    // todo resolve any. x:any because x needs to support  x.interpolate
                    .map(AppTileRow)}
                </Trail>
              </div>
              {currentRelativeUrl === '/'? 
                <div>
                  <h3 className={styles.HomeTilesHeader} >Links</h3>
                  <hr/>
                </div>
              :null}

              <div>
                {/*  */}
                {/* Not sure why this ts-ignore is needed. Compiler complaints <Trail needs multiple children?  */}
                {/*  
                // @ts-ignore */}
                <Trail
                  native
                  from={{ opacity: 0, x: -5 }}
                  to={{ opacity: 1, x: 0 }}
                  keys={filterednavigationLinkTiles.map(item => item.title)}
                >
                  {filterednavigationLinkTiles
                    .filter(appTile=> appTile.onUrl === currentRelativeUrl )
                    .filter(appTile=> appTile.homePageLinkOrHome === "LINK" || !appTile.homePageLinkOrHome)
                    .sort((appTileA, appTileB)=> appTileA.order - appTileB.order )
                    .map(AppTileRow)}
                </Trail>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


const App = withRouter(AppComponent);

export { App };
