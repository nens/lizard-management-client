import React, { useState } from 'react';
import { connect } from 'react-redux';
import { SubmitButton } from './../../form/SubmitButton';
import { addNotification } from './../../actions';
import ModalBackground from './../../components/ModalBackground';
import styles from './GeoBlockBuildModal.module.css';
import formStyles from './../../styles/Forms.module.css';
import buttonStyles from './../../styles/Buttons.module.css';
import { TextArea } from '../../form/TextArea';
// import { jsonValidator } from '../../form/validators';

interface MyProps {
  currentRecord: any,
  handleClose: () => void
}

function GeoBlockBuildModal (props: MyProps & DispatchProps) {
  const { currentRecord } = props;
  const jsonSource = JSON.stringify(currentRecord.source, null, 4);
  const [json, setJson] = useState<string>(jsonSource);
  console.log(json);

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
          <TextArea
            title={'Source'}
            name={'source'}
            value={json}
            valueChanged={e => setJson(e.target.value)}
            // clearInput={clearInput}
            validated
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
            onClick={() => console.log(currentRecord)}
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