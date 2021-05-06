import React, { useEffect, useState } from 'react';
import MDSpinner from 'react-md-spinner';
import { connect } from 'react-redux';


interface MyProps {
}

interface APIResponse {
  previous: string | null,
  next: string | null,
  results: any[]
}

function MapViewer (props: MyProps & DispatchProps) {
  const { } = props;

  
  return (
    <div>
      Test mapviewer
    </div>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
 
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(MapViewer); 