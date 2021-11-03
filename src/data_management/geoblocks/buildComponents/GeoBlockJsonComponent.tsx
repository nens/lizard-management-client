import React from 'react';
import ace from 'brace';
import { GeoBlockSource } from '../../../types/geoBlockType';
import { JsonEditor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import 'brace/mode/json';

interface MyProps {
  source: GeoBlockSource | null,
  setSource: (e: any) => void
}

export const GeoBlockJsonComponent = (props: MyProps) => {
  const { source, setSource } = props;
  return (
    <JsonEditor
      name={'source'}
      value={source ? source : {}}
      onChange={e => setSource(e)}
      allowedModes={['tree', 'code', 'text']}
      ace={ace}
      htmlElementProps={{style: {
        position: 'absolute',
        width: '100%',
        height: '90%'
      }}}
      history
      enableSort={false}
      enableTransform={false}
    />
  )
}