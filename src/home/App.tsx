import React from "react";
import {  useSelector } from "react-redux";
import styles from "./App.module.css";
import AppTile from "../components/AppTile";
import { Trail, animated } from "react-spring";
import doArraysHaveEqualElement from '../utils/doArraysHaveEqualElement';
import {navigationLinkTiles} from './AppTileConfig';
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

    const currentRelativeUrl = props.location.pathname;

    const username = useSelector(getUsername);
    const selectedOrganisation = useSelector(getSelectedOrganisation);

    const currentOrganisationRoles = (selectedOrganisation && selectedOrganisation.roles) || [];

    const filterednavigationLinkTiles = navigationLinkTiles.filter((appTile)=>{
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
      if (appTile.linksToUrl === "/management/map_viewer") {
        return false;
      }
      return true;
    })
    
    return (
      <div>
        
        <div className="container">
          <div className="row">
            <div className={styles.Apps}>
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
                  .sort((appTileA, appTileB)=> appTileA.order - appTileB.order )
                  // todo resolve any. x:any because x needs to support  x.interpolate
                  .map((appTile) => (obj:{ x:any, opacity:number }) => (
                    <animated.div
                      style={{
                        opacity: obj.opacity,
                        transform: obj.x.interpolate((x:number) => `translate3d(${x}%,0,0)`)
                      }}
                    >
                      <AppTile
                        handleClick={()=>{ handleLink({
                          external: appTile.linksToUrlExternal? true : false,
                          path: appTile.linksToUrl
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
