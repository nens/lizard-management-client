import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { createFetchRecordFunctionFromUrl } from "../../../utils/createFetchRecordFunctionFromUrl";
import { Project } from "../../../types/projectType";
import ProjectForm from "./ProjectForm";
import SpinnerIfNotLoaded from "../../../components/SpinnerIfNotLoaded";

interface RouteProps {
  uuid: string;
}

export const EditProject = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<Project | null>(null);
  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/projects/${uuid}/`)();

      setCurrentRecord(currentRecord);
    })();
  }, [uuid]);

  return (
    <SpinnerIfNotLoaded loaded={!!currentRecord}>
      <ProjectForm currentRecord={currentRecord} />
    </SpinnerIfNotLoaded>
  );
};
