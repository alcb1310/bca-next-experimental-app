import { ButtonProps } from "@/types/ButtonTypes"

export default function AddButton(props: ButtonProps) {
  const { buttonType, text, onEvent } = props

  return (
    <button
      className="px-8 py-2 mr-2 rounded-lg bg-indigo-700 text-gray-200 hover:bg-gray-200 hover:text-indigo-700 shadow-lg"
      // eslint-disable-next-line react/button-has-type
      type={buttonType}
      onClick={onEvent}
    >
      {text}
    </button>
  )
}
