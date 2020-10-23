import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import CheckBox from '../../forms/CheckBox';
import DurationField from '../../forms/DurationField';
import TextArea from '../../forms/TextArea';
import TextInput from '../../forms/TextInput';
import { getSelectedOrganisation } from '../../reducers';
import styles from './RasterSourceForm.module.css';

export interface Props {};
  
const RasterSourceForm: React.FC<Props> = ({}) => {
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  const [rasterName, setRasterName] = useState<string>('');
  const [rasterDescription, setRasterDescription] = useState<string>('');
  const [supplierCode, setSupplierCode] = useState<string>('');
  const [temporal, setTemporal] = useState<boolean>(false);
  const [interval, setInterval] = useState<string>('');
  const [accessModifier, setAccessModifier] = useState<'Private' | 'Common' | 'Public'>('Private');

  return (
    <div>
      <div>
        <div>RASTERS</div>
        <div>EXPLAIN BOX</div>
      </div>
      <form
        className={styles.Form}
      >
        <h3>1: GENERAL</h3>
        <label htmlFor="textinput-rasterName">
          <span>Name*</span>
          <TextInput
            name="rasterName"
            value={rasterName}
            valueChanged={setRasterName}
            handleEnter={() => null}
            validated={true}
            wizardStyle={false}
          />
        </label>
        <label htmlFor="textinput-rasterDescription">
          <span>Description</span>
          <TextArea
            name="rasterDescription"
            value={rasterDescription}
            valueChanged={setRasterDescription}
            handleEnter={() => null}
            validated={true}
            wizardStyle={false}
          />
        </label>
        <label htmlFor="textinput-supplierCode">
          <span>FTP / Supplier code</span>
          <TextInput
            name="supplierCode"
            value={supplierCode}
            valueChanged={setSupplierCode}
            handleEnter={() => null}
            validated={true}
            wizardStyle={false}
          />
        </label>
        <h3>2: DATA</h3>
        <label htmlFor="temporal">
          <span>Temporal</span>
          <CheckBox
            name="temporal"
            value={temporal}
            valueChanged={setTemporal}
            handleEnter={() => null}
            validated={true}
            readonly={false}
            wizardStyle={false}
          />
        </label>
        <label htmlFor="rasterInterval">
          <span>Interval</span>
          <DurationField          
            name="rasterInterval"
            value={interval}
            valueChanged={setInterval}
            handleEnter={() => null}
            validated={true}
            readOnly={false}
            wizardStyle={false}
          />
        </label>
        <h3>3: RIGHTS</h3>
        <span>Access modifier</span>
        <div
          className={styles.AccessModifierTiles}
        >
          <div
            className={accessModifier === 'Private' ? `${styles.AccessModifier} ${styles.AccessModifierSelected}` : styles.AccessModifier}
            onClick={() => setAccessModifier('Private')}
          >
            <span>Private</span>
            <span>(own organisation)</span>
          </div>
          <div
            className={accessModifier === 'Common' ? `${styles.AccessModifier} ${styles.AccessModifierSelected}` : styles.AccessModifier}
            onClick={() => setAccessModifier('Common')}
          >
            <span>Common</span>
            <span>(logged in only)</span>
          </div>
          <div
            className={accessModifier === 'Public' ? `${styles.AccessModifier} ${styles.AccessModifierSelected}` : styles.AccessModifier}
            onClick={() => setAccessModifier('Public')}
          >
            <span>Public</span>
            <span>(open to everyone)</span>
          </div>
        </div>
        <label htmlFor="textinput-organisation">
          <span>Organisation</span>
          <TextInput
            name="organisation"
            value={selectedOrganisation.name}
            valueChanged={() => null}
            handleEnter={() => null}
            validated={true}
            readOnly={true}
            wizardStyle={false}
          />
        </label>
        <label htmlFor="textinput-supplierUsername">
          <span>Username of supplier</span>
          <TextInput
            name="supplierUsername"
            value={''}
            valueChanged={() => null}
            handleEnter={() => null}
            validated={true}
            readOnly={true}
            wizardStyle={false}
          />
        </label>
      </form>
      <div>
        <button>CANCEL</button>
        <button>SAVE</button>
      </div>
    </div>
  );
};

export default RasterSourceForm;