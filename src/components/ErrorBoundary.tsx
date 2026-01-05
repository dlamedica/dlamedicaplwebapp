import React, { Component, ErrorInfo, ReactNode } from 'react';
import { log } from '../utils/logger';
import { tracking } from '../utils/errorTracking';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * React Error Boundary - przechwytuje błędy w komponentach React
 * i wyświetla przyjazny komunikat użytkownikowi zamiast białego ekranu
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Aktualizuj state, aby następny render pokazał UI błędu
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Loguj błąd używając centralnego loggera
    log.error('ErrorBoundary przechwycił błąd', error, {
      componentStack: errorInfo.componentStack,
    });
    
    // Track error w error tracking service
    tracking.captureException(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
    
    // Aktualizuj state z informacjami o błędzie
    this.setState({
      error,
      errorInfo,
    });

    // Wywołaj callback jeśli został podany
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    // Resetuj stan błędu
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    // Przeładuj stronę
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Jeśli podano custom fallback, użyj go
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Domyślny UI błędu
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center">
              {/* Ikona błędu */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Tytuł */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Ups! Coś poszło nie tak
              </h1>

              {/* Opis */}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Wystąpił nieoczekiwany błąd w aplikacji. Przepraszamy za utrudnienia.
              </p>

              {/* Szczegóły błędu (tylko w trybie development) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 text-left">
                  <details className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white mb-2">
                      Szczegóły błędu (tylko w trybie development)
                    </summary>
                    <div className="mt-2">
                      <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
                        {this.state.error.toString()}
                      </p>
                      {this.state.errorInfo && (
                        <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-64">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Przyciski akcji */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Spróbuj ponownie
                </button>
                <button
                  onClick={this.handleReload}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Przeładuj stronę
                </button>
                <button
                  onClick={() => {
                    window.history.pushState({}, '', '/');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    this.handleReset();
                  }}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Strona główna
                </button>
              </div>

              {/* Link do wsparcia */}
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                Jeśli problem się powtarza,{' '}
                <a
                  href="/kontakt"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  skontaktuj się z nami
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Jeśli nie ma błędu, renderuj dzieci normalnie
    return this.props.children;
  }
}

export default ErrorBoundary;

