import React from "react";
import { PersonalApiKeyForm } from "./PersonalApiKeyForm";
import { useRecursiveFetch } from "../api/hooks";
import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';

export const NewPersonalApiKey: React.FC = () => {
  const {
    data: allPersonalApiKeys,
    isSuccess
  } = useRecursiveFetch('/api/v4/personalapikeys/', {});

  return (
    <SpinnerIfNotLoaded loaded={isSuccess}>
      <PersonalApiKeyForm allPersonalApiKeys={allPersonalApiKeys} />
    </SpinnerIfNotLoaded>
  );
}