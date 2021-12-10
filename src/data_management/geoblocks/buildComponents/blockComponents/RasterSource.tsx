import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useSelector } from 'react-redux';
import { Handle, Node, Position } from 'react-flow-renderer';
import { getSelectedOrganisation } from '../../../../reducers';
import { convertToSelectObject } from '../../../../utils/convertToSelectObject';
import { fetchRasterSources } from '../../../rasters/RasterLayerForm';
import { fetchRasterSourceV4 } from '../../../../api/rasters';
import { Value } from '../../../../form/SelectDropdown';
import { BlockName } from './BlockName';
import styles from './Block.module.css';

interface RasterSourceInput {
  label: string,
  classOfBlock: string
  value: string,
  onChange: (value: string) => void,
  onBlockNameChange: (name: string) => void
}

export const RasterSource = (props: Node<RasterSourceInput>) => {
  const { label, classOfBlock, value, onChange, onBlockNameChange } = props.data!;
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  const [rasterSource, setRasterSource] = useState<Value | null>(value ? convertToSelectObject(value) : null);
  useEffect(() => {
    if (value) {
      fetchRasterSourceV4(value).then(rasterSource =>
        rasterSource && rasterSource.uuid && setRasterSource(convertToSelectObject(rasterSource.uuid, rasterSource.name))
      );
    };
  }, [value]);

  return (
    <div
      className={`${styles.Block} ${styles.RasterSource}`}
      tabIndex={1}
    >
      <div
        className={styles.BlockHeader}
      >
        <BlockName
          label={label}
          onConfirm={onBlockNameChange}
        />
        <small><i>({classOfBlock})</i></small>
      </div>
      <AsyncSelect
        className={styles.BlockInput + ' nodrag'}
        placeholder={'Search and select'}
        cacheOptions
        defaultOptions
        loadOptions={searchInput => searchInput ? fetchRasterSources(selectedOrganisation.uuid, searchInput) : Promise.resolve()}
        value={rasterSource}
        onChange={option => option && onChange(option.value.toString())}
        isClearable={false}
        isSearchable
        components={{
          DropdownIndicator:() => null,
          IndicatorSeparator:() => null
        }}
      />
      <div
        style={{ marginTop: 10 }}
      >
        <small>{rasterSource?.label}</small><br />
        <small>{rasterSource?.value}</small>
      </div>
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}