import { createContext, useContext, useState, ReactNode } from "react";
import './ToastContext.css'

export type ToastType = "success" | "error" | "loading" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  addToast: (message: string, type: ToastType) => number; // retorna el id
  removeToast: (id: number) => void; // nueva función
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // nueva función para remover toast
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [{ id, message, type }, ...prev]);

    // remover automáticamente después de 3s
    setTimeout(() => removeToast(id), 3000);

    return id; // retorna el id para poder usar removeToast después
  };

  const getIcon = (type: ToastType) => {
    switch(type) {
      case 'success': return <span className="material-icons">check_circle</span>;
      case 'error': return <span className="material-icons">error</span>;
      case 'loading': return <span className="material-icons spin">autorenew</span>;
      case 'info': return <span className="material-icons">info</span>;
      default: return null;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div className="toast-icon">{getIcon(toast.type)}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }
  return context;
};
