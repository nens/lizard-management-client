import React from 'react';
// import {useState, useEffect,}  from 'react';
import Overlay from '../../components/Overlay';
import modalStyles from '../../styles/Modal.module.css';

// import buttonStyles from './../styles/Buttons.module.css';

interface MyProps {
  closeDialogAction: () => void,
  rowToBeDeleted: any,
}

const DeleteRasterSourceNotAllowed: React.FC<MyProps> = (props) => {
  const {
    closeDialogAction,
    rowToBeDeleted,
  } = props;

  const layerUuids = rowToBeDeleted.layers.map((layerUrl:string)=>{return layerUrl.split("/")[layerUrl.split("/").length-2] });
  const layerUrls = layerUuids.map((layerUuid:string)=>{return '/management#/data_management/rasters/layers/' + layerUuid})
  const labelTypeUrls = rowToBeDeleted.labeltypes.map((uuid:string)=>{return '/management#/data_management/labeltypes/' + uuid})

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
    <Overlay 
      // Todo confirmModal attribute is needed for styling. Need to change it to deleteRasterSourceNotAllowed ?
      // deleteRasterSourceNotAllowed
      confirmModal 
      handleClose={()=>{closeDialogAction()}}
    >
      <div className={modalStyles.Modal}>
        <div className={modalStyles.ModalHeader}>
          Not allowed
          <button onClick={(e)=>{closeDialogAction()}}>x</button>
        </div>
        <div className={modalStyles.ModalBody} style={{
            overflowY: "auto",
            maxHeight: "410px"
          }}
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
          {/* {props.children} */}
          {/* {spinner === true?
          <div style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems: "center"}} >
              <MDSpinner size={96} />
              <span style={{marginLeft: "20px", fontSize: "19px", fontWeight: "bold"}}>Deleting ...</span>
            </div>
            :
            null} */}
        </div>
        {/* <div className={styles.ModalFooter} style={cancelAction?{justifyContent: "space-between"}:{justifyContent: "flex-end"}}>
          {cancelAction ? (
            <button
              className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
              onClick={cancelAction}
              disabled={disableButtons}
            >
              Cancel
            </button>
          ) : null}
          {buttonConfirmName ? (
            <button
              className={`${buttonStyles.Button} ${buttonStyles.Danger}`}
              onClick={onClickButtonConfirm}
              disabled={disableButtons}
            >
              {buttonConfirmName}
            </button>
          ) : null}
        </div> */}
      </div>
    </Overlay>
  )
}

export default DeleteRasterSourceNotAllowed;