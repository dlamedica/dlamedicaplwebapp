import React, { useState, useEffect } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  darkMode?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  darkMode = false,
  disabled = false,
  required = false,
  placeholder = "123 456 789",
  className = "",
  id
}) => {
  const [countryCode, setCountryCode] = useState('+48');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Parse initial value
  useEffect(() => {
    if (value) {
      if (value.startsWith('+48 ')) {
        setCountryCode('+48');
        setPhoneNumber(value.slice(4));
      } else if (value.startsWith('+48')) {
        setCountryCode('+48');
        setPhoneNumber(value.slice(3));
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    const fullNumber = phoneNumber ? `${newCode} ${phoneNumber}` : newCode;
    onChange(fullNumber);
  };

  const handlePhoneNumberChange = (newNumber: string) => {
    // Remove any non-digit characters except spaces
    const cleanNumber = newNumber.replace(/[^\d\s]/g, '');
    
    // Format as XXX XXX XXX for Polish numbers
    let formattedNumber = cleanNumber;
    if (countryCode === '+48' && cleanNumber.length >= 3) {
      formattedNumber = cleanNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    setPhoneNumber(formattedNumber);
    const fullNumber = formattedNumber ? `${countryCode} ${formattedNumber}` : countryCode;
    onChange(fullNumber);
  };

  const commonStyles = `px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  } ${className}`;

  const countryCodes = [
    { value: '+48', label: '+48 (PL)', flag: '🇵🇱' },
    { value: '+49', label: '+49 (DE)', flag: '🇩🇪' },
    { value: '+33', label: '+33 (FR)', flag: '🇫🇷' },
    { value: '+44', label: '+44 (UK)', flag: '🇬🇧' },
    { value: '+1', label: '+1 (US)', flag: '🇺🇸' },
    { value: '+39', label: '+39 (IT)', flag: '🇮🇹' },
    { value: '+34', label: '+34 (ES)', flag: '🇪🇸' },
    { value: '+31', label: '+31 (NL)', flag: '🇳🇱' },
    { value: '+43', label: '+43 (AT)', flag: '🇦🇹' },
    { value: '+41', label: '+41 (CH)', flag: '🇨🇭' },
  ];

  return (
    <div className="flex space-x-2">
      {/* Country Code Selector */}
      <select
        value={countryCode}
        onChange={(e) => handleCountryCodeChange(e.target.value)}
        disabled={disabled}
        className={`${commonStyles} w-24 text-sm`}
        aria-label="Kod kraju"
      >
        {countryCodes.map((country) => (
          <option key={country.value} value={country.value}>
            {country.flag} {country.value}
          </option>
        ))}
      </select>

      {/* Phone Number Input */}
      <input
        id={id}
        type="tel"
        value={phoneNumber}
        onChange={(e) => handlePhoneNumberChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`${commonStyles} flex-1`}
        maxLength={countryCode === '+48' ? 11 : 15} // XXX XXX XXX for Polish
      />
    </div>
  );
};

export default PhoneInput;