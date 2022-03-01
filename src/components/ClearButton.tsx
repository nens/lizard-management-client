import styles from "./ClearButton.module.css";

interface Props {
  onClick: () => void;
  className?: string;
  styles?: React.CSSProperties;
}

export default function ClearButton(props: Props) {
  return (
    <div
      className={props.className}
      onClick={props.onClick}
      onMouseDown={(e) => e.preventDefault()} // to prevent focus on this element
      style={Object.assign(
        {},
        {
          display: "flex",
          alignItems: "center",
        },
        props.styles
      )}
    >
      <i className={`${styles.ClearInput} material-icons`}>clear</i>
    </div>
  );
}
