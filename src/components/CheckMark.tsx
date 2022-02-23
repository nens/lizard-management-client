import formStyles from "../styles/Forms.module.css";

export default function CheckMark () {
  return (
    <span className={formStyles.Checkmark}>
      {/* &#10004; */}
      {"✔"}
    </span>
  );
}