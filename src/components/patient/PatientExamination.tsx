import React from 'react';
import { PhysicalExamFinding } from '../../types/patient';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface PatientExaminationProps {
    examination: PhysicalExamFinding[];
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
}

export const PatientExamination: React.FC<PatientExaminationProps> = ({ examination, darkMode, fontSize }) => {
    const textSize = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';

    return (
        <div className={`rounded-lg shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                        <th className={`px-4 py-3 text-left font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Układ</th>
                        <th className={`px-4 py-3 text-left font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Wynik badania</th>
                        <th className={`px-4 py-3 text-center font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {examination.map(exam => (
                        <tr key={exam.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            <td className={`px-4 py-3 font-medium capitalize ${textSize} ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {exam.system}
                            </td>
                            <td className={`px-4 py-3 ${textSize} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {exam.finding}
                            </td>
                            <td className="px-4 py-3 text-center">
                                {exam.isAbnormal ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <FaExclamationCircle className="mr-1" /> Patologia
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <FaCheckCircle className="mr-1" /> Norma
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
