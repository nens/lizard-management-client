import React from "react";
import { useSelector } from "react-redux";
import { getSelectedOrganisation } from "../../../reducers";
import { useRecursiveFetch } from "../../../api/hooks";
import RasterAlarmForm from "./RasterAlarmForm";
import SpinnerIfNotLoaded from '../../../components/SpinnerIfNotLoaded';


export const NewRasterAlarm = () => {

  const selectedOrganisation = useSelector(getSelectedOrganisation);

  const {
    data: groups,
    status: groupsFetchStatus
  } = useRecursiveFetch('/api/v4/contactgroups/', {
    organisation__uuid: selectedOrganisation.uuid
  });

  const {
    data: templates,
    status: templatesFetchStatus
  } = useRecursiveFetch('/api/v4/messages/', {
    organisation__uuid: selectedOrganisation.uuid
  });

  return (
    <SpinnerIfNotLoaded
      loaded={
        groupsFetchStatus === 'success' &&
        templatesFetchStatus === 'success'
      }
    >
      <RasterAlarmForm 
        groups={groups || []}
        templates={templates || []}
      />
    </SpinnerIfNotLoaded>
    
  );
};