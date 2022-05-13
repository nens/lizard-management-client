import { Value } from "../form/SelectDropdown";
import { UUID_REGEX } from "./Breadcrumbs";

interface Props {
  filterOption: Value | null;
  searchInput?: string;
}

function HelpText (props: { text: string }) {
  return (
    <div
      style={{
        fontSize: 14,
        fontStyle: "italic",
        marginTop: 5,
        position: "absolute",
        top: "100%",
        left: 0,
      }}
    >
      <span>{props.text}</span>
    </div>
  )
}

export function TableSearchToggleHelpText(props: Props) {
  const { filterOption, searchInput } = props;
  if (filterOption && filterOption.label.includes("*")) {
    return <HelpText text="(*) Only support filtering by first letters and is case sensitive" />
  } else if (
    filterOption && filterOption.value === "uuid=" &&
    searchInput && !UUID_REGEX.test(searchInput)
  ) {
    return <HelpText text="Incorrect UUID format" />
  } else {
    return null;
  }
}
