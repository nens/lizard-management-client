import { useEffect, useState } from "react";
import { ScenarioResult } from "../../../../types/scenarioType";
import { RasterLayerFromAPI } from "../../../../api/rasters";
import { getUuidFromUrl } from "../../../../utils/getUuidFromUrl";
import SpinnerIfNotLoaded from "../../../../components/SpinnerIfNotLoaded";
import ModalBackground from "../../../../components/ModalBackground";
import ResultForm from "./ResultForm";

interface MyProps {
  resultType: string | null;
  result: ScenarioResult | null;
  refetchResults: () => void;
  handleClose: () => void;
}

function ResultFormModal(props: MyProps) {
  const { result, resultType } = props;

  const [rasterLayer, setRasterLayer] = useState<RasterLayerFromAPI | null>(null);

  const submit = () => {
    props.handleClose();
    props.refetchResults();
  };

  useEffect(() => {
    if (result && result.raster) {
      (async () => {
        const rasterLayer = await fetch(`/api/v4/rasters/${getUuidFromUrl(result.raster)}/`).then(res => res.json());
        setRasterLayer(rasterLayer);
      })();
    };
  }, [result]);

  return (
    <ModalBackground
      title={"Scenario Result"}
      handleClose={props.handleClose}
      style={{
        width: "80%",
        height: "85%",
      }}
    >
      <div style={{ paddingLeft: 30, paddingRight: 30 }}>
        {resultType ? (
          <ResultForm
            resultType={resultType}
            submit={submit}
          />
        ) : result ? (
          <SpinnerIfNotLoaded loaded={!result.raster || !!rasterLayer}>
            <ResultForm
              currentRecord={result}
              rasterLayer={rasterLayer}
              submit={submit}
            />;
          </SpinnerIfNotLoaded>
        ) : null}
      </div>
    </ModalBackground>
  );
}

export default ResultFormModal;
