import React, { useState } from 'react';
import { LabResult, Medication } from '../../types/patient';
import { FaFlask, FaPrescriptionBottleAlt, FaPlus } from 'react-icons/fa';

interface PatientOrdersProps {
    labs: LabResult[];
    medications: Medication[];
    onOrderLab: (name: string) => void;
    onPrescribeMed: (med: any) => void; // Simplified type for mock
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
}

export const PatientOrders: React.FC<PatientOrdersProps> = ({
    labs, medications, onOrderLab, onPrescribeMed, darkMode, fontSize
}) => {
    const [activeTab, setActiveTab] = useState<'labs' | 'meds'>('labs');
    const [labSearch, setLabSearch] = useState('');

    const textSize = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';

    const commonLabs = [
        'Morfologia krwi', 'Elektrolity (Na, K)', 'Kreatynina', 'Mocznik', 'Glukoza',
        'Troponina T', 'CK-MB', 'D-dimery', 'CRP', 'Gazometria', 'ASPAT', 'ALAT'
    ];

    return (
        <div className={`rounded-lg shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'labs'
                        ? 'border-b-2 border-blue-500 text-blue-500'
                        : `text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}`}
                    onClick={() => setActiveTab('labs')}
                >
                    <FaFlask className="inline mr-2" /> Badania laboratoryjne
                </button>
                <button
                    className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'meds'
                        ? 'border-b-2 border-blue-500 text-blue-500'
                        : `text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}`}
                    onClick={() => setActiveTab('meds')}
                >
                    <FaPrescriptionBottleAlt className="inline mr-2" /> Farmakoterapia
                </button>
            </div>

            <div className="p-4">
                {activeTab === 'labs' && (
                    <div>
                        <div className="mb-4 flex gap-2">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Wyszukaj lub wybierz badanie..."
                                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                                    value={labSearch}
                                    onChange={e => setLabSearch(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => { if (labSearch) { onOrderLab(labSearch); setLabSearch(''); } }}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                <FaPlus /> Zleć
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {commonLabs.map(lab => (
                                <button
                                    key={lab}
                                    onClick={() => onOrderLab(lab)}
                                    className={`px-3 py-1 text-xs rounded-full border ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}
                                >
                                    + {lab}
                                </button>
                            ))}
                        </div>

                        <h4 className="font-bold mb-3 mt-6">Wyniki badań</h4>
                        {labs.length === 0 ? (
                            <p className="text-gray-500 italic">Brak zleconych badań</p>
                        ) : (
                            <div className="space-y-2">
                                {labs.map(lab => (
                                    <div key={lab.id} className={`p-3 rounded border flex justify-between items-center ${!lab.resultAt ? (darkMode ? 'bg-gray-700/50' : 'bg-gray-50') :
                                            lab.isAbnormal ? (darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200') :
                                                (darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200')
                                        }`}>
                                        <div>
                                            <span className="font-medium block">{lab.testName}</span>
                                            <span className="text-xs text-gray-500">{new Date(lab.orderedAt).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-bold ${textSize} ${!lab.resultAt ? 'text-gray-500' :
                                                    lab.isAbnormal ? 'text-red-500' : 'text-green-600'
                                                }`}>
                                                {lab.value} {lab.unit}
                                            </span>
                                            {lab.referenceRange && (
                                                <span className="text-xs text-gray-500 block">Norma: {lab.referenceRange}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'meds' && (
                    <div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Szybkie zlecenie (Mock):</p>
                            <button
                                onClick={() => onPrescribeMed({ name: 'Aspirina', dosage: '300mg', route: 'PO', frequency: 'jednorazowo' })}
                                className="mr-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                            >
                                + Aspirina 300mg
                            </button>
                            <button
                                onClick={() => onPrescribeMed({ name: 'Morfina', dosage: '2mg', route: 'IV', frequency: 'jednorazowo' })}
                                className="mr-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                            >
                                + Morfina 2mg IV
                            </button>
                            <button
                                onClick={() => onPrescribeMed({ name: 'Nitrogliceryna', dosage: '0.5mg', route: 'SL', frequency: 'w razie bólu' })}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                            >
                                + Nitrogliceryna SL
                            </button>
                        </div>

                        <h4 className="font-bold mb-3">Karta zleceń</h4>
                        {medications.length === 0 ? (
                            <p className="text-gray-500 italic">Brak zleceń lekarskich</p>
                        ) : (
                            <div className="space-y-2">
                                {medications.map(med => (
                                    <div key={med.id} className={`p-3 rounded border flex justify-between items-center ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                                        <div>
                                            <span className="font-bold text-blue-500">{med.name}</span>
                                            <span className="ml-2 text-sm">{med.dosage}</span>
                                            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-800">{med.route}</span>
                                        </div>
                                        <div className="text-right text-sm">
                                            <div>{med.frequency}</div>
                                            <div className="text-xs text-gray-500">{new Date(med.startDate).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
