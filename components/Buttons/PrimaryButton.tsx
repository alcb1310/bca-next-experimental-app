import { ButtonProps } from '@/types/ButtonTypes'

export default function PrimaryButton(props: ButtonProps) {
  const { buttonType, text, onEvent } = props

  return (
    <button
      className="mt-3 mr-2 rounded-lg bg-indigo-700 px-8 py-2 text-gray-200 shadow-lg hover:bg-gray-200 hover:text-indigo-700"
      // eslint-disable-next-line react/button-has-type
      type={buttonType}
      onClick={onEvent}
    >
      {text}
    </button>
  )
}
