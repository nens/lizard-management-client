import React from "react";
import TemplateForm from "./TemplateForm";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';


export const NewTemplate = () => {
  return (
    <SpinnerIfNotLoaded
      loaded={true}
    >
      <TemplateForm
      />
    </SpinnerIfNotLoaded>
  );
};
