import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import {createFetchRecordFunctionFromUrl} from '../../utils/createFetchRecordFunctionFromUrl';

import LayerCollectionForm from "./LayerCollectionForm";
import SpinnerIfNotLoaded from '../../components/SpinnerIfNotLoaded';

interface RouteParams {
  slug: string;
};

export const EditLayerCollection: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentRecord, setCurrentRecord] = useState<any | undefined>(undefined);

  const { slug } = props.match.params;
  useEffect(() => {
    (async () => {
      const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/layercollections/${slug}`)();
      setCurrentRecord(currentRecord);
    })();
  }, [slug]);

  return (
    <SpinnerIfNotLoaded
      loaded={!!currentRecord}
    >
      <LayerCollectionForm
        currentRecord={currentRecord}
      />;
    </SpinnerIfNotLoaded>
  );
};