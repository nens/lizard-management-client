import React from "react";
import UserForm from "./UserForm";
import SpinnerIfStandardSelectorsNotLoaded from '../components/SpinnerIfStandardSelectorsNotLoaded';

export const NewUser: React.FC = () => {
  return (
    <SpinnerIfStandardSelectorsNotLoaded
      loaded={true}
    >
      <UserForm />
    </SpinnerIfStandardSelectorsNotLoaded>
  );
};