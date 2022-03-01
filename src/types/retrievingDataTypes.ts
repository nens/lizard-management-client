export type DataRetrievalState =
  | "NEVER_DID_RETRIEVE"
  | "RETRIEVING"
  | "RETRIEVED"
  | { status: "ERROR"; errorMesssage: string; url: string };
