import React from "react";
import { useSelector } from "react-redux";
import { getSelectedOrganisation } from "../../../reducers";
import { usePaginatedFetch } from "../../../utils/usePaginatedFetch";
import RasterAlarmForm from "./RasterAlarmForm";
import SpinnerIfNotLoaded from '../../../components/SpinnerIfNotLoaded';


export const NewRasterAlarm = () => {

  const selectedOrganisation = useSelector(getSelectedOrganisation);

  const {
    results: groups,
    fetchingState: groupsFetchingState
  } = usePaginatedFetch({
    url: `/api/v4/contactgroups/?organisation__uuid=${selectedOrganisation.uuid}`
  });

  const {
    results: templates,
    fetchingState: templatesFetchingState
  } = usePaginatedFetch({
    url: `/api/v4/messages/?organisation__uuid=${selectedOrganisation.uuid}`
  });

  return (
    <SpinnerIfNotLoaded
      loaded={
        groupsFetchingState === 'RETRIEVED' &&
        templatesFetchingState === 'RETRIEVED'
      }
    >
      <RasterAlarmForm 
        groups={groups || []}
        templates={templates || []}
      />
    </SpinnerIfNotLoaded>
    
  );
};