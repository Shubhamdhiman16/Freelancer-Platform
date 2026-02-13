import React from "react";

const Input = React.forwardRef(function Input(props, ref) {
  const { className, type, ...rest } = props;

  return (
    <input
      type={type}
      className={className}
      ref={ref}
      {...rest}
    />
  );
});

Input.displayName = "Input";

export { Input };
