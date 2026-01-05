import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // W rzeczywistej aplikacji można wysłać błąd do serwisu monitorującego (np. Sentry)
    // errorReportingService.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleGoHome = () => {
    this.handleReset();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <FaExclamationTriangle className="text-red-500 text-5xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ups! Coś poszło nie tak
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub wróć do strony głównej.
            </p>
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Szczegóły błędu (tylko w trybie deweloperskim)
                </summary>
                <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-[#38b6ff] text-black rounded-lg font-medium hover:bg-[#2a9fe5] transition-colors duration-200"
              >
                Spróbuj ponownie
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
              >
                <FaHome />
                Strona główna
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

