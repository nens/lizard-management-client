import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import MDSpinner from "react-md-spinner";
import GroupForm from "./GroupForm";

interface RouteParams {
  id: string;
};

export const EditGroup: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentGroup, setCurrentGroup] = useState<Object | null>(null);

  const { id } = props.match.params;
  useEffect(() => {
    (async () => {
      const group = await fetch(`/api/v4/contactgroups/${id}/`, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      );
      setCurrentGroup(group);
    })();
  }, [id]);

  if (currentGroup) {
    return <GroupForm
      currentGroup={currentGroup}
    />;
  }
  else {
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