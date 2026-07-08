import { useId } from "react";

export default function InputField({
  type = "text",
  label,
  name,
  placeholder,
  error,
  register,
}) {
  const id = useId();
  return (
    <>
      {label && <label htmlFor={id}> {label}</label>}
      <input
        id={id}
        type={type}
        aria-invalid={`${Boolean(error)}`}
        aria-describedby="invalid-helper"
        placeholder={placeholder ?? name}
        {...register(name)}
      />
      {error && <small id="invalid-helper">{error?.message}</small>}
    </>
  );
}