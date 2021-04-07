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
  fetchFunction: (uuids: string[], fetchOptions: RequestInit) => Promise<Response[]>,
  resetTable: Function | null,
  handleClose: () => void,
}

function AuthorisationModal (props: MyProps & DispatchProps) {
  const { rows } = props;

  const [accessModifier, setAccessModifier] = useState<string | null>(null);

  // PATCH requests
  const handleSubmit = async () => {
    const uuids = rows.map(row => row.uuid);
    const options = {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_modifier: accessModifier
      })
    };
    try {
      const results = await props.fetchFunction(uuids, options as RequestInit);
      if (results.every(res => res.status === 200)) {
        props.addNotification('Success! Accessibility has been modified', 2000);
        props.handleClose();
        props.resetTable && props.resetTable();
      } else {
        props.addNotification('An error occurred! Please try again!', 2000);
        console.error('Error modifying access modifier for: ', results);
      };
    } catch (message_1) {
      return console.error(message_1);
    };
  };

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
            onClick={handleSubmit}
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