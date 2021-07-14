import React from "react";
import UserForm from "./UserForm";
import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';

export const NewUser: React.FC = () => {
  return (
    <SpinnerIfNotLoaded
      loaded={true}
    >
      <UserForm />
    </SpinnerIfNotLoaded>
  );
};