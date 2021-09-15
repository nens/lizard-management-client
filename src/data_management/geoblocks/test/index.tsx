import React from "react";
import { useRete } from "./Rete";

function Editor() {
  const [setContainer] = useRete();

  return (
    <div
      style={{
        width: "100px",
        height: "200px",
        border: "1px solid red"
      }}
      // @ts-ignore
      ref={(ref) => ref && setContainer(ref)}
    />
  );
}

export const ReteApp = () => {
  return (
    <Editor />
  );
}