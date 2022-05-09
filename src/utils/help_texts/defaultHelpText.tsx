export interface HelpText {
  [name: string]: string | JSX.Element;
}

export const defaultTableHelpText = (explainText: string) => {
  return (
    <>
      <p>{explainText}</p>
      <p>Check out possible actions by clicking the three dots icon.</p>
      <p>
        Create a new object with the <b>New Item</b> button on the top right corner.
      </p>
    </>
  );
};

export const accessModifierHelpText =
  "Choose an accessibility to decide who has access to this object. The default is private.";

export const codeHelpText = "Choose a code that represents the object within your organisation.";

export const layercollectionHelpText = (
  <>
    <p>Choose a layer collection for this object.</p>
    <p>
      <i>Layer collections are used to group objects together and can be seen as tag or label.</i>
    </p>
  </>
);

export const descriptionHelpText =
  "Please give an accurate description of this object and its uses.";

export const nameHelpText = "Choose a name that is findable and not too difficult.";

export const uuidHelpText = "Universally unique identifier (UUID) of this object.";

export const organisationHelpText = (
  <>
    <p>The organisation which this object belongs to.</p>
    <p>
      <i>This field is always pre-filled with the current organisation.</i>
    </p>
  </>
);

export const organisationsToSharedWithHelpText = "Search and select organisations to share with.";

export const sharedWithCheckboxHelpText =
  "Specify if this object should be accessible by other organisations.";

export const supplierHelpText = "The supplier of this object.";

export const supplierCodeHelpText = (
  <>
    <p>The FTP or Supplier code is used as reference to your own system.</p>
    <p>
      <i>If this is a manual entry, it can be left empty.</i>
    </p>
  </>
);
