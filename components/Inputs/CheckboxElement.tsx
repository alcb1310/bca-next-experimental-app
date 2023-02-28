import { ErrorInterface } from "@/types"

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CheckboxElement({
  name,
  label,
  required,
  checked,
  onChange,
  error,
}: {
  name: string
  label: string
  required: boolean
  checked: boolean
  onChange: any
  error: ErrorInterface | null
}) {
  return (
    <div className="my-4 flex items-center">
      <input
        type="checkbox"
        className="rounder mr-2 h-4 w-4 border-gray-300 bg-gray-100 text-indigo-600 focus:ring-2 focus:ring-indigo-600"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={name}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {error !== null && error.errorKey === name && (
        <p className="text-sm text-red-600">{error.errorDescription}</p>
      )}
    </div>
  )
}
