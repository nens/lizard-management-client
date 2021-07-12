import React from "react";

import GroupForm from "./GroupForm";
import SpinnerIfStandardSelectorsNotLoaded from '../../components/SpinnerIfStandardSelectorsNotLoaded';


export const NewGroup = () => {
    return (
      <SpinnerIfStandardSelectorsNotLoaded
        loaded={true}
      >
        <GroupForm
        />
      </SpinnerIfStandardSelectorsNotLoaded>
    );
};