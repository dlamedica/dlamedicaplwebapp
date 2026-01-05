import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Komponent który rzuca błąd
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('renderuje dzieci gdy nie ma błędu', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('wyświetla UI błędu gdy komponent rzuca błąd', () => {
    // Suppress console.error dla tego testu
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Ups! Coś poszło nie tak/i)).toBeInTheDocument();
    expect(screen.getByText(/Wystąpił nieoczekiwany błąd/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('wywołuje callback onError gdy błąd wystąpi', () => {
    const onError = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );

    consoleSpy.mockRestore();
  });
});

