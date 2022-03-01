import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { LabeltypeForm } from "./LabeltypeForm";
import SpinnerIfNotLoaded from "../../components/SpinnerIfNotLoaded";
import { createFetchRecordFunctionFromUrl } from "../../utils/createFetchRecordFunctionFromUrl";
import { LabelType } from "../../types/labelType";

interface RouteProps {
  uuid: string;
}

const EditLabeltype = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<LabelType | null>(null);
  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v3/labeltypes/${uuid}/`)();
      setCurrentRecord(currentRecord);
    })();
  }, [uuid]);

  return (
    <SpinnerIfNotLoaded loaded={!!currentRecord}>
      <LabeltypeForm currentRecord={currentRecord!} />
    </SpinnerIfNotLoaded>
  );
};

export { EditLabeltype };
