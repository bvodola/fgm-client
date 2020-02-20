import React from "react";
import ReactSwitch from "react-switch";

const Switch = ({ id, className, label, onChange, checked, ...props }) => (
  <label htmlFor={id}>
    <ReactSwitch
      checked={checked}
      onChange={onChange}
      onColor="#86d3ff"
      onHandleColor="#2693e6"
      handleDiameter={30}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
      height={20}
      width={48}
      className={className}
      id={id}
      {...props}
    />
    <span>{label}</span>
  </label>
);

Switch.defaultProps = {
  className: "react-switch",
  label: "",
  onChange: () => {},
  checked: false
};

export default Switch;
