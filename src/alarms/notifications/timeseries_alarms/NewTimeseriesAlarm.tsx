import React from "react";
import { useSelector } from "react-redux";
import { getSelectedOrganisation } from "../../../reducers";
import { useRecursiveFetch } from "../../../api/hooks";
import TimeseriesAlarmForm from "./TimeseriesAlarmForm";
import SpinnerIfNotLoaded from '../../../components/SpinnerIfNotLoaded';

export const NewTimeseriesAlarm: React.FC = () => {
  
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
      <TimeseriesAlarmForm 
        groups={groups || []}
        templates={templates || []}
      />
    </SpinnerIfNotLoaded>
    );
};