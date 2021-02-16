import React from "react";
import { FormattedMessage } from "react-intl";
import AppTile from "../../components/AppTile";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";

import rasterSourcesIcon from "../../images/raster_source_icon.svg";
import rasterLayersIcon from "../../images/raster_layer_icon.svg";
import backArrowIcon from "../../images/backArrow.svg";

const RasterManagement = (props) => {
  const handleLink = (destination) => {
    props.history.push(destination);
  };

  const appTiles = [
    {
      key: 0,
      handleClick: () => handleLink("rasters/sources"),
      title: (
        <FormattedMessage
          id="data_management.rasters_sources"
          defaultMessage="Rasters Sources"
        />
      ),
      icon: rasterSourcesIcon
    },
    {
      key: 1,
      handleClick: () => handleLink("rasters/layers"),
      title: (
        <FormattedMessage
          id="data_management.raster_layers"
          defaultMessage="Raster Layers"
        />
      ),
      icon: rasterLayersIcon
    },
    {
      key: 2,
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
          <Trail
            native
            from={{ opacity: 0, x: -5 }}
            to={{ opacity: 1, x: 0 }}
            keys={appTiles.map(item => item.key)}
          >
            {appTiles.map((appTile, i) => ({ x, opacity }) => (
              <animated.div
                style={{
                  opacity,
                  transform: x.interpolate(x => `translate3d(${x}%,0,0)`)
                }}
              >
                <AppTile
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

export default withRouter(RasterManagement);
