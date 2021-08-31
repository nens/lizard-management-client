import React from "react";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string,
  name: string,
  links: string[], // a list of links
  onFocus?: (e: any) => void,
  onBlur?: () => void,
};

export const LinksArea: React.FC<MyProps> = (props) => {  
  const {
    title,
    name,
    links,
    onFocus,
    onBlur,
  } = props;

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <ul
        id={name}
        className={formStyles.FormControl}
        onFocus={onFocus}
        onBlur={onBlur}
        tabIndex={0}
      >
        {links.map(link => (
          <li
            key={link}
            style={{
              marginBottom: 10
            }}
          >
            <a
              href={link}
              tabIndex={-1}
              target="_blank"
              rel="noreferrer"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </label>
  );
}