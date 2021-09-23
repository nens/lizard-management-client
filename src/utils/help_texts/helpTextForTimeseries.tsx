import React from 'react';
import { useSelector} from 'react-redux';
import {
  getTimeseriesTotalSize,
  getTimeseriesAvailableSizeDefinedByContract,
  getSelectedOrganisation
} from '../../reducers';
import UsagePieChart from './../../components/UsagePieChart';
import {
  accessModifierHelpText,
  codeHelpText,
  HelpText,
  nameHelpText,
  organisationHelpText,
  supplierCodeHelpText,
  supplierHelpText,
  uuidHelpText
} from './defaultHelpText';

export const TimeseriesTableHelptext = () => {
  const rastersTotalSize = useSelector(getTimeseriesTotalSize);
  const rasterAvailableSizeDefinedByContract = useSelector(getTimeseriesAvailableSizeDefinedByContract);
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  return (
    <div>
      <div
        style={{
          display:"flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{marginBottom: "16px"}}>
          {`Timeseries usage for`}
          <div style={{fontWeight: "bold"}}>{selectedOrganisation.name}</div>
        </div>
        <UsagePieChart
          used={rastersTotalSize}
          available={rasterAvailableSizeDefinedByContract}
        />
      </div>
    </div>
  );
}

export const timeseriesFormHelpText: HelpText = {
  default: 'Form to edit time series. Please select a field to get more information.',
  name: nameHelpText,
  uuid: uuidHelpText,
  code: codeHelpText,
  observationType: 'Choose how the data is measured and its units.',
  location: 'Choose the location you want to add this timeseries to.',
  valueType: 'Specify what kind of data is supplied.',
  datasource: 'Choose the datasource this timeseries originates from.',
  intervalCheckbox: 'Specify a time range between each time series step.',
  interval: 'Specify a time range between each time series step.',
  extraMetadata: (
    <>
      <p>Free JSON field to add information to this object.</p>
      <p><i>e.g. {'{"long_term_average": -1.43}'}</i></p>
    </>
  ),
  accessModifier: accessModifierHelpText,
  organisation: organisationHelpText,
  supplier: supplierHelpText,
  supplierCode: supplierCodeHelpText,
  data: (
    <>
      <p>Upload your CSV files here in .csv format to add new events to the time series.</p>
      <p>The first line of the file should describe the column names, for example:</p>
      <div
        style={{
          backgroundColor: "#EEEEEE",
          fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
          margin: "10px 0"
        }}
      >
        <span>time, value</span><br />
        <span>2020-03-20T01:00:00Z, 3.14</span><br />
        <span>2020-03-20T01:05:00Z, 2.72</span>
      </div>
    </>
  )
}