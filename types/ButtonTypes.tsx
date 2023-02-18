type ButtonHTMLType = "button" | "reset" | "submit" | undefined;
export type ButtonProps = {
  buttonType: ButtonHTMLType;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvent: () => void;
};

export type ModalButtonProps = {
  buttonType: ButtonHTMLType;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvent: () => void;
  modal: string;
};
