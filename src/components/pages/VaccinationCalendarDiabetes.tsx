import React, { useState } from 'react';
import { Info, X, Activity, Download, FileText } from 'lucide-react';

interface VaccineInfo {
  name: string;
  fullName: string;
  description: string;
  dosage: string;
  specialNotes?: string;
  sideEffects?: string;
  contraindications?: string;
}

interface VaccinationData {
  vaccine: string;
  fullName: string;
  schedule: string;
  info: VaccineInfo;
}

const VaccinationCalendarDiabetes: React.FC = () => {
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineInfo | null>(null);
  const [showModal, setShowModal] = useState(false);

  const vaccinations: VaccinationData[] = [
    {
      vaccine: 'IIV',
      fullName: 'Grypa',
      schedule: '1 dawka co roku, w czasie sezonu infekcyjnego (najlepiej na początku sezonu)*',
      info: {
        name: 'IIV',
        fullName: 'Szczepionka przeciw grypie (inaktywowana)',
        description: 'Szczepienie przeciw grypie jest szczególnie ważne dla osób z cukrzycą ze względu na zwiększone ryzyko powikłań.',
        dosage: 'Jedna dawka rocznie, najlepiej we wrześniu-listopadzie przed sezonem grypowym',
        specialNotes: 'Pacjenci z cukrzycą mają 3-krotnie wyższe ryzyko hospitalizacji z powodu grypy',
        sideEffects: 'Ból w miejscu wstrzyknięcia, niewielka gorączka, ból mięśni',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę, alergia na białko jaja (dla niektórych szczepionek)'
      }
    },
    {
      vaccine: 'PCV/PPSV',
      fullName: 'Pneumokoki',
      schedule: '1 dawka PCV-15 + 1 dawka PPSV-23 (w odstępie ≥8 tygodni) lub 1 dawka PCV-20',
      info: {
        name: 'PCV/PPSV',
        fullName: 'Szczepionka przeciw pneumokokom',
        description: 'Pacjenci z cukrzycą mają zwiększone ryzyko inwazyjnych zakażeń pneumokokowych.',
        dosage: 'Schemat zależy od wieku i wcześniejszych szczepień: PCV-15 + PPSV-23 lub PCV-20',
        specialNotes: 'Szczepienie zalecane dla wszystkich dorosłych z cukrzycą niezależnie od wieku',
        sideEffects: 'Ból w miejscu wstrzyknięcia, gorączka, zmęczenie',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę szczepionki przeciw pneumokokom'
      }
    },
    {
      vaccine: 'HBV',
      fullName: 'Wirusowe zapalenie wątroby typu B',
      schedule: '3 dawki (osoby, które nie były wcześniej szczepione), dodatkowo ocena odporności poszczepiennej',
      info: {
        name: 'HBV',
        fullName: 'Szczepionka przeciw wirusowemu zapaleniu wątroby typu B',
        description: 'Osoby z cukrzycą mają zwiększone ryzyko zakażenia HBV ze względu na częstsze badania krwi i zabiegi medyczne.',
        dosage: '3 dawki w schemacie 0, 1, 6 miesięcy. Kontrola przeciwciał anty-HBs po 1-2 miesiącach od ostatniej dawki',
        specialNotes: 'U osób z cukrzycą może być potrzebna dawka przypominająca ze względu na słabszą odpowiedź immunologiczną',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na drożdże lub poprzednią dawkę'
      }
    },
    {
      vaccine: 'Tdap',
      fullName: 'Błonica, tężec, krztusiec',
      schedule: '1 dawka co 10 lat',
      info: {
        name: 'Tdap',
        fullName: 'Szczepionka przeciw błonicy, tężcowi i krztuścowi',
        description: 'Rutynowe szczepienie przypominające dla wszystkich dorosłych, w tym z cukrzycą.',
        dosage: 'Jedna dawka Tdap, następnie Td co 10 lat',
        specialNotes: 'Szczególnie ważne dla osób z cukrzycą ze względu na gorsze gojenie ran i ryzyko tężca',
        sideEffects: 'Ból i obrzęk w miejscu wstrzyknięcia, gorączka, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę, encefalopatia w ciągu 7 dni po poprzedniej dawce'
      }
    },
    {
      vaccine: 'COVID-19',
      fullName: 'COVID-19',
      schedule: 'Liczba dawek zależy od historii szczepień i aktualnych zaleceń',
      info: {
        name: 'COVID-19',
        fullName: 'Szczepionka przeciw COVID-19',
        description: 'Pacjenci z cukrzycą są w grupie wysokiego ryzyka ciężkiego przebiegu COVID-19.',
        dosage: 'Schemat podstawowy + dawki przypominające według aktualnych zaleceń',
        specialNotes: 'Szczepienie priorytetowe dla osób z cukrzycą ze względu na zwiększone ryzyko hospitalizacji i zgonu',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból głowy, gorączka',
        contraindications: 'Ciężka reakcja alergiczna na składniki szczepionki'
      }
    },
    {
      vaccine: 'RSV',
      fullName: 'Syncytialny wirus oddechowy',
      schedule: '1 dawka u osób w wieku ≥60 lat',
      info: {
        name: 'RSV',
        fullName: 'Szczepionka przeciw syncytialnemu wirusowi oddechowemu',
        description: 'Nowa szczepionka zalecana dla starszych dorosłych, szczególnie z chorobami towarzyszącymi.',
        dosage: 'Jedna dawka dla osób ≥60 lat',
        specialNotes: 'Szczególnie ważne dla osób z cukrzycą ≥60 lat ze względu na zwiększone ryzyko powikłań oddechowych',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na składniki szczepionki'
      }
    },
    {
      vaccine: 'RZV',
      fullName: 'Półpasiec',
      schedule: '2 dawki w odstępie 2-6 miesięcy',
      info: {
        name: 'RZV',
        fullName: 'Szczepionka przeciw półpaścowi (rekombinowana)',
        description: 'Pacjenci z cukrzycą mają zwiększone ryzyko półpasca i jego powikłań, szczególnie neuralgii po półpaścu.',
        dosage: '2 dawki w odstępie 2-6 miesięcy dla osób ≥50 lat',
        specialNotes: 'Szczególnie zalecane dla osób z cukrzycą ze względu na immunosupresję i ryzyko powikłań',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból mięśni, ból głowy, dreszże',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    }
  ];

  const handleVaccineClick = (vaccine: VaccineInfo) => {
    setSelectedVaccine(vaccine);
    setShowModal(true);
  };

  const handleExportPDF = () => {
    alert('Funkcja eksportu do PDF będzie dostępna wkrótce');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-[#F59E0B] rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Activity className="w-10 h-10 text-white" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                Kalendarz szczepień dla pacjentów z cukrzycą
              </h1>
              <p className="text-white/90">
                Szczepienia zalecane zgodnie z Programem Szczepień Ochronnych
              </p>
            </div>
            <button
              onClick={handleExportPDF}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F59E0B]">
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Szczepienie przeciw
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Schemat szczepienia
                  </th>
                </tr>
              </thead>
              <tbody>
                {vaccinations.map((vaccination, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">
                            {vaccination.vaccine}
                          </div>
                          <div className="text-gray-600">
                            {vaccination.fullName}
                          </div>
                        </div>
                        <button
                          onClick={() => handleVaccineClick(vaccination.info)}
                          className="text-gray-400 hover:text-[#F59E0B] transition-colors"
                          title="Zobacz szczegóły"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 leading-relaxed">
                        {vaccination.schedule}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Dlaczego szczepienia są ważne dla osób z cukrzycą?
          </h3>
          <div className="text-sm text-blue-700 space-y-3">
            <p>
              <strong>Zwiększone ryzyko zakażeń:</strong> Cukrzyca osłabia system immunologiczny, 
              co zwiększa podatność na infekcje bakteryjne i wirusowe.
            </p>
            <p>
              <strong>Cięższy przebieg chorób:</strong> Infekcje u osób z cukrzycą mogą mieć 
              cięższy przebieg i prowadzić do poważnych powikłań.
            </p>
            <p>
              <strong>Wpływ na kontrolę glikemii:</strong> Infekcje mogą utrudniać kontrolę 
              poziomu cukru we krwi i prowadzić do dekompensacji cukrzycy.
            </p>
            <p>
              <strong>Gorsze gojenie:</strong> Cukrzyca spowalnia procesy gojenia, co zwiększa 
              ryzyko powikłań po infekcjach.
            </p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Ważne informacje</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-yellow-700">
            <li>Wszystkie szczepienia zalecane przez PSO są bezpieczne dla osób z cukrzycą</li>
            <li>Szczepienia należy wykonywać niezależnie od kontroli glikemii</li>
            <li>Przed szczepieniem poinformuj lekarza o wszystkich przyjmowanych lekach</li>
            <li>Po szczepieniu monitoruj poziom cukru we krwi - może być konieczna korekta dawek insuliny</li>
            <li>W przypadku gorączki po szczepieniu zwiększ częstość pomiarów glikemii</li>
            <li>Szczepienia można łączyć z rutynowymi wizytami diabetologicznymi</li>
          </ul>
        </div>

        {/* Footnotes */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Przypisy</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>*</strong> Sezon infekcyjny grypy w Polsce trwa zwykle od października do kwietnia, 
              szczyt zachorowań przypada na grudzień-luty.
            </p>
            <p>
              <strong>Źródło:</strong> Program Szczepień Ochronnych na rok 2024, 
              Komunikat Głównego Inspektora Sanitarnego
            </p>
            <p>
              <strong>Ostatnia aktualizacja:</strong> {new Date().toLocaleDateString('pl-PL')}
            </p>
            <p>
              <strong>Zgodność:</strong> Wytyczne NFZ i Polskiego Towarzystwa Diabetologicznego
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedVaccine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedVaccine.name}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedVaccine.fullName}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Opis</h3>
                <p className="text-gray-600">{selectedVaccine.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Dawkowanie</h3>
                <p className="text-gray-600">{selectedVaccine.dosage}</p>
              </div>

              {selectedVaccine.specialNotes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-800 mb-2">Szczególne uwagi dla pacjentów z cukrzycą</h3>
                  <p className="text-amber-700">{selectedVaccine.specialNotes}</p>
                </div>
              )}

              {selectedVaccine.sideEffects && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Możliwe działania niepożądane</h3>
                  <p className="text-gray-600">{selectedVaccine.sideEffects}</p>
                </div>
              )}

              {selectedVaccine.contraindications && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Przeciwwskazania</h3>
                  <p className="text-gray-600">{selectedVaccine.contraindications}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationCalendarDiabetes;