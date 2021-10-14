import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Elements } from 'react-flow-renderer';
import { GeoBlockJsonComponent } from './GeoBlockJsonComponent';
import { GeoBlockVisualComponent } from './GeoBlockVisualComponent';
import { SubmitButton } from '../../../form/SubmitButton';
import { addNotification } from '../../../actions';
import { jsonValidator } from '../../../form/validators';
import { createGraphLayout } from '../../../utils/createGraphLayout';
import {
  convertElementsToGeoBlockSource,
  convertGeoblockSourceToFlowElements
} from '../../../utils/geoblockUtils';
import ModalBackground from '../../../components/ModalBackground';
import styles from './GeoBlockBuildModal.module.css';
import formStyles from './../../../styles/Forms.module.css';
import buttonStyles from './../../../styles/Buttons.module.css';

interface MyProps {
  source: Object | null,
  onChange: (value: Object) => void,
  handleClose: () => void
}

function GeoBlockBuildModal (props: MyProps & DispatchProps) {
  const sourceString = JSON.stringify(props.source, undefined, 4);
  const [jsonString, setJsonString] = useState<string>(sourceString);
  const [geoBlockView, setGeoBlockView] = useState<'json' | 'visual'>('json');

  // Block elements of a geoblock for React-Flow are kept in here
  // to make use of the SAVE, SWITCH and VALIDATE buttons
  const [elements, setElements] = useState<Elements>([]);

  // useEffect to create geoblock elements and build the graph layout using dagre library
  // useEffect only gets called when the visual component is open
  // use the useEffect here instead of the GeoBlockVisualComponent to avoid Maximum Depth Exceeded error
  useEffect(() => {
    if (geoBlockView === 'visual') {
      const geoblockElements = convertGeoblockSourceToFlowElements(JSON.parse(jsonString), setElements);
      const layoutedElements = createGraphLayout(geoblockElements);
      setElements(layoutedElements);
    };
  }, [jsonString, setElements, geoBlockView]);

  return (
    <ModalBackground
      title={'Geo Block Builder'}
      handleClose={props.handleClose}
      width={'80%'}
      height={'80%'}
    >
      <div className={styles.MainContainer}>
        {geoBlockView === 'json' ? (
          <GeoBlockJsonComponent
            jsonString={jsonString}
            setJsonString={setJsonString}
          />
        ) : (
          <GeoBlockVisualComponent
            elements={elements}
            setElements={setElements}
          />
        )}
        <div className={`${formStyles.ButtonContainer} ${formStyles.FixedButtonContainer}`}>
          <button
            className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
            onClick={props.handleClose}
          >
            Close
          </button>
          <button
            onClick={() => {
              if (jsonValidator(jsonString)) {
                return alert(jsonValidator(jsonString));
              };
              if (geoBlockView === 'visual') {
                convertElementsToGeoBlockSource(elements, setJsonString);
                setGeoBlockView('json');
              } else {
                setGeoBlockView('visual');
              };
            }}
          >
            Switch
          </button>
          <SubmitButton
            onClick={() => {
              if (jsonValidator(jsonString)) {
                return alert(jsonValidator(jsonString));
              };
              if (geoBlockView === 'visual') {
                const geoBlockSource = convertElementsToGeoBlockSource(elements, setJsonString);
                if (geoBlockSource) {
                  props.onChange(geoBlockSource);
                } else {
                  return;
                };
              } else {
                props.onChange(JSON.parse(jsonString));
              };
              props.handleClose();
            }}
          />
        </div>
      </div>
    </ModalBackground>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(GeoBlockBuildModal);