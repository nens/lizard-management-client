import React from 'react';
import { Elements, Handle, Node, Position, useStoreState } from 'react-flow-renderer';
import { geoblockType } from '../../../../types/geoBlockType';
import styles from './Block.module.css';

interface BlockInput {
  label: string,
  classOfBlock: string,
  parameters: (string | number | boolean | [])[],
  onChange: (value: string | number | boolean, i: number) => void
}

interface BlockProps {
  block: Node<BlockInput>,
  onElementsRemove: (elementsToRemove: Elements) => void,
}

export const Block = (props: BlockProps) => {
  const { block, onElementsRemove } = props;
  const { label, classOfBlock, parameters, onChange } = block.data!;

  const edges = useStoreState(state => state.edges);

  const blockDefinition = Object.values(geoblockType).find(
    geoblock => geoblock && geoblock.class && geoblock.class === classOfBlock
  );

  if (!blockDefinition) {
    console.error('No type definition for this block: ' + classOfBlock);
    return null;
  };

  const blockDefinitionParameters = blockDefinition.parameters;
  const blockDefinitionParametersAsArray = Array.isArray(blockDefinitionParameters) ? blockDefinitionParameters : [];

  return (
    <div
      className={styles.Block}
      tabIndex={1}
    >
      {blockDefinitionParametersAsArray.map((parameter, i) => (
        parameter.type.includes('raster_block') ? (
          <Handle
            key={i}
            type="target"
            id={i + ''}
            title={`${parameter.name}: ${parameter.type}`}
            position={Position.Left}
            style={{
              top: i === 0 ? 100 : (100 + i * 35)
            }}
          />
        ) : null
      ))}
      <div>
        <div
          className={styles.BlockHeader}
        >
          <h4>{label}</h4>
          <small><i>({classOfBlock})</i></small>
        </div>
        {blockDefinitionParametersAsArray.map((parameter, i) => {
          if (parameter.type === 'raster_block' || parameter.type === 'string') {
            const parameterValue = parameters ? parameters[i] as string : undefined;
            return (
              <input
                type={'text'}
                key={parameter.name}
                className={styles.BlockInput}
                title={`${parameter.name}: ${parameter.type}`}
                placeholder={parameter.name}
                value={parameterValue}
                onChange={e => onChange(e.target.value, i)}
                disabled={parameter.type === 'raster_block'}
              />
            );
          } else if (
            parameter.type === 'number' ||
            parameter.type === 'float' ||
            parameter.type === 'integer'
          ) {
            const parameterValue = parameters ? parameters[i] as number : undefined;
            return (
              <input
                type={'number'}
                key={parameter.name}
                className={styles.BlockInput}
                title={`${parameter.name}: ${parameter.type}`}
                placeholder={parameter.name}
                value={parameterValue}
                onChange={e => onChange(
                  parameter.type === 'integer' ? parseInt(e.target.value) : parseFloat(e.target.value),
                  i
                )}
              />
            );
          } else if (parameter.type === 'boolean') {
            const checked = parameters ? parameters[i] as boolean : undefined;
            return (
              <input
                type={'checkbox'}
                key={parameter.name}
                className={styles.BlockCheckbox}
                title={`${parameter.name}: ${parameter.type}`}
                checked={checked}
                onChange={e => onChange(e.target.checked, i)}
              />
            );
          } else if (
            Array.isArray(parameter.type) &&
            parameter.type.includes('number') &&
            parameter.type.includes('raster_block')
          ) {
            const parameterValue = parameters ? parameters[i] as number | string : undefined;
            return (
              <input
                type={typeof(parameterValue) === 'number' || parameterValue === undefined ? 'number' : 'text'}
                key={parameter.name}
                className={styles.BlockInput}
                title={`${parameter.name}: ${parameter.type}`}
                placeholder={parameter.name}
                value={parameterValue}
                onChange={e => {
                  if (typeof(parameterValue) === 'string') { // raster block input
                    const connectedEdge = edges.find(edge => edge.target === block.id && edge.targetHandle === i.toString());
                    if (connectedEdge) onElementsRemove([connectedEdge]);
                  };
                  onChange(parseFloat(e.target.value), i);
                }}
              />
            );
          } else if (
            Array.isArray(parameter.type) &&
            parameter.type.includes('boolean') &&
            parameter.type.includes('raster_block')
          ) {
            const parameterValue = parameters ? parameters[i] as boolean | string : undefined;
            return (
              <div
                style={{
                  display: 'flex'
                }}
              >
                <input
                  type={'text'}
                  key={parameter.name + 'text'}
                  className={styles.BlockInput}
                  title={`${parameter.name}: ${parameter.type}`}
                  placeholder={parameter.name}
                  value={parameterValue + ''}
                  disabled
                  style={{
                    marginRight: 10
                  }}
                />
                <input
                  type={'checkbox'}
                  key={parameter.name + 'checkbox'}
                  className={styles.BlockCheckbox}
                  title={`${parameter.name}: ${parameter.type}`}
                  checked={typeof(parameterValue) === 'boolean' ? parameterValue : false}
                  onChange={e => {
                    if (typeof(parameterValue) === 'string') { // raster block input
                      const connectedEdge = edges.find(edge => edge.target === block.id && edge.targetHandle === i.toString());
                      if (connectedEdge) onElementsRemove([connectedEdge]);
                    };
                    onChange(e.target.checked, i);
                  }}
                />
              </div>
            )
          } else if (parameter.type === 'enum') {
            const parameterValue = parameters ? parameters[i] as any : undefined;
            const options = parameter.enum as string[];
            return (
              <select
                key={parameter.name}
                className={styles.BlockInput}
                title={`${parameter.name}: ${parameter.type}`}
                value={parameterValue}
                onChange={e => onChange(e.target.value, i)}
              >
                <option />
                {options.map(option => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            );
          } else if (parameter.type === 'array') {
            const parameterValue = parameters ? parameters[i] as any : undefined;
            const parameterValueInJsonString = JSON.stringify(parameterValue);
            return (
              <textarea
                key={parameter.name}
                className={styles.BlockInput}
                title={`${parameter.name}: ${parameter.type}`}
                value={parameterValueInJsonString}
                onChange={e => onChange(e.target.value, i)}
                disabled
              />
            )
          } else {
            const parameterValue = parameters ? parameters[i] as any : undefined;
            return (
              <input
                type={'text'}
                key={parameter.name}
                className={styles.BlockInput}
                title={`${parameter.name}: ${parameter.type}`}
                placeholder={parameter.name}
                value={parameterValue}
                disabled
              />
            );
          };
        })}
      </div>
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}