import React from 'react';

export interface HelpText {
  [name: string]: string | JSX.Element
};

export const accessModifierHelpText = 'Choose an accessibility to decide who has access to this object. The default is private.';

export const datasetHelpText = (
  <>
    <p>Choose a dataset for this object.</p>
    <p><i>Datasets are used to group objects together and can be seen as tag or label.</i></p>
  </>
);

export const descriptionHelpText = 'Please give an accurate description of this object and its uses.';

export const nameHelpText = 'Choose a name that is findable and not too difficult.';

export const organisationHelpText = (
  <>
    <p>The organisation which this object belongs to.</p>
    <p><i>This field is always pre-filled with the current organisation.</i></p>
  </>
);

export const organisationsToSharedWithHelpText = 'Search and select organisations to share with.';

export const sharedWithCheckboxHelpText = 'Specify if this object should be accessible by other organisations.';

export const supplierHelpText = 'The supplier of this object.';

export const supplierCodeHelpText = (
  <>
    <p>The FTP or Supplier code is used as reference to your own system.</p>
    <p><i>If this is a manual entry, it can be left empty.</i></p>
  </>
);