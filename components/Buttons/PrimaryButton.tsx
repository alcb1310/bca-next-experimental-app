import { ButtonProps } from "@/types/ButtonTypes"

export default function PrimaryButton(props: ButtonProps) {
  const { buttonType, text, onEvent } = props

  return (
    <button
      className="mt-3 mr-2 rounded-lg bg-dark px-8 py-2 text-light shadow-lg hover:bg-light hover:text-dark"
      // eslint-disable-next-line react/button-has-type
      type={buttonType}
      onClick={onEvent}
    >
      {text}
    </button>
  )
}
