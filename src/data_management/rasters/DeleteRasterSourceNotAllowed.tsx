import React from 'react';
import {useState, useEffect,}  from 'react';
import Modal from '../../components/Modal';
import MDSpinner from "react-md-spinner";

interface MyProps {
  closeDialogAction: () => void,
  rowToBeDeleted: any,
}

const DeleteRasterSourceNotAllowed: React.FC<MyProps> = (props) => {
  const {
    closeDialogAction,
    rowToBeDeleted,
  } = props;

  const rasterSourceUrl = "/api/v4/rastersources/";
  const [rasterSource, setRasterSource] = useState<null | any>(null);

  const layerUuids = rasterSource && rasterSource.layers.map((layerUrl:string)=>{return layerUrl.split("/")[layerUrl.split("/").length-2] });
  const layerUrls = layerUuids && layerUuids.map((layerUuid:string)=>{return '/management#/data_management/rasters/layers/' + layerUuid})
  const labelTypeUrls = rasterSource && rasterSource.labeltypes.map((uuid:string)=>{return '/management#/data_management/labeltypes/' + uuid})
  
  // old code when rasterlayers and labels were on the rastersource list api
  // const layerUuids = rowToBeDeleted.layers.map((layerUrl:string)=>{return layerUrl.split("/")[layerUrl.split("/").length-2] });
  // const layerUrls = layerUuids.map((layerUuid:string)=>{return '/management#/data_management/rasters/layers/' + layerUuid})
  // const labelTypeUrls = rowToBeDeleted.labeltypes.map((uuid:string)=>{return '/management#/data_management/labeltypes/' + uuid})

  useEffect(() => { 
    
    fetch(rasterSourceUrl + rowToBeDeleted.uuid)
    .then((result:any)=>{
      return result.json();
    })
    .then((rasterSource:any)=>{
      setRasterSource(rasterSource);
    })
  }, [rowToBeDeleted]);
  


  // Do not remove, lateron we are going to display layer name and labeltype name instead of url
  // const fetchLayers = (uuids: string[],) => {
  //   const baseUrl = "/api/v4/rasters/";
  //   const fetches = uuids.map (uuid => {
  //     return (fetch(baseUrl + uuid + "/").then((res:any)=>res.json()));
  //   });
  //   return Promise.all(fetches)
  // }
  
  // const fetchLabelTypes = (uuids: string[],) => {
  //   const baseUrl = "/api/v4/labeltypes/";
  //   const fetches = uuids.map (uuid => {
  //     return (fetch(baseUrl + uuid + "/").then((res:any)=>res.json()));
  //   });
  //   return Promise.all(fetches)
  // }
  
  
  // const [layers, setLayers] = useState<any[]>([]);
  // const [labelTypes, setLabelTypes] = useState<any[]>([]);
  // const [spinner, ] = useState<any[]>([]);

  // useEffect(() => { 
  //   const layerUuids = rowToBeDeleted.layers.map((layerUrl:string)=>{return layerUrl.split("/")[layerUrl.split("/").length-2] })
  //   const labeltypeUuids = rowToBeDeleted.labeltypes.map((layerUrl:string)=>{return layerUrl.split("/")[layerUrl.split("/").length-2] })
  //   fetchLayers(layerUuids)
  //   .then((layers:any)=>{
  //     setLayers(layers)
  //   })
  //   // fetchLabelTypes(labeltypeUuids)
  //   // .then((labelTypes:any)=>{
  //   //   setLabelTypes(labelTypes)
  //   // })
  // }, [rowToBeDeleted]);

  return (
    <Modal
      title={"Not allowed"}
      closeDialogAction={closeDialogAction}
    >
          {"You are trying to delete the raster-source "}
          <a target="_blank" rel="noopener noreferrer" href={`/management#/data_management/rasters/sources/${rowToBeDeleted.uuid}`}>{rowToBeDeleted.name}</a>
          <br></br>
          {"but this raster-source still has dependent objects."} 
          <br></br>
          <br></br>
          Please handle dependent objects first by:
          <br></br>
          <br></br>
          <ul>
            <li>Connecting them to another raster-source, or</li>
            <li>Deleting them</li>
          </ul>
          <br></br>
          <div
            style={{
              overflowY: "auto",
              // because we do not want the ontainer to change height after the content is loaded we give it static height
              // maxHeight: "210px",
              height: "210px"
            }}
          >
            {
              rasterSource === null?
              <>
              <MDSpinner size={24} /><span style={{marginLeft: "40px"}}>Loading dependent objects ..</span>
              </>
              :
              <>
                {layerUrls.length > 0?
                  <div>
                    <label>Dependent raster-layers:</label>
                    <ul>
                      {layerUrls.map((url:string)=>{return(
                        <li>
                          <a target="_blank" rel="noopener noreferrer" href={url}>{url}</a>
                        </li>
                      )})}
                    </ul>
                  </div>
                  :
                  null
                  }
                  <br></br>
                  {labelTypeUrls.length > 0?
                  <div>
                    <label>Dependent labeltypes:</label>
                    <ul>
                      {labelTypeUrls.map((url:string)=>{return(
                        <li>
                          <a target="_blank" rel="noopener noreferrer" href={url}>{url}</a>
                        </li>
                      )})}
                    </ul>
                  </div>
                  :
                  null
                  }
              </>
            }
            
          </div>
    </Modal>
  )
}

export default DeleteRasterSourceNotAllowed;