import React from "react";
import {  useSelector } from "react-redux";
import styles from "./App.module.css";
import AppTile from "../components/AppTile";
import { Trail, animated } from "react-spring";
import doArraysHaveEqualElement from '../utils/doArraysHaveEqualElement';
import {appTiles} from './AppTileConfig';
import {getSelectedOrganisation} from '../reducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';


const AppComponent = (props: RouteComponentProps) => {

    const handleInternalLink = (destination:string) => {
      props.history.push(destination);
    }
  
    const handleExternalLink = (destination:string) => {
      window.location.href = destination;
    }
  
    const handleLink = (linksToObject: {path:string; external:boolean}) => {
      if (linksToObject.external === true) {
        handleExternalLink(linksToObject.path);
      } else {
        handleInternalLink(linksToObject.path);
      }
    }

    const currentRelativeUrl = props.location.pathname;

    const selectedOrganisation = useSelector(getSelectedOrganisation)

    const currentOrganisationRoles = (selectedOrganisation && selectedOrganisation.roles) || [];
    
    return (
      <div>
        
        <div className="container">
          <div className="row">
            <div className={styles.Apps}>
              {/*  
              // @ts-ignore */}
              <Trail
                native
                from={{ opacity: 0, x: -5 }}
                to={{ opacity: 1, x: 0 }}
                // @ts-ignore
                keys={appTiles.map(item => item.key)}
              >
                {appTiles
                  .filter(appTile=> appTile.onPage === currentRelativeUrl )
                  .sort((appTileA, appTileB)=> appTileA.order - appTileB.order )
                  // @ts-ignore
                  .map((appTile) => ({ x, opacity }) => (
                    <animated.div
                      style={{
                        opacity,
                        // @ts-ignore
                        transform: x.interpolate(x => `translate3d(${x}%,0,0)`)
                      }}
                    >
                      <AppTile
                        // @ts-ignore
                        handleClick={()=>{ handleLink({
                          external: appTile.linksToExternal? true : false,
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


const App = withRouter(AppComponent);

export { App };
