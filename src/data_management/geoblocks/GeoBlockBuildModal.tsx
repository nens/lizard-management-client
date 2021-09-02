import React, { useState } from 'react';
import { connect } from 'react-redux';
import { SubmitButton } from './../../form/SubmitButton';
import { addNotification } from './../../actions';
import ModalBackground from './../../components/ModalBackground';
import styles from './GeoBlockBuildModal.module.css';
import formStyles from './../../styles/Forms.module.css';
import buttonStyles from './../../styles/Buttons.module.css';
// @ts-ignore
import JSONInput from "react-json-editor-ajrm/index";

interface MyProps {
  source: Object,
  onChange: (value: any) => void,
  handleClose: () => void
}

function GeoBlockBuildModal (props: MyProps & DispatchProps) {
  const [json, setJson] = useState<Object>(props.source);

  return (
    <ModalBackground
      title={'Geo Block Builder'}
      handleClose={props.handleClose}
      width={'80%'}
      height={'80%'}
    >
      <div className={styles.MainContainer}>
        <div className={styles.GridContainer}>
          <h3>Build</h3>
          <JSONInput
            locale={'nl'}
            placeholder={json}
            theme="light_mitsuketa_tribute"
            onChange={(e: any) => setJson(e.jsObject)}
          />
        </div>
        <div className={`${formStyles.ButtonContainer} ${formStyles.FixedButtonContainer}`}>
          <button
            className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
            onClick={props.handleClose}
          >
            Close
          </button>
          <SubmitButton
            onClick={() => {
              props.onChange(json);
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