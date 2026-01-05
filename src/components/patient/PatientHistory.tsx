import React from 'react';
import { PatientHistoryItem } from '../../types/patient';
import { FaHistory, FaPills, FaUsers, FaWineBottle, FaAllergies } from 'react-icons/fa';

interface PatientHistoryProps {
    history: PatientHistoryItem[];
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
}

export const PatientHistory: React.FC<PatientHistoryProps> = ({ history, darkMode, fontSize }) => {
    const categories = {
        conditions: { label: 'Choroby przewlekłe', icon: FaHistory, color: 'text-blue-500' },
        medications: { label: 'Leki stałe', icon: FaPills, color: 'text-green-500' },
        family: { label: 'Wywiad rodzinny', icon: FaUsers, color: 'text-purple-500' },
        social: { label: 'Wywiad społeczny/Używki', icon: FaWineBottle, color: 'text-orange-500' },
        symptoms: { label: 'Objawy', icon: FaAllergies, color: 'text-red-500' }
    };

    const groupedHistory = history.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        if (acc[item.category]) {
            acc[item.category].push(item);
        }
        return acc;
    }, {} as Record<string, PatientHistoryItem[]>);

    const textSize = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(categories) as Array<keyof typeof categories>).map(cat => (
                <div key={cat} className={`p-4 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className={`font-bold mb-3 flex items-center ${categories[cat].color} ${textSize}`}>
                        {React.createElement(categories[cat].icon, { className: "mr-2" })}
                        {categories[cat].label}
                    </h3>
                    {groupedHistory[cat] && groupedHistory[cat].length > 0 ? (
                        <ul className="space-y-2">
                            {groupedHistory[cat].map(item => (
                                <li key={item.id} className={`${textSize} ${darkMode ? 'text-gray-300' : 'text-gray-700'} border-l-2 ${categories[cat].color.replace('text', 'border')} pl-2`}>
                                    {item.description}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={`text-sm italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Brak wpisów</p>
                    )}
                </div>
            ))}
        </div>
    );
};
