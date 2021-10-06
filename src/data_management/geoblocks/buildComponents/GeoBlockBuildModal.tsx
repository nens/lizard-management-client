import React, { useState } from 'react';
import { connect } from 'react-redux';
import { GeoBlockJsonComponent } from './GeoBlockJsonComponent';
import { GeoBlockVisualComponent } from './GeoBlockVisualComponent';
import { SubmitButton } from '../../../form/SubmitButton';
import { addNotification } from '../../../actions';
import ModalBackground from '../../../components/ModalBackground';
import styles from './GeoBlockBuildModal.module.css';
import formStyles from './../../../styles/Forms.module.css';
import buttonStyles from './../../../styles/Buttons.module.css';

interface MyProps {
  source: Object | null,
  onChange: (value: Object) => void,
  handleClose: () => void
}

function GeoBlockBuildModal (props: MyProps & DispatchProps) {
  const sourceString = JSON.stringify(props.source, undefined, 4);
  const [jsonString, setJsonString] = useState<string>(sourceString);
  const [geoBlockView, setGeoBlockView] = useState<'json' | 'visual'>('json');

  return (
    <ModalBackground
      title={'Geo Block Builder'}
      handleClose={props.handleClose}
      width={'80%'}
      height={'80%'}
    >
      <div className={styles.MainContainer}>
        {geoBlockView === 'json' ? (
          <GeoBlockJsonComponent
            jsonString={jsonString}
            setJsonString={setJsonString}
          />
        ) : (
          <GeoBlockVisualComponent
          />
        )}
        <div className={`${formStyles.ButtonContainer} ${formStyles.FixedButtonContainer}`}>
          <button
            className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
            onClick={props.handleClose}
          >
            Close
          </button>
          <button
            onClick={() => {
              if (geoBlockView === 'json') {
                setGeoBlockView('visual');
              } else {
                setGeoBlockView('json')
              };
            }}
          >
            Switch
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