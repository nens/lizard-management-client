import React from 'react';
import {useState, useEffect,}  from 'react';
import { ModalDeleteContent } from '../../components/ModalDeleteContent';

const fetchLabelTypes = (uuids: string[],) => {
  const baseUrl = "/api/v4/labeltypes/";
  const fetches = uuids.map (uuid => {
    return (fetch(baseUrl + uuid + "/").then((res:any)=>res.json()));
  });
  return Promise.all(fetches)
}

export const RasterSourceDeleteModalLabelTypesWarning = (props:any) => {

  const [labelTypes, setLabelTypes] = useState<any[]>([]);
  const {row} = props;

  useEffect(() => { 
    const labeltypeUuids = row.labeltypes
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
      <ul
        style={{
          overflowY: "auto",
          maxHeight: "200px"
        }}
      >
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
        {ModalDeleteContent(labelTypes, false, fields)}
      </ul>  
    </div>
  )
}

    