export interface SnapOptions {
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}

export interface Snap {
  pay: (token: string, options?: SnapOptions) => void;
}

declare global {
  interface Window {
    snap: Snap;
  }
}
