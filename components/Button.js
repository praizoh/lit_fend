import { css } from "@emotion/css";
import { PINK } from "../theme";

export function Button({ buttonText, onClick }) {
  return (
    <button className={buttonStyle} onClick={onClick}>
      {buttonText}
    </button>
  );
}

const buttonStyle = css`
  border: none;
  outline: none;
  margin-left: 30px;
  color: #fff;
  padding: 18px 15px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-color: rgb(${PINK});
  transition: all 0.35s;
  width: 240px;
  letter-spacing: 0.75px;
  &:hover {
    background-color: rgba(${PINK}, 0.75);
  }
`;
