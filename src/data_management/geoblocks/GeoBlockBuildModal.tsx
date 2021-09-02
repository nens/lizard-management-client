import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import { SubmitButton } from './../../form/SubmitButton';
import { addNotification } from './../../actions';
import ModalBackground from './../../components/ModalBackground';
import styles from './GeoBlockBuildModal.module.css';
import formStyles from './../../styles/Forms.module.css';
import buttonStyles from './../../styles/Buttons.module.css';

interface MyProps {
  source: Object,
  onChange: (value: any) => void,
  handleClose: () => void
}

function GeoBlockBuildModal (props: MyProps & DispatchProps) {
  const [jsonObject, setJsonObject] = useState<Object>(props.source);

  return (
    <ModalBackground
      title={'Geo Block Builder'}
      handleClose={props.handleClose}
      width={'80%'}
      height={'80%'}
    >
      <div className={styles.MainContainer}>
        <ReactJson
          src={jsonObject}
          theme={"shapeshifter:inverted"}
          onEdit={e => setJsonObject(e.updated_src)}
          onAdd={e => setJsonObject(e.updated_src)}
          onDelete={e => setJsonObject(e.updated_src)}
          displayDataTypes={false}
          displayObjectSize={false}
          style={{
            position: "absolute",
            height: "80%",
            width: "100%",
            overflow: "auto",
            border: "1px solid lightgrey",
            borderRadius: 5
          }}
        />
        <div className={`${formStyles.ButtonContainer} ${formStyles.FixedButtonContainer}`}>
          <button
            className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
            onClick={props.handleClose}
          >
            Close
          </button>
          <SubmitButton
            onClick={() => {
              props.onChange(jsonObject);
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