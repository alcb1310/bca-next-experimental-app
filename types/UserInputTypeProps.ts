import { ErrorInterface } from "./ErrorInterface"

export type UserInputType = "text" | "password" | "email" | "number" | "date"
export type UserInputTypeProps = {
  label: string
  error: ErrorInterface | null
  inputName: string
  required: boolean
  inputType: UserInputType
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  enabled: boolean
}
