import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { SelectDropdown } from '../../form/SelectDropdown';
import { SubmitButton } from '../../form/SubmitButton';
import { getSelectedOrganisation } from '../../reducers';
import { addNotification } from '../../actions';
import ModalBackground from '../../components/ModalBackground';
import formStyles from '../../styles/Forms.module.css';
import buttonStyles from '../../styles/Buttons.module.css';

interface MyProps {
  contact: any,
  handleClose: () => void
}

interface SelectedGroup {
  value: number,
  label: string,
  contacts: number[]
}

function AddToGroupModal (props: MyProps & DispatchProps) {
  const { contact } = props;

  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [groups, setGroups] = useState<SelectedGroup[] | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<SelectedGroup[]>([]);

  // useEffect to load the list of available groups for the selected organisation
  useEffect(() => {
    fetch(`/api/v4/contactgroups/?page_size=1000&organisation__uuid=${selectedOrganisation.uuid}`, {
      credentials: 'same-origin'
    }).then(
      response => response.json()
    ).then(data =>{
      const listOfGroups = data.results.map((group: any) => ({
        value: group.id,
        label: group.name,
        contacts: group.contacts.map((contact: any) => contact.id)
      }));

      const listOfGroupsWithoutCurrentContact = listOfGroups.filter(
        (group: any) => !group.contacts.includes(contact.id)
      );

      // Only show in the Dropdown groups in which the selected contact has not yet been added to
      setGroups(listOfGroupsWithoutCurrentContact);
    }).catch(console.error);
  }, [selectedOrganisation, contact.id]);

  // PATCH requests to update group(s) with the new contact
  const handleSubmit = async () => {
    const fetchContactGroupsWithOptions = selectedGroups.map(group => {
      const body = {
        contacts: [...new Set(group.contacts.concat(contact.id))]
      };

      return fetch(`/api/v4/contactgroups/${group.value}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    });

    try {
      const results = await Promise.all(fetchContactGroupsWithOptions);
      if (results.every(res => res.status === 200)) {
        props.addNotification('Success! Contact added to group(s)', 2000);
        props.handleClose();
      } else {
        props.addNotification('An error occurred! Please try again!', 2000);
        console.error('Error adding contact(s) to group: ', results);
      };
    } catch (message_1) {
      return console.error(message_1);
    };
  };

  return (
    <ModalBackground
      title={'Add Contact to Group'}
      handleClose={props.handleClose}
      width={'50%'}
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
        <p>Which group(s) would you like to add <b>{contact.first_name} {contact.last_name}</b> to?</p>
        <p><i>Note: only groups that the contact has not yet been added to are shown in the list</i></p>
        <SelectDropdown
          title={'Groups'}
          name={'groups'}
          placeholder={'- Search and select -'}
          valueChanged={value => setSelectedGroups(value as [])}
          options={groups || []}
          validated
          isMulti
          isLoading={!groups}
        />
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
          readOnly={!selectedGroups.length}
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

export default connect(null, mapDispatchToProps)(AddToGroupModal);