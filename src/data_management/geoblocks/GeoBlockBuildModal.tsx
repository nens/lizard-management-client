import React from 'react';
import { connect } from 'react-redux';
import { SubmitButton } from './../../form/SubmitButton';
import { addNotification } from './../../actions';
import ModalBackground from './../../components/ModalBackground';
import styles from './GeoBlockBuildModal.module.css';
import formStyles from './../../styles/Forms.module.css';
import buttonStyles from './../../styles/Buttons.module.css';
import { TextArea } from '../../form/TextArea';
import { jsonValidator } from '../../form/validators';

interface MyProps {
  currentRecord: any,
  handleClose: () => void
}

function GeoBlockBuildModal (props: MyProps & DispatchProps) {
  const { currentRecord } = props;
  console.log(currentRecord.source);
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
            value={JSON.stringify(currentRecord.source)}
            valueChanged={() => null}
            // clearInput={clearInput}
            validated={!jsonValidator(JSON.stringify(currentRecord.source))}
            errorMessage={jsonValidator(JSON.stringify(currentRecord.source))}
            readOnly
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
            onClick={() => null}
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