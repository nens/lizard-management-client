import React, { useState } from 'react';
import { connect } from 'react-redux';
import { SubmitButton } from '../form/SubmitButton';
import { addNotification } from '../actions';
import ModalBackground from './ModalBackground';
import formStyles from '../styles/Forms.module.css';
import buttonStyles from '../styles/Buttons.module.css';
import { AccessModifier } from '../form/AccessModifier';

interface MyProps {
  rows: any[],
  handleClose: () => void
}

function AuthorisationModal (props: MyProps & DispatchProps) {
  const { rows } = props;
  console.log(rows)

  const [accessModifier, setAccessModifier] = useState<string | null>(null);

  return (
    <ModalBackground
      title={'Change accessibility'}
      handleClose={props.handleClose}
      width={'50%'}
      height={'50%'}
    >
      <div
        style={{
          padding: '20px 40px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <p>When you change the accessibility of the selected item(s), it will have an impact on who can see them. Choose an accessibility here.</p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <AccessModifier
              title={''}
              name={'accessModifier'}
              value={accessModifier}
              valueChanged={setAccessModifier}
            />
          </div>
        </div>
        <div className={formStyles.ButtonContainer}>
          <button
            className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
            onClick={props.handleClose}
          >
            Cancel
          </button>
          <SubmitButton
            onClick={() => console.log(123)}
            readOnly={!accessModifier}
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

export default connect(null, mapDispatchToProps)(AuthorisationModal);