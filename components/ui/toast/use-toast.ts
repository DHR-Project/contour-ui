import { useEffect, useState } from "react";
import type { IconName } from "@/components/icon";

export type ToastVariant = "default" | "success" | "warning" | "destructive";

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  icon?: IconName;
  variant?: ToastVariant;
  action?: { label: string; onPress: () => void };
  duration?: number;
}

export type ToastInput = Omit<ToastProps, "id"> & { id?: string };

// No cap here: the 3-item cap is a collapsed-stack *display* rule (see
// STACK_VISIBLE_LIMIT in toast.tsx), not a limit on how many toasts can be
// active at once -- expanding the stack must be able to show all of them.
let toasts: ToastProps[] = [];
const listeners = new Set<(toasts: ToastProps[]) => void>();

function emit() {
  listeners.forEach((listener) => listener([...toasts]));
}

export function toast(input: ToastInput) {
  const id = input.id ?? Math.random().toString(36).substring(2, 9);
  const newToast: ToastProps = { duration: 4000, ...input, id };
  
  toasts = [newToast, ...toasts];
  emit();
  
  return id;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function useToast() {
  const [state, setState] = useState(toasts);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return { toasts: state, toast, dismiss: dismissToast };
}
