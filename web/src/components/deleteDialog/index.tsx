import * as Dialog from "@radix-ui/react-dialog";

import {
  ButtonsOfDialogContainer,
  CancelButton,
  ConfirmButton,
  Content,
  DeleteButton,
  DialogDeleteCommentContainer,
  DialogTitle,
  DialogTrigger,
  Overlay,
} from "./styles";

import { useState } from "react";

interface DeleteDialogProps {
  title: string;
  deleteButtonText: string;
  handleDeleteAction: () => void;
}

export default function DeleteDialog({
  title,
  deleteButtonText,
  handleDeleteAction,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)} asChild>
        <DeleteButton>{deleteButtonText}</DeleteButton>
      </DialogTrigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <DialogTitle>{title}</DialogTitle>
          <DialogDeleteCommentContainer>
            <ButtonsOfDialogContainer>
              <ConfirmButton
                onClick={() => {
                  handleDeleteAction(), setOpen(false);
                }}
              >
                Confirmar
              </ConfirmButton>
              <CancelButton>Cancelar</CancelButton>
            </ButtonsOfDialogContainer>
          </DialogDeleteCommentContainer>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
