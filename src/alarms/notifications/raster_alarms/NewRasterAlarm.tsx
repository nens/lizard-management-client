import React from "react";
import MDSpinner from "react-md-spinner";
import { useSelector } from "react-redux";
import { getSelectedOrganisation } from "../../../reducers";
import { usePaginatedFetch } from "../../../utils/usePaginatedFetch";
import RasterAlarmForm from "./RasterAlarmForm";

export const NewRasterAlarm: React.FC = () => {
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

  if (
    groupsFetchingState && groupsFetchingState !== 'FETCHING' &&
    templatesFetchingState && templatesFetchingState !== 'FETCHING'
  ) {
    return (
      <RasterAlarmForm
        groups={groups || []}
        templates={templates || []}
      />
    )
  } else {
    return (
      <div
        style={{
          position: "relative",
          top: 50,
          height: 300,
          bottom: 50,
          marginLeft: "50%"
        }}
      >
        <MDSpinner size={24} />
      </div>
    );
  }
};