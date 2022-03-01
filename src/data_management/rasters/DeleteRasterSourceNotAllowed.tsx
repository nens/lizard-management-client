import React from 'react';
import { RasterSourceFromAPI } from '../../api/rasters';
import Modal from '../../components/Modal';

interface MyProps {
  handleClose: () => void,
  rowToBeDeleted: RasterSourceFromAPI,
}

const DeleteRasterSourceNotAllowed: React.FC<MyProps> = (props) => {
  const {
    handleClose,
    rowToBeDeleted,
  } = props;

  const layerUuids = rowToBeDeleted.layers.map((layerUrl:string)=>{return layerUrl.split("/")[layerUrl.split("/").length-2] });
  const layerUrls = layerUuids.map((layerUuid:string)=>{return '/management/data_management/rasters/layers/' + layerUuid});
  const labelTypeUrls = rowToBeDeleted.labeltypes.map((uuid:string)=>{return '/management/data_management/labeltypes/' + uuid});

  return (
    <Modal
      title={"Not allowed"}
      cancelAction={handleClose}
    >
      <p>
        {'You are trying to delete the raster source '}
        <a target="_blank" rel="noopener noreferrer" href={`/management/data_management/rasters/sources/${rowToBeDeleted.uuid}`}>{rowToBeDeleted.name}</a>
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