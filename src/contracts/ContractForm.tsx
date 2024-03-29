import { useSelector } from "react-redux";
import { ExplainSideColumn } from "../components/ExplainSideColumn";
import { InfoLabel } from "../form/InfoLabel";
import { UsageField } from "./UsageField";
import { CancelButton } from "../form/CancelButton";
import { getContractForSelectedOrganisation, getUsage } from "../reducers";
import { helpTextContractView } from "../utils/help_texts/helpTextContractView";
import formStyles from "./../styles/Forms.module.css";
import agreementIcon from "../images/agreement.svg";

export const ContractForm = () => {
  const contractObjApi = useSelector(getContractForSelectedOrganisation)!;
  const usageObj = useSelector(getUsage)!;

  return (
    <ExplainSideColumn
      imgUrl={agreementIcon}
      imgAltDescription={"Contract Icon"}
      headerText={"Contract"}
      explanationText={helpTextContractView["default"]}
      backUrl={"/management"}
    >
      <form className={formStyles.Form}>
        <span className={`${formStyles.FormFieldTitle} ${formStyles.FirstFormFieldTitle}`}>
          1: General
        </span>
        <InfoLabel
          title={"Start date"}
          name={"start_date_contract"}
          value={new Date(contractObjApi.start).toLocaleDateString()}
        />
        <span className={formStyles.FormFieldTitle}>2. Usage</span>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
          }}
        >
          <UsageField
            title={"Rasters"}
            used={usageObj.raster_total_size}
            available={contractObjApi.raster_storage_capacity}
          />
          <UsageField
            title={"Scenarios"}
            used={usageObj.scenario_total_size}
            available={contractObjApi.scenario_storage_capacity}
          />
          <UsageField
            title={"Timeseries"}
            used={usageObj.timeseries_total_size}
            available={contractObjApi.timeseries_storage_capacity}
          />
        </div>
        {/* <div className={formStyles.GridContainer}>
          <InfoLabel
            title={'Assets capacity'}
            name={'asset_capacity'}
            value={contractObjApi.asset_capacity}
          />
          <InfoLabel
            title={'Labels capacity'}
            name={'label_capacity'}
            value={contractObjApi.label_capacity}
          />
          <div />
          <InfoLabel
            title={'Events capacity'}
            name={'event_capacity'}
            value={contractObjApi.event_capacity}
          />
          <InfoLabel
            title={'Alarm message capacity'}
            name={'alarm_message_capacity'}
            value={contractObjApi.alarm_message_capacity}
          />
        </div> */}
        {/* <div className={formStyles.GridContainer}>
          <InfoLabel
            title={'Geoblocks functionality'}
            name={'geoblocks_functionality'}
            value={contractObjApi.geoblocks_acces}
          />
          {contractObjApi.geoblocks_acces ? (
            <InfoLabel
              title={'Geoblocks calculation units'}
              name={'geoblocks_calculation_units'}
              value={contractObjApi.geoblocks_calculation_units_capacity}
            />
          ) : null}
        </div> */}
        <span className={formStyles.FormFieldTitle}>3. Links</span>
        {contractObjApi.links.map((link: string) => (
          // show list of links
          <a
            className={formStyles.Label}
            key={link}
            href={link}
            tabIndex={-1}
            target="_blank"
            rel="noreferrer"
          >
            {link}
          </a>
        ))}
        <div className={formStyles.ButtonContainer}>
          <CancelButton url={"/management"} buttonText={"CLOSE"} />
        </div>
      </form>
    </ExplainSideColumn>
  );
};
