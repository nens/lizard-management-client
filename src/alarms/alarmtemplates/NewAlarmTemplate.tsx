import React from "react";
import TemplateForm from "./TemplateForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';


export const NewTemplate = () => {
  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={true}
    >
      <TemplateForm
      />
    </SpinnerIfStandardSelectorsNotLoaded>
  );
};
