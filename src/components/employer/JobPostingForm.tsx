import React, { useState, useEffect } from 'react';
import { createJobOffer } from '../../services/mockJobService';
import { JobOfferInput } from '../../types';

interface JobPostingFormProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onJobCreated?: (jobOffer: any) => void;
}

interface FormData {
  company: string;
  position: string;
  contractType: string;
  location: string;
  category: string;
  description: string;
  salary: string;
  salaryType: string;
  facilityType: string;
  zamow_medyczny: boolean;
  requirements: string[];
  benefits: string[];
  responsibilities: string[];
  skills: string[];
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ darkMode, fontSize, onJobCreated }) => {
  const [formData, setFormData] = useState<FormData>({
    company: '',
    position: '',
    contractType: '',
    location: '',
    category: '',
    description: '',
    salary: '',
    salaryType: '',
    facilityType: '',
    zamow_medyczny: false,
    requirements: [''],
    benefits: [''],
    responsibilities: [''],
    skills: ['']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    'Lekarze',
    'Pielęgniarki',
    'Ratownicy',
    'Fizjoterapeuci',
    'Technicy',
    'Farmaceuci',
    'Kosmetologia',
    'Inne'
  ];

  const contractTypes = [
    'Umowa o pracę',
    'Umowa zlecenie',
    'Umowa o dzieło',
    'B2B',
    'Kontrakt',
    'Praktyki/Staż'
  ];

  const salaryTypes = [
    'miesięcznie',
    'rocznie',
    'za godzinę',
    'za dyżur',
    'do negocjacji'
  ];

  const facilityTypes = [
    'Szpital publiczny',
    'Szpital prywatny',
    'Przychodnia',
    'Klinika prywatna',
    'Dom opieki',
    'Apteka',
    'Laboratorium',
    'Rehabilitacja',
    'Inne'
  ];

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field: 'requirements' | 'benefits' | 'responsibilities' | 'skills', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'requirements' | 'benefits' | 'responsibilities' | 'skills') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'requirements' | 'benefits' | 'responsibilities' | 'skills', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.position.trim()) newErrors.position = 'Nazwa stanowiska jest wymagana';
        if (!formData.company.trim()) newErrors.company = 'Nazwa firmy jest wymagana';
        if (!formData.location.trim()) newErrors.location = 'Lokalizacja jest wymagana';
        if (!formData.category) newErrors.category = 'Kategoria jest wymagana';
        break;
      case 2:
        if (!formData.contractType) newErrors.contractType = 'Typ umowy jest wymagany';
        if (!formData.description.trim()) newErrors.description = 'Opis stanowiska jest wymagany';
        if (formData.description.length < 100) newErrors.description = 'Opis powinien mieć co najmniej 100 znaków';
        break;
      case 3:
        const validRequirements = formData.requirements.filter(req => req.trim());
        if (validRequirements.length === 0) newErrors.requirements = 'Dodaj co najmniej jedno wymaganie';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      // Filter out empty array items
      const filteredData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim()),
        benefits: formData.benefits.filter(ben => ben.trim()),
        responsibilities: formData.responsibilities.filter(resp => resp.trim()),
        skills: formData.skills.filter(skill => skill.trim())
      };

      // Combine additional data into description
      const fullDescription = `
${formData.description}

${filteredData.responsibilities.length > 0 ? `\n**Zakres obowiązków:**\n${filteredData.responsibilities.map(resp => `• ${resp}`).join('\n')}` : ''}

${filteredData.requirements.length > 0 ? `\n**Wymagania:**\n${filteredData.requirements.map(req => `• ${req}`).join('\n')}` : ''}

${filteredData.skills.length > 0 ? `\n**Pożądane umiejętności:**\n${filteredData.skills.map(skill => `• ${skill}`).join('\n')}` : ''}

${filteredData.benefits.length > 0 ? `\n**Oferujemy:**\n${filteredData.benefits.map(ben => `• ${ben}`).join('\n')}` : ''}
      `.trim();

      const jobOfferData: JobOfferInput = {
        title: filteredData.position,
        company_name: filteredData.company,
        contract_type: filteredData.contractType || 'contract', // Default fallback
        city: filteredData.location,
        medical_category: filteredData.category,
        description: fullDescription,
        // Map simple salary string to structure if possible, otherwise leave empty
        salary_min: undefined,
        salary_max: undefined,
        salary_currency: 'PLN',
        salary_period: filteredData.salaryType || 'month',
        facility_type: filteredData.facilityType,
        is_remote: false, // Default
        requirements: filteredData.requirements.join('\n'),
        benefits: filteredData.benefits.join('\n'),
        status: 'pending',
        featured: false,
        salary_negotiable: filteredData.salary === 'do negocjacji',
        experience_required: 'Mid', // Default
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        // Extra fields to satisfy type if needed
        views_count: 0,
        is_urgent: false
      } as unknown as JobOfferInput;

      const result = await createJobOffer(jobOfferData);

      if (result) {
        onJobCreated?.(result);
        // Reset form
        setFormData({
          company: '',
          position: '',
          contractType: '',
          location: '',
          category: '',
          description: '',
          salary: '',
          salaryType: '',
          facilityType: '',
          zamow_medyczny: false,
          requirements: [''],
          benefits: [''],
          responsibilities: [''],
          skills: ['']
        });
        setCurrentStep(1);
        alert('Oferta pracy została pomyślnie utworzona!');
      } else {
        alert('Błąd podczas tworzenia oferty');
      }
    } catch (error) {
      console.error('Error creating job offer:', error);
      alert('Wystąpił błąd podczas tworzenia oferty pracy');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
        Podstawowe informacje
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizeClasses[fontSize]}`}>
            Nazwa stanowiska *
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]'
              : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
              } ${fontSizeClasses[fontSize]}`}
            placeholder="np. Lekarz internista"
          />
          {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
        </div>

        <div>
          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizeClasses[fontSize]}`}>
            Nazwa firmy *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]'
              : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
              } ${fontSizeClasses[fontSize]}`}
            placeholder="np. Szpital Miejski"
          />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
        </div>

        <div>
          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizeClasses[fontSize]}`}>
            Lokalizacja *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]'
              : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
              } ${fontSizeClasses[fontSize]}`}
            placeholder="np. Warszawa, Kraków"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizeClasses[fontSize]}`}>
            Kategoria *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]'
              : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
              } ${fontSizeClasses[fontSize]}`}
          >
            <option value="">Wybierz kategorię</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizeClasses[fontSize]}`}>
            Typ placówki
          </label>
          <select
            value={formData.facilityType}
            onChange={(e) => handleInputChange('facilityType', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]'
              : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
              } ${fontSizeClasses[fontSize]}`}
          >
            <option value="">Wybierz typ placówki</option>
            {facilityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="zamow_medyczny"
            checked={formData.zamow_medyczny}
            onChange={(e) => handleInputChange('zamow_medyczny', e.target.checked)}
            className="h-4 w-4 text-[#38b6ff] focus:ring-[#38b6ff] border-gray-300 rounded"
          />
          <label htmlFor="zamow_medyczny" className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizeClasses[fontSize]}`}>
            Zamów medyczny
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
        Szczegóły zatrudnienia
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizeClasses[fontSize]}`}>
            Typ umowy *
          </label>
          <select
            value={formData.contractType}
            onChange={(e) => handleInputChange('contractType', e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]'
              : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
              } ${fontSizeClasses[fontSize]}`}
          >
            <option value="">Wybierz typ umowy</option>
            {contractTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.contractType && <p className="text-red-500 text-sm mt-1">{errors.contractType}</p>}
        </div>

        <div>
          <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizeClasses[fontSize]}`}>
            Wynagrodzenie
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => handleInputChange('salary', e.target.value)}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]'
                : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
                } ${fontSizeClasses[fontSize]}`}
              placeholder="np. 5000-7000 PLN"
            />
            <select
              value={formData.salaryType}
              onChange={(e) => handleInputChange('salaryType', e.target.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]'
                : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
                } ${fontSizeClasses[fontSize]}`}
            >
              <option value="">Okres</option>
              {salaryTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizeClasses[fontSize]}`}>
          Opis stanowiska *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={8}
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${darkMode
            ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]'
            : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
            } ${fontSizeClasses[fontSize]}`}
          placeholder="Opisz szczegółowo stanowisko, środowisko pracy, zespół..."
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-auto`}>
            {formData.description.length}/5000 znaków
          </p>
        </div>
      </div>
    </div>
  );

  const renderArrayField = (
    title: string,
    field: 'requirements' | 'benefits' | 'responsibilities' | 'skills',
    placeholder: string,
    required: boolean = false
  ) => (
    <div>
      <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${fontSizeClasses[fontSize]}`}>
        {title} {required && '*'}
      </label>
      <div className="space-y-2">
        {formData[field].map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(field, index, e.target.value)}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff]'
                : 'bg-white border-gray-300 text-gray-900 focus:border-[#1976d2]'
                } ${fontSizeClasses[fontSize]}`}
              placeholder={placeholder}
            />
            {formData[field].length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(field, index)}
                className="p-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem(field)}
          className={`flex items-center px-4 py-2 text-sm border-2 border-dashed rounded-lg transition-colors ${darkMode
            ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
            : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
            }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Dodaj kolejny punkt
        </button>
      </div>
      {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
        Wymagania i obowiązki
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderArrayField('Zakres obowiązków', 'responsibilities', 'np. Opieka nad pacjentami')}
        {renderArrayField('Wymagania', 'requirements', 'np. Wykształcenie wyższe medyczne', true)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderArrayField('Pożądane umiejętności', 'skills', 'np. Znajomość języka angielskiego')}
        {renderArrayField('Oferujemy', 'benefits', 'np. Atrakcyjne wynagrodzenie')}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
        Podgląd oferty
      </h3>

      <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <div className="space-y-4">
          <div>
            <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-xl`}>
              {formData.position}
            </h4>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
              {formData.company} • {formData.location}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#38b6ff] text-black rounded-full text-sm">
              {formData.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
              {formData.contractType}
            </span>
            {formData.salary && (
              <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                {formData.salary} {formData.salaryType}
              </span>
            )}
          </div>

          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
            <p className="whitespace-pre-line">{formData.description}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-8 py-3 bg-[#38b6ff] text-black font-semibold rounded-lg hover:bg-[#2a9fe5] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${fontSizeClasses[fontSize]}`}
        >
          {isSubmitting ? 'Publikowanie...' : 'Opublikuj ofertę'}
        </button>
      </div>
    </div>
  );

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Podstawowe informacje';
      case 2: return 'Szczegóły zatrudnienia';
      case 3: return 'Wymagania i benefity';
      case 4: return 'Podgląd i publikacja';
      default: return '';
    }
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step <= currentStep
                ? 'bg-[#38b6ff] text-black'
                : darkMode
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-200 text-gray-500'
                }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${step < currentStep
                  ? 'bg-[#38b6ff]'
                  : darkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
                  }`} />
              )}
            </div>
          ))}
        </div>
        <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSize === 'large' ? 'text-2xl' : fontSize === 'medium' ? 'text-xl' : 'text-lg'
          }`}>
          Krok {currentStep}: {getStepTitle(currentStep)}
        </h2>
      </div>

      {/* Form Content */}
      <div className="mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="flex justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 border rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${darkMode
              ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
              : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
              } ${fontSizeClasses[fontSize]}`}
          >
            Poprzedni
          </button>

          <button
            onClick={handleNextStep}
            className={`px-6 py-2 bg-[#38b6ff] text-black font-semibold rounded-lg hover:bg-[#2a9fe5] transition-colors duration-200 ${fontSizeClasses[fontSize]}`}
          >
            Następny
          </button>
        </div>
      )}

      {currentStep === 4 && (
        <div className="flex justify-between">
          <button
            onClick={handlePrevStep}
            className={`px-6 py-2 border rounded-lg transition-colors duration-200 ${darkMode
              ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
              : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
              } ${fontSizeClasses[fontSize]}`}
          >
            Poprzedni
          </button>
        </div>
      )}
    </div>
  );
};

export default JobPostingForm;
