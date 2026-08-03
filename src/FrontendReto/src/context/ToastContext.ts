import { createContext } from 'react';
import type { ToastTone } from '@/components/common';

export interface ShowToastInput {
  tone?: ToastTone;
  message: string;
}

export interface ToastContextValue {
  showToast: (input: ShowToastInput) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
