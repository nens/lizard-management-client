import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import CheckBox from '../../forms/CheckBox';
import TextArea from '../../forms/TextArea';
import TextInput from '../../forms/TextInput';
import styles from './RasterSourceForm.module.css';

export interface Props {
  // accessModifier: 'Private' | 'Common' | 'Public';
};

const RasterLayerForm: React.FC<Props> = (props) => {
  const {
    // accessModifier
  } = props;
  const [rasterLayerName, setRasterLayerName] = useState<string>('');
  const [rasterLayerDescription, setRasterLayerDescription] = useState<string>('');
  const [dataset, setDataset] = useState<string>('');
  const [rasterSource, setRasterSource] = useState<string>('');
  const [aggregationType, setAggregationType] = useState<string>('');
  const [observationType, setObservationType] = useState<string>('');
  const [colorMap, setColorMap] = useState<string>('');

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
        <label htmlFor="textinput-rasterLayerName">
          <span>Name*</span>
          <TextInput
            name="rasterLayerName"
            value={rasterLayerName}
            valueChanged={setRasterLayerName}
            handleEnter={() => null}
            validated={true}
            wizardStyle={false}
          />
        </label>
        <label htmlFor="textinput-rasterDescription">
          <span>Description</span>
          <TextArea
            name="rasterDescription"
            value={rasterLayerDescription}
            valueChanged={setRasterLayerDescription}
            handleEnter={() => null}
            validated={true}
            wizardStyle={false}
          />
        </label>
        <label htmlFor="textinput-dataset">
          <span>Dataset</span>
          <TextInput
            name="dataset"
            value={dataset}
            valueChanged={setDataset}
            handleEnter={() => null}
            validated={true}
            wizardStyle={false}
          />
        </label>
        <h3>2: DATA</h3>
        <label htmlFor="textinput-rasterSource">
          <span>Source*</span>
          <TextInput
            name="rasterSource"
            value={rasterSource}
            valueChanged={setRasterSource}
            handleEnter={() => null}
            validated={true}
            readOnly={true}
            wizardStyle={false}
          />
        </label>
        <label htmlFor="textinput-aggregationType">
          <span>Aggregation type*</span>
          <TextInput
            name="aggregationType"
            value={aggregationType}
            valueChanged={setAggregationType}
            handleEnter={() => null}
            validated={true}
            wizardStyle={false}
          />
        </label>
        <label htmlFor="textinput-observationType">
          <span>Observation type*</span>
          <TextInput
            name="observationType"
            value={observationType}
            valueChanged={setObservationType}
            handleEnter={() => null}
            validated={true}
            wizardStyle={false}
          />
        </label>
        <label htmlFor="textinput-colorMap">
          <span>Color map*</span>
          <TextInput
            name="colorMap"
            value={colorMap}
            valueChanged={setColorMap}
            handleEnter={() => null}
            validated={true}
            wizardStyle={false}
          />
        </label>
        <h3>3: RIGHTS</h3>
        <span>Access modifier</span>
        <div
          className={styles.AccessModifierTiles}
        >
          <div
            // className={accessModifier === 'Private' ? `${styles.AccessModifier} ${styles.AccessModifierSelected}` : styles.AccessModifier}
          >
            <span>Private</span>
            <span>(own organisation)</span>
          </div>
          <div
            // className={accessModifier === 'Common' ? `${styles.AccessModifier} ${styles.AccessModifierSelected}` : styles.AccessModifier}
          >
            <span>Common</span>
            <span>(logged in only)</span>
          </div>
          <div
            // className={accessModifier === 'Public' ? `${styles.AccessModifier} ${styles.AccessModifierSelected}` : styles.AccessModifier}
          >
            <span>Public</span>
            <span>(open to everyone)</span>
          </div>
        </div>
        <label htmlFor="textinput-organisation">
          <span>Organisation</span>
          <TextInput
            name="organisation"
            value={''}
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

export default RasterLayerForm;