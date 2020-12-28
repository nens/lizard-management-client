import React from 'react';
import {useState, useEffect,}  from 'react';

export const RasterSourceDeleteModalLayersWarning = (row:any) => {

  const [layers, setLayers] = useState<any[]>([]);
  const [labelTypes, setLabelTypes] = useState<any[]>([]);

  useEffect(() => { 

    const layerUuids = row.layers.map((layerUrl:string)=>{layerUrl.split("/")[layerUrl.split("/").length-2] })
    const labeltypeUuids = row.labeltypes.map((layerUrl:string)=>{layerUrl.split("/")[layerUrl.split("/").length-2] })


  }, [row]);

  

  return (
    <div>
      <ul
        style={{
          overflowY: "auto",
          maxHeight: "200px"
        }}
      >
        
      </ul>  
    </div>
  )
}

    