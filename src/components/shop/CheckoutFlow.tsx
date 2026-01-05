import React, { useState } from 'react';
import { CheckIcon, CartIcon, InvoiceIcon, CheckCircleIcon } from '../icons/CustomIcons';

interface CheckoutStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CheckoutFlowProps {
  currentStep: number;
  darkMode: boolean;
  steps?: CheckoutStep[];
}

/**
 * Komponent wizualizacji procesu checkout z unikalnym designem
 * Wszystkie ikony stworzone od podstaw
 */
const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  currentStep,
  darkMode,
  steps,
}) => {
  const defaultSteps: CheckoutStep[] = [
    {
      id: 'cart',
      title: 'Koszyk',
      description: 'Przegląd produktów',
      icon: <CartIcon size={24} />,
    },
    {
      id: 'details',
      title: 'Dane',
      description: 'Informacje kontaktowe',
      icon: <InvoiceIcon size={24} />,
    },
    {
      id: 'payment',
      title: 'Płatność',
      description: 'Metoda płatności',
      icon: <CheckCircleIcon size={24} />,
    },
    {
      id: 'confirmation',
      title: 'Potwierdzenie',
      description: 'Zamówienie złożone',
      icon: <CheckCircleIcon size={24} />,
    },
  ];

  const checkoutSteps = steps || defaultSteps;

  return (
    <div className={`w-full py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* Linia łącząca kroki */}
          <div className={`absolute top-6 left-0 right-0 h-1 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div
              className={`h-full bg-gradient-to-r from-[#38b6ff] to-blue-500 transition-all duration-500 ease-in-out`}
              style={{ width: `${(currentStep / (checkoutSteps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Kroki */}
          <div className="relative flex justify-between">
            {checkoutSteps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isUpcoming = index > currentStep;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative z-10"
                  style={{ flex: 1 }}
                >
                  {/* Kółko z ikoną */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                      isCompleted
                        ? 'bg-gradient-to-r from-[#38b6ff] to-blue-500 text-white shadow-lg scale-110'
                        : isCurrent
                        ? 'bg-gradient-to-r from-[#38b6ff] to-blue-500 text-white shadow-xl scale-125 ring-4 ring-[#38b6ff] ring-opacity-30'
                        : darkMode
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckIcon size={20} color="#ffffff" />
                    ) : (
                      <div className={isCurrent ? 'text-white' : ''}>
                        {step.icon}
                      </div>
                    )}
                  </div>

                  {/* Tytuł i opis */}
                  <div className="mt-4 text-center max-w-[150px]">
                    <h3
                      className={`font-semibold text-sm mb-1 ${
                        isCurrent || isCompleted
                          ? darkMode
                            ? 'text-white'
                            : 'text-gray-900'
                          : darkMode
                          ? 'text-gray-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-xs ${
                        isCurrent || isCompleted
                          ? darkMode
                            ? 'text-gray-400'
                            : 'text-gray-600'
                          : darkMode
                          ? 'text-gray-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Numer kroku */}
                  <div
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted || isCurrent
                        ? 'bg-white text-[#38b6ff]'
                        : darkMode
                        ? 'bg-gray-600 text-gray-400'
                        : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlow;

