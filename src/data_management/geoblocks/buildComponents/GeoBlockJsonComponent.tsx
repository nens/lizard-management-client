import ace from "brace";
import { GeoBlockSource } from "../../../types/geoBlockType";
import { JsonEditor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import "brace/mode/json";
import "./GeoBlockJsonComponent.css";

interface MyProps {
  source: GeoBlockSource | null;
  setSource: (e: any) => void;
}

export const GeoBlockJsonComponent = (props: MyProps) => {
  const { source, setSource } = props;
  return (
    <JsonEditor
      name={"source"}
      value={source ? source : {}}
      onChange={(e) => setSource(e)}
      mode={"code"}
      allowedModes={["code", "tree", "text"]}
      ace={ace}
      htmlElementProps={{
        id: "json-editor-container",
        style: {
          // calculate max height of the json editor
          // to avoid scrollbar on the whole page when
          // using tree mode and expanding the whole tree
          // (similar to the SibarBar height)
          maxHeight: "calc(100vh - 200px)",
        },
      }}
      history
      enableSort={false}
      enableTransform={false}
    />
  );
};
