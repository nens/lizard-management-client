import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { jsonValidator } from '../../../form/validators';
import formStyles from './../../../styles/Forms.module.css';
import buttonStyles from './../../../styles/Buttons.module.css';

interface MyProps {
  jsonString: string,
  setJsonString: (e: string) => void
}

export const GeoBlockJsonComponent = (props: MyProps) => {
  const { jsonString, setJsonString } = props;
  const [jsonTextView, setJsonTextView] = useState<boolean>(true);

  // Helper function to convert json to pretty format
  const setJsonStringInPrettyFormat = (e: Object) => {
    setJsonString(JSON.stringify(e, undefined, 4));
  };

  return (
    <>
      <button
        className={buttonStyles.BlockButton}
        onClick={() => {
          if (jsonValidator(jsonString)) {
            return alert(jsonValidator(jsonString));
          };
          setJsonTextView(!jsonTextView);
        }}
        style={{
          position: 'absolute',
          top: 10,
          right: 30,
          zIndex: 1000 //to stay on top of the React-JSON component
        }}
      >
        Switch Editor
      </button>
      {jsonTextView ? (
        <button
          className={buttonStyles.BlockButton}
          onClick={() => {
            if (jsonValidator(jsonString)) {
              return alert(jsonValidator(jsonString));
            };
            const object = JSON.parse(jsonString);
            setJsonStringInPrettyFormat(object);
          }}
          style={{
            position: 'absolute',
            top: 50,
            right: 30
          }}
        >
          Pretty JSON
        </button>
      ) : null}
      {jsonTextView ? (
        <textarea
          className={formStyles.FormControl}
          value={jsonString}
          onChange={e => setJsonString(e.target.value)}
          spellCheck={false}
          cols={50}
          rows={20}
          style={{
            overflowY: 'auto'
          }}
        />
      ) : (
        <ReactJson
          src={JSON.parse(jsonString)}
          name="source"
          theme="shapeshifter:inverted"
          onEdit={e => setJsonStringInPrettyFormat(e.updated_src)}
          onAdd={e => setJsonStringInPrettyFormat(e.updated_src)}
          onDelete={e => setJsonStringInPrettyFormat(e.updated_src)}
          displayDataTypes={false}
          displayObjectSize={false}
          quotesOnKeys={false}
          style={{
            position: "absolute",
            height: "80%",
            width: "100%",
            overflow: "auto",
            border: "1px solid lightgrey",
            borderRadius: 5
          }}
        />
      )}
    </>
  )
}