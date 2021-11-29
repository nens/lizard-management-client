import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Elements, isNode } from 'react-flow-renderer';
import { GeoBlockSource } from '../../../types/geoBlockType';
import { GeoBlockJsonComponent } from './GeoBlockJsonComponent';
import GeoBlockVisualComponent from './GeoBlockVisualComponent';
import { SubmitButton } from '../../../form/SubmitButton';
import { Values } from '../../../form/useForm';
import { addNotification } from '../../../actions';
import { createGraphLayout } from '../../../utils/createGraphLayout';
import { dryFetchGeoBlockForValidation } from '../../../utils/geoblockValidators';
import {
  convertElementsToGeoBlockSource,
  convertGeoblockSourceToFlowElements
} from '../../../utils/geoblockUtils';
import ModalBackground from '../../../components/ModalBackground';
import styles from './GeoBlockBuildModal.module.css';
import formStyles from './../../../styles/Forms.module.css';
import buttonStyles from './../../../styles/Buttons.module.css';

interface MyProps {
  uuid: string | null,
  formValues: Values
  source: GeoBlockSource | null,
  operations: number | null,
  onChange: (value: GeoBlockSource | null) => void,
  handleClose: () => void
}

function GeoBlockBuildModal (props: MyProps & DispatchProps) {
  const [noOfOperations, setNoOfOperations] = useState<number | null>(props.operations);
  const [source, setSource] = useState<GeoBlockSource | null>(props.source);
  const [geoBlockView, setGeoBlockView] = useState<'json' | 'visual'>('json');

  // Block elements of a geoblock for React-Flow are kept in here
  // to make use of the SAVE, SWITCH and VALIDATE buttons
  const [elements, setElements] = useState<Elements>([]);

  // useEffect to create geoblock elements and build the graph layout using dagre library
  // useEffect only gets called when the visual component is open
  // use the useEffect here instead of the GeoBlockVisualComponent to avoid Maximum Depth Exceeded error
  useEffect(() => {
    if (geoBlockView === 'visual') {
      const geoblockElements = convertGeoblockSourceToFlowElements(source, setElements);
      const layoutedElements = createGraphLayout(source, geoblockElements);
      setElements(layoutedElements);
    };
    // setElements back to [] when component unmounted
    return () => setElements([]);
  }, [source, setElements, geoBlockView]);

  // useEffect to keep noOfOperations in sync with geoblock elements
  useEffect(() => {
    if (geoBlockView === 'visual') {
      // calculate the number of operations as the number of nodes in the elements array
      setNoOfOperations(elements.filter(el => isNode(el)).length);
    };
  }, [elements, geoBlockView]);

  return (
    <ModalBackground
      title={'GeoBlock Builder'}
      handleClose={props.handleClose}
      escKeyNotAllowed
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 0
      }}
    >
      <div className={styles.MainContainer}>
        <div className={styles.TabContainer}>
            <div
                className={geoBlockView === 'json' ? styles.SelectedTab : undefined}
                onClick={() => {
                  const geoBlockSource = convertElementsToGeoBlockSource(elements, source, setSource);
                  if (geoBlockSource || geoBlockSource === null) setGeoBlockView('json');
                }}
            >
                Text Editor
            </div>
            <div
                className={geoBlockView === 'visual' ? styles.SelectedTab : undefined}
                onClick={() => setGeoBlockView('visual')}
            >
                Visual Editor
            </div>
        </div>
        {geoBlockView === 'json' ? (
          <GeoBlockJsonComponent
            source={source}
            setSource={setSource}
          />
        ) : (
          <GeoBlockVisualComponent
            elements={elements}
            setElements={setElements}
          />
        )}
        <div className={formStyles.ButtonContainer}>
          <button
            className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
            onClick={props.handleClose}
          >
            Close
          </button>
          {geoBlockView === 'visual' ? <b>Operations: {noOfOperations || 0}</b> : null}
          <div>
            <button
              className={buttonStyles.NewButton}
              onClick={() => {
                if (geoBlockView === 'visual') {
                  const geoBlockSource = convertElementsToGeoBlockSource(elements, source, setSource);
                  if (geoBlockSource || geoBlockSource === null) dryFetchGeoBlockForValidation(props.uuid, geoBlockSource, props.formValues);
                } else {
                  dryFetchGeoBlockForValidation(props.uuid, source, props.formValues);
                };
              }}
              style={{
                marginRight: 20
              }}
            >
              Validate
            </button>
            <SubmitButton
              onClick={() => {
                if (geoBlockView === 'visual') {
                  const geoBlockSource = convertElementsToGeoBlockSource(elements, source, setSource);
                  if (geoBlockSource || geoBlockSource === null) {
                    props.onChange(geoBlockSource);
                    props.handleClose();
                  };
                } else {
                  props.onChange(source);
                  props.handleClose();
                };
              }}
            />
          </div>
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