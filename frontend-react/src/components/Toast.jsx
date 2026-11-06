import { useState, useEffect } from 'react';

let toastSubscriber = null;

export const showToast = (message, type = 'info') => {
    if (toastSubscriber) {
        toastSubscriber({ message, type, id: Date.now() });
    }
};

export const toast = {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    info: (msg) => showToast(msg, 'info'),
    warning: (msg) => showToast(msg, 'warning')
};

export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        toastSubscriber = (toast) => {
            setToasts((prev) => [...prev, toast]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, 4000);
        };
        return () => {
            toastSubscriber = null;
        };
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            pointerEvents: 'none'
        }}>
            {toasts.map((t) => {
                let borderCol = 'var(--border-color, #F0E5DC)';
                let textCol = 'var(--primary-orange, #F07824)';
                let bgCol = '#FFFFFF';
                if (t.type === 'success') {
                    borderCol = '#A7F3D0';
                    textCol = '#059669';
                    bgCol = '#F0FDF4';
                } else if (t.type === 'error') {
                    borderCol = '#FECACA';
                    textCol = '#DC2626';
                    bgCol = '#FEF2F2';
                }

                return (
                    <div
                        key={t.id}
                        style={{
                            background: bgCol,
                            border: `1.5px solid ${borderCol}`,
                            color: textCol,
                            padding: '0.75rem 1.4rem',
                            borderRadius: '9999px',
                            boxShadow: '0 10px 30px rgba(36, 36, 36, 0.1)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            pointerEvents: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            maxWidth: '420px',
                            animation: 'fadeSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    >
                        <span>{t.message}</span>
                    </div>
                );
            })}
        </div>
    );
};
