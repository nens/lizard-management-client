import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import MDSpinner from "react-md-spinner";
import TemplateForm from "./TemplateForm";

interface RouteParams {
  id: string;
};

export const EditTemplate: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentTemplate, setCurrentTemplate] = useState<Object | null>(null);

  const { id } = props.match.params;
  useEffect(() => {
    (async () => {
      const template = await fetch(`/api/v4/messages/${id}/`, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      );
      setCurrentTemplate(template);
    })();
  }, [id]);

  if (currentTemplate) {
    return <TemplateForm
      currentTemplate={currentTemplate}
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