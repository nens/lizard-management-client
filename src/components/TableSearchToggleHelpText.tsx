import { Value } from '../form/SelectDropdown';

interface Props {
  filterOption: Value | null
}

export function TableSearchToggleHelpText (props: Props) {
  if (props.filterOption && props.filterOption.label.includes('*')) {
    return (
      <div
        style={{
          fontSize: 14,
          fontStyle: 'italic',
          marginTop: 5,
          position: 'absolute',
          top: '100%',
          left: 0,
        }}
      >
        <span>(*) Only support filtering by first letters and is case sensitive</span>
      </div>
    );
  } else {
    return null;
  };
};