import { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import GroupForm from "./GroupForm";
import SpinnerIfNotLoaded from "../../components/SpinnerIfNotLoaded";
import { createFetchRecordFunctionFromUrl } from "../../utils/createFetchRecordFunctionFromUrl";
import { ContactGroup } from "../../types/contactGroupType";

interface RouteParams {
  id: string;
}

export const EditGroup = (props: RouteComponentProps<RouteParams>) => {
  const { id } = props.match.params;

  const [currentRecord, setCurrentRecord] = useState<ContactGroup | null>(null);

  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(
        `/api/v4/contactgroups/${id}/`
      )();
      setCurrentRecord(currentRecord);
    })();
  }, [id]);

  return (
    <SpinnerIfNotLoaded loaded={!!currentRecord}>
      <GroupForm currentRecord={currentRecord!} />
    </SpinnerIfNotLoaded>
  );
};
