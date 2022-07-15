import { COLOR } from '../constants';

export interface AlertDialogOptions {
  title: string;
  titleColor: string;
  message: string;
  confirmButtonText: string;
  showContactSupport: boolean;
}

export interface DialogOptions extends AlertDialogOptions {
  cancelButtonText: string;
}

export function newAlertDialogOptions(
  title: string,
  message: string,
  confirmButtonText = 'OK',
  titleColor = COLOR.geneicd_blue,
  showContactSupport = false
): AlertDialogOptions {
  return {
    title: title,
    message: message,
    confirmButtonText: confirmButtonText,
    titleColor: titleColor,
    showContactSupport: showContactSupport,
  };
}
