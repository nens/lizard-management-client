import React, { useEffect, useState } from 'react';
import MDSpinner from 'react-md-spinner';
import { connect } from 'react-redux';
import ReactMapGL from 'react-map-gl';


interface MyProps {
}

interface APIResponse {
  previous: string | null,
  next: string | null,
  results: any[]
}

function MapViewer (props: MyProps & DispatchProps) {
  const { } = props;

  const [viewport, setViewport] = React.useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  
  return (
    <div>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={(viewport:any) => setViewport(viewport)}
      />
    </div>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
 
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(MapViewer); 