import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useSelector } from 'react-redux';
import { Handle, Node, Position } from 'react-flow-renderer';
import { getSelectedOrganisation } from '../../../../reducers';
import { convertToSelectObject } from '../../../../utils/convertToSelectObject';
import { fetchRasterSources } from '../../../rasters/RasterLayerForm';
import { fetchRasterSourceV4 } from '../../../../api/rasters';
import styles from './Block.module.css';

interface RasterBlockInput {
  label: string,
  classOfBlock: string
  value: string,
  onChange: (value: string) => void,
}

export const RasterBlock = (props: Node<RasterBlockInput>) => {
  const { label, classOfBlock, value, onChange } = props.data!;
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  const [rasterSourceName, setRasterSourceName] = useState<string>('');
  useEffect(() => {
    fetchRasterSourceV4(value).then(
      rasterSource => setRasterSourceName(rasterSource.name)
    );
  }, [value]);

  return (
    <div
      className={`${styles.Block} ${styles.RasterBlock}`}
      tabIndex={1}
    >
      <div
        className={styles.BlockHeader}
      >
        <h4>{label}</h4>
        <small><i>({classOfBlock})</i></small>
      </div>
      <AsyncSelect
        className={styles.BlockInput}
        placeholder={'Please enter an UUID'}
        cacheOptions
        defaultOptions
        loadOptions={searchInput => fetchRasterSources(selectedOrganisation.uuid, searchInput)}
        value={convertToSelectObject(value)}
        onChange={option => option && onChange(option.value.toString())}
        isClearable={false}
        isSearchable
        components={{
          DropdownIndicator:() => null,
          IndicatorSeparator:() => null
        }}
      />
      <i>{rasterSourceName}</i>
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}