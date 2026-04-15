import { useCallback } from 'react';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

/**
 * Simple toast hook for user feedback
 * Currently uses console and can be extended with a toast UI library
 */
export const useToast = () => {
  const toast = useCallback((props: ToastProps) => {
    const { title, description, variant = 'default' } = props;
    const message = `${title || ''}${title && description ? ': ' : ''}${description || ''}`.trim();
    
    if (variant === 'destructive') {
      console.error(message);
    } else {
      console.log(message);
    }

    // TODO: Replace with shadcn/ui toast component when available
    // This is a placeholder implementation
  }, []);

  return { toast };
};
