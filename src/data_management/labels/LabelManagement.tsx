import React from "react";
import { FormattedMessage } from "react-intl";
import AppTile from "../../components/AppTile";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";

import labeltypesIcon from "../../images/labeltypes_icon.svg";
import backArrowIcon from "../../images/backArrow.svg";

const LabelManagement = (props:any) => {
  const handleLink = (destination:any) => {
    props.history.push(destination);
  };

  const appTiles = [
    {
      key: 0,
      handleClick: () => handleLink("labeltypes"),
      title: (
        <FormattedMessage
          id="data_management.labeltypes"
          defaultMessage="Label-types"
        />
      ),
      icon: labeltypesIcon
    },
    {
      key: 1,
      handleClick: () => handleLink("/data_management"),
      title: (
        <FormattedMessage
          id="go_back"
          defaultMessage="Go Back"
        />
      ),
      icon: backArrowIcon
    }
  ];

  return (
    <div>
      <div className="container">
        <div className="row">
          {/* 
          // @ts-ignore */}
          <Trail
            native
            from={{ opacity: 0, x: -5 }}
            to={{ opacity: 1, x: 0 }}
            keys={appTiles.map(item => item.key)}
          >
            {/* 
          // @ts-ignore */}
            {appTiles.map((appTile, i) => ({ x, opacity }) => (
              <animated.div
                style={{
                  opacity,
                  // @ts-ignore
                  transform: x.interpolate(x => `translate3d(${x}%,0,0)`)
                }}
              >
                <AppTile
                  // @ts-ignore       
                  handleClick={appTile.handleClick}
                  key={+new Date()}
                  title={appTile.title}
                  icon={appTile.icon}
                />
              </animated.div>
            ))}
          </Trail>
        </div>
      </div>
    </div>
  );
}

export default withRouter(LabelManagement);
