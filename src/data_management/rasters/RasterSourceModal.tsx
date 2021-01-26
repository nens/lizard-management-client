import React, { useEffect, useState } from 'react';
import { fetchRasterV4 } from "../../api/rasters";
import { getUuidFromUrl } from '../../utils/getUuidFromUrl';
import Modal from '../../components/Modal';
import MDSpinner from 'react-md-spinner';

interface SourceModalProps {
  selectedLayer: string;
  closeModal: () => void;
}

export const RasterSourceModal: React.FC<SourceModalProps> = (props) => {
  const { selectedLayer, closeModal } = props;
  const [rasterSources, setRasterSources] = useState<string[] | null>(null);

  useEffect(() => {
    if (selectedLayer) fetchRasterV4(selectedLayer).then(
      res => {
        const rasterSourceURLs = res.raster_sources as string[];
        const rasterSourceUUIDs = rasterSourceURLs.map(url => getUuidFromUrl(url));
        setRasterSources(rasterSourceUUIDs);
      }
    ).catch(console.error);
  }, [selectedLayer]);

  return (
    <Modal
      title={'Related raster sources'}
      cancelAction={closeModal}
    >
      {rasterSources ? (
        <ul>
          {rasterSources.map(rasterSource => (
            <li>
              <a href={`/management#/data_management/rasters/sources/${rasterSource}/`} target="_blank" rel="noopener noreferrer">{rasterSource}</a>
            </li>
          ))}
        </ul>
      ) : (
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <MDSpinner size={24} />
        </span>
      )}
    </Modal>
  )
}