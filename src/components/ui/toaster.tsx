import * as React from "react";

import { useToast, configureToasts } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

type ToasterProps = React.ComponentProps<typeof ToastProvider> & {
  removeDelay?: number;
};

export function Toaster({ removeDelay = 5000, ...props }: ToasterProps) {
  const { toasts } = useToast();

  React.useEffect(() => {
    configureToasts({ removeDelay });
  }, [removeDelay]);

  return (
    <ToastProvider duration={removeDelay} {...props}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
