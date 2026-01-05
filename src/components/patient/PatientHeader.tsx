import React from 'react';
import { PatientVitals } from '../../types/patient';
import { FaHeartbeat, FaLungs, FaThermometerHalf, FaTint } from 'react-icons/fa';

interface PatientHeaderProps {
    name: string;
    age: number;
    gender: string;
    vitals: PatientVitals;
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
    name, age, gender, vitals, darkMode, fontSize
}) => {
    const getVitalColor = (value: number, type: 'hr' | 'sat' | 'bp' | 'temp') => {
        // Basic logic for vital signs stability colors
        switch (type) {
            case 'hr': return (value < 50 || value > 100) ? 'text-red-500' : 'text-green-500';
            case 'sat': return value < 94 ? 'text-red-500' : 'text-green-500';
            case 'temp': return (value > 37.5 || value < 36.0) ? 'text-yellow-500' : 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    const textSize = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';
    const headerSize = fontSize === 'small' ? 'text-lg' : fontSize === 'large' ? 'text-2xl' : 'text-xl';

    return (
        <div className={`shadow-md rounded-lg p-4 mb-6 sticky top-0 z-10 ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
                {/* Patient Info */}
                <div className="mb-4 md:mb-0 text-center md:text-left">
                    <h2 className={`${headerSize} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{name}</h2>
                    <p className={`${textSize} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {age} lat, {gender === 'male' ? 'Mężczyzna' : 'Kobieta'}
                    </p>
                </div>

                {/* Vitals */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-500 mb-1">
                            <FaHeartbeat /> <span className="text-xs uppercase">HR</span>
                        </div>
                        <span className={`text-2xl font-bold ${getVitalColor(vitals.heartRate, 'hr')}`}>
                            {vitals.heartRate}
                        </span>
                        <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>bpm</span>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-500 mb-1">
                            <FaTint /> <span className="text-xs uppercase">BP</span>
                        </div>
                        <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {vitals.bloodPressureSys}/{vitals.bloodPressureDia}
                        </span>
                        <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>mmHg</span>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-500 mb-1">
                            <FaLungs /> <span className="text-xs uppercase">Sat</span>
                        </div>
                        <span className={`text-2xl font-bold ${getVitalColor(vitals.oxygenSaturation, 'sat')}`}>
                            {vitals.oxygenSaturation}%
                        </span>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-500 mb-1">
                            <FaThermometerHalf /> <span className="text-xs uppercase">Temp</span>
                        </div>
                        <span className={`text-2xl font-bold ${getVitalColor(vitals.temperature, 'temp')}`}>
                            {vitals.temperature}°C
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
