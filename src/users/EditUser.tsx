import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import { useSelector } from "react-redux";
import { getSelectedOrganisation } from "../reducers";
import MDSpinner from "react-md-spinner";
import UserForm from "./UserForm";

interface RouteParams {
  id: string;
};

export const EditUser: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [currentUser, setCurrentUser] = useState<Object | null>(null);

  const { id } = props.match.params;
  useEffect(() => {
    (async () => {
      const user = await fetch(`/api/v4/organisations/${selectedOrganisation.uuid}/users/${id}/`, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      );
      setCurrentUser(user);
    })();
  }, [id, selectedOrganisation.uuid]);

  if (currentUser) {
    return <UserForm
      currentUser={currentUser}
    />;
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