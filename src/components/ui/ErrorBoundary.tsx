'use client';

import { Component, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Oups, quelque chose s&apos;est mal passé
            </h2>
            <p className="text-gray-600 mb-6">
              Une erreur inattendue s&apos;est produite. Veuillez réessayer.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="btn-primary"
              >
                Réessayer
              </button>
              <Link href="/" className="btn-secondary">
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorFallback({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🔧</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Erreur technique
        </h1>
        <p className="text-gray-600 mb-8">
          Nous rencontrons un problème technique. Notre équipe a été notifiée.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="btn-primary">
            Réessayer
          </button>
          <Link href="/" className="btn-secondary">
            Accueil
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <pre className="mt-8 p-4 bg-red-50 text-red-800 text-left text-sm rounded-lg overflow-auto">
            {error.message}
          </pre>
        )}
      </div>
    </div>
  );
}
