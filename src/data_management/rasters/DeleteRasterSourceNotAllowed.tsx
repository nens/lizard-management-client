import React from 'react';
import Modal from '../../components/Modal';

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
      <p>
        {'You are trying to delete the raster source '}
        <a target="_blank" rel="noopener noreferrer" href={`/management#/data_management/rasters/sources/${rowToBeDeleted.uuid}`}>{rowToBeDeleted.name}</a>
        <br />
        but this raster source still has dependent objects.
      </p>
      <p>Please handle dependent objects first by either:</p>
      <ul>
        <li>Connecting them to another raster source</li>
        <li>Deleting them</li>
      </ul>
      <div
        style={{
          overflowY: "auto",
          maxHeight: "210px",
        }}
      >
        {layerUrls.length > 0?
        <div>
          <label>Dependent raster layers:</label>
          <ol>
            {layerUrls.map((url: string) => (
              <li key={url}>
                <a target="_blank" rel="noopener noreferrer" href={url}>{url}</a>
              </li>
            ))}
          </ol>
        </div>
        :
        null
        }
        <br></br>
        {labelTypeUrls.length > 0?
        <div>
          <label>Dependent label types:</label>
          <ol>
            {labelTypeUrls.map((url:string) => (
              <li>
                <a target="_blank" rel="noopener noreferrer" href={url}>{url}</a>
              </li>
            ))}
          </ol>
        </div>
        :
        null
        }
      </div>
    </Modal>
  )
}

export default DeleteRasterSourceNotAllowed;