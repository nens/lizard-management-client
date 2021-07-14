import React from "react";

import GroupForm from "./GroupForm";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';


export const NewGroup = () => {
    return (
      <SpinnerIfNotLoaded
        loaded={true}
      >
        <GroupForm
        />
      </SpinnerIfNotLoaded>
    );
};