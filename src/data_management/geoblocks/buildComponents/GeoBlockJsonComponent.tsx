import React from 'react';
import { JsonEditor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

interface MyProps {
  jsonString: string,
  setJsonString: (e: string) => void
}

export const GeoBlockJsonComponent = (props: MyProps) => {
  const { jsonString, setJsonString } = props;
  return (
    <JsonEditor
      value={JSON.parse(jsonString)}
      onChange={e => setJsonString(e)}
      allowedModes={['tree', 'text']}
      htmlElementProps={{style: {
        position: 'absolute',
        width: '100%',
        height: '90%'
      }}}
      enableSort={false}
      enableTransform={false}
    />
  )
}