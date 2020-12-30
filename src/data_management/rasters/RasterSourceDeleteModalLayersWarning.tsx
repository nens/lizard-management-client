import React from 'react';
import {useState, useEffect,}  from 'react';
import { ModalDeleteContent } from '../../components/ModalDeleteContent';



const fetchLayers = (uuids: string[],) => {
  const baseUrl = "/api/v4/rasters/";
  const fetches = uuids.map (uuid => {
    return (fetch(baseUrl + uuid + "/").then((res:any)=>res.json()));
  });
  return Promise.all(fetches)
}

const fetchLabelTypes = (uuids: string[],) => {
  const baseUrl = "/api/v4/labeltypes/";
  const fetches = uuids.map (uuid => {
    return (fetch(baseUrl + uuid + "/").then((res:any)=>res.json()));
  });
  return Promise.all(fetches)
}

export const RasterSourceDeleteModalLayersWarning = (props:any) => {

  const [layers, setLayers] = useState<any[]>([]);
  const [labelTypes, setLabelTypes] = useState<any[]>([]);
  const {row} = props;

  useEffect(() => { 
    const layerUuids = row.layers.map((layerUrl:string)=>{return layerUrl.split("/")[layerUrl.split("/").length-2] })
    const labeltypeUuids = row.labeltypes.map((layerUrl:string)=>{return layerUrl.split("/")[layerUrl.split("/").length-2] })
    fetchLayers(layerUuids)
    .then((layers:any)=>{
      setLayers(layers)
    })
    // fetchLabelTypes(labeltypeUuids)
    // .then((labelTypes:any)=>{
    //   setLabelTypes(labelTypes)
    // })
  }, [row]);

  const fields = 
    [
      {name: "name", width: 65}, 
      {name: "uuid", width: 25}
    ];

  return (
    <div>
      {/* <ul
        style={{
          overflowY: "auto",
          maxHeight: "200px"
        }}
      > */}
        {/* {layers.map((layer:any)=>{
          <li style={{fontStyle: "italic", listStyleType: "square", height: "80px"}}>
          <span style={{display:"flex", flexDirection: "row",justifyContent: "space-between", alignItems: "center"}}>
            { fields.map(field=>{
              return (
                <span title={row[field.name]} style={{width:`${field.width}%`, textOverflow: "ellipsis", overflow: "hidden"}}>{row[field.name]}</span>
              );
            })}
          </span>
        </li>
        })} */}
        {ModalDeleteContent(layers, false, fields)}
      {/* </ul>   */}
    </div>
  )
}

    