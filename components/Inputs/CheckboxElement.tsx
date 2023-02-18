/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CheckboxElement({
  name,
  label,
  required,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  required: boolean;
  checked: boolean;
  onChange: any;
}) {
  return (
    <div className="flex items-center my-4">
      <input
        type="checkbox"
        className="w-4 h-4 text-indigo-600 bg-gray-100 rounder border-gray-300 focus:ring-indigo-600 focus:ring-2 mr-2"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={name}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>
    </div>
  );
}
