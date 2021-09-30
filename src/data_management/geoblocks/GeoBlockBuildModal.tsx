import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import { SubmitButton } from './../../form/SubmitButton';
import { addNotification } from './../../actions';
import { jsonValidator } from '../../form/validators';
import ModalBackground from './../../components/ModalBackground';
import styles from './GeoBlockBuildModal.module.css';
import formStyles from './../../styles/Forms.module.css';
import buttonStyles from './../../styles/Buttons.module.css';

interface MyProps {
  source: Object | null,
  onChange: (value: any) => void,
  handleClose: () => void
}

function GeoBlockBuildModal (props: MyProps & DispatchProps) {
  const source = JSON.stringify(props.source, undefined, 4);
  const [jsonString, setJsonString] = useState<string>(source);
  const [jsonView, setJsonView] = useState<'textEditor' | 'jsonEditor'>('textEditor');

  const setJsonStringInPrettyFormat = (e: object) => {
    setJsonString(JSON.stringify(e, undefined, 4));
  };

  return (
    <ModalBackground
      title={'Geo Block Builder'}
      handleClose={props.handleClose}
      width={'80%'}
      height={'80%'}
    >
      <div className={styles.MainContainer}>
        <button
          className={buttonStyles.BlockButton}
          onClick={() => {
            if (jsonValidator(jsonString)) {
              return alert(jsonValidator(jsonString));
            };
            if (jsonView === 'textEditor') {
              setJsonView('jsonEditor');
            } else {
              setJsonView('textEditor');
            };
          }}
          style={{
            position: 'absolute',
            top: 10,
            right: 30,
            zIndex: 1000
          }}
        >
          Switch Editor
        </button>
        {jsonView === 'textEditor' ? (
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
        {jsonView === 'jsonEditor' ? (
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
        ) : (
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
        )}
        <div className={`${formStyles.ButtonContainer} ${formStyles.FixedButtonContainer}`}>
          <button
            className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
            onClick={props.handleClose}
          >
            Close
          </button>
          <SubmitButton
            onClick={() => {
              props.onChange(JSON.parse(jsonString));
              props.handleClose();
            }}
          />
        </div>
      </div>
    </ModalBackground>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(GeoBlockBuildModal);