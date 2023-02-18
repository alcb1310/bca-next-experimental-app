/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorType } from "../../types";

type SelectElementType = {
  label: string;
  error: ErrorType | null;
  inputName: string;
  required: boolean;
  value: any;
  onChange: any;
  children: any;
};

function SelectElement(props: SelectElementType) {
  const { label, error, inputName, required, value, onChange, children } =
    props;
  return (
    <>
      <label className="block mt-4 mb-2 text-indigo-700" htmlFor={inputName}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <select
        name={inputName}
        id={inputName}
        onChange={onChange}
        value={value}
        className={`block rounded-md w-full text-indigo-700 focus:border-indigo-700 focus:ring-indigo-700 ${
          error !== null &&
          error.errorKey === inputName &&
          "border-red-600 border-2 focus:ring-red-600 focus:border-red-600"
        }`}
      >
        <option value="">--- Select one ---</option>
        {children}
      </select>
      {error !== null && error.errorKey === inputName && (
        <p className="text-red-600 text-sm">{error.errorDescription}</p>
      )}
    </>
  );
}

export default SelectElement;
