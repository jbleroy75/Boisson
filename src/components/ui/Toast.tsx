'use client';

import { Toaster, toast } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1A1A1A',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px',
          fontFamily: 'var(--font-inter)',
        },
        success: {
          iconTheme: {
            primary: '#00D9A5',
            secondary: '#fff',
          },
          style: {
            borderLeft: '4px solid #00D9A5',
          },
        },
        error: {
          iconTheme: {
            primary: '#FF6B35',
            secondary: '#fff',
          },
          style: {
            borderLeft: '4px solid #FF6B35',
          },
        },
      }}
    />
  );
}

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (id?: string) => toast.dismiss(id),
  cart: (productName: string) =>
    toast.success(`${productName} ajouté au panier`, {
      icon: '🛒',
    }),
  subscription: () =>
    toast.success('Abonnement créé avec succès !', {
      icon: '✨',
      duration: 5000,
    }),
  loyalty: (points: number) =>
    toast.success(`+${points} points fidélité gagnés !`, {
      icon: '🎁',
    }),
};

export { toast };
