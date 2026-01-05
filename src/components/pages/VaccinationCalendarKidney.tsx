import React, { useState } from 'react';
import { Info, X, Download, FileText } from 'lucide-react';

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

const VaccinationCalendarKidney: React.FC = () => {
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineInfo | null>(null);
  const [showModal, setShowModal] = useState(false);

  const vaccinations: VaccinationData[] = [
    {
      vaccine: 'HBV',
      fullName: 'Wirusowe zapalenie wątroby typu B',
      schedule: '4 dawki (osoby, które nie były wcześniej szczepione), dodatkowo ocena odporności poszczepiennej',
      info: {
        name: 'HBV',
        fullName: 'Szczepionka przeciw wirusowemu zapaleniu wątroby typu B',
        description: 'Szczepienie przeciw WZW typu B jest kluczowe dla pacjentów z przewlekłą chorobą nerek ze względu na zwiększone ryzyko ekspozycji na krew i preparaty krwiopochodne.',
        dosage: '4 dawki w schemacie 0, 1, 2, 6 miesięcy (schemat przyspieszony) lub standardowy z dodatkową dawką. Kontrola przeciwciał anty-HBs po 1-2 miesiącach od ostatniej dawki',
        specialNotes: 'Pacjenci z przewlekłą chorobą nerek mogą wymagać wyższych dawek szczepionki (40 μg zamiast 20 μg) ze względu na słabszą odpowiedź immunologiczną. Konieczne regularne monitorowanie miana przeciwciał.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból głowy, niewielka gorączka',
        contraindications: 'Ciężka reakcja alergiczna na drożdże lub poprzednią dawkę szczepionki'
      }
    },
    {
      vaccine: 'IIV',
      fullName: 'Grypa',
      schedule: '1 dawka co roku, w czasie sezonu infekcyjnego (najlepiej na początku sezonu)*',
      info: {
        name: 'IIV',
        fullName: 'Szczepionka przeciw grypie (inaktywowana)',
        description: 'Szczepienie przeciw grypie jest priorytetowe dla pacjentów z przewlekłą chorobą nerek ze względu na zwiększone ryzyko powikłań i hospitalizacji.',
        dosage: 'Jedna dawka rocznie, najlepiej we wrześniu-listopadzie przed sezonem grypowym',
        specialNotes: 'Pacjenci z przewlekłą chorobą nerek mają 3-4 razy wyższe ryzyko hospitalizacji z powodu grypy. Szczepienie jest bezpieczne u pacjentów dializowanych.',
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
        description: 'Pacjenci z przewlekłą chorobą nerek mają znacznie zwiększone ryzyko inwazyjnych zakażeń pneumokokowych, szczególnie ci na dializie.',
        dosage: 'Schemat zależy od wieku i wcześniejszych szczepień: PCV-15 + PPSV-23 w odstępie ≥8 tygodni lub PCV-20 w pojedynczej dawce',
        specialNotes: 'Szczepienie zalecane dla wszystkich pacjentów z przewlekłą chorobą nerek niezależnie od wieku. U pacjentów na dializie szczepienie należy wykonać w dniu wolnym od dializy.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, gorączka, zmęczenie',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę szczepionki przeciw pneumokokom'
      }
    },
    {
      vaccine: 'Tdap',
      fullName: 'Błonica, tężec, krztusiec',
      schedule: '1 dawka co 10 lat',
      info: {
        name: 'Tdap',
        fullName: 'Szczepionka przeciw błonicy, tężcowi i krztuścowi',
        description: 'Rutynowe szczepienie przypominające dla wszystkich dorosłych, w tym pacjentów z przewlekłą chorobą nerek.',
        dosage: 'Jedna dawka Tdap, następnie Td co 10 lat',
        specialNotes: 'Szczególnie ważne dla pacjentów z przewlekłą chorobą nerek ze względu na zwiększone ryzyko zakażeń i gorsze gojenie ran.',
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
        description: 'Pacjenci z przewlekłą chorobą nerek są w grupie bardzo wysokiego ryzyka ciężkiego przebiegu COVID-19.',
        dosage: 'Schemat podstawowy + dawki przypominające według aktualnych zaleceń',
        specialNotes: 'Szczepienie priorytetowe dla wszystkich pacjentów z przewlekłą chorobą nerek. Pacjenci na dializie i po przeszczepieniu nerki wymagają szczególnej uwagi i mogą potrzebować dodatkowych dawek.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból głowy, gorączka',
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
        description: 'Pacjenci z przewlekłą chorobą nerek mają zwiększone ryzyko półpasca i jego powikłań ze względu na osłabienie odporności.',
        dosage: '2 dawki w odstępie 2-6 miesięcy dla osób ≥50 lat',
        specialNotes: 'Szczególnie zalecane dla pacjentów z przewlekłą chorobą nerek ze względu na immunosupresję i ryzyko powikłań neuralgicznych. Bezpieczne u pacjentów dializowanych.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból mięśni, ból głowy, dreszczy, gorączka',
        contraindications: 'Ciężka reakcja alergiczna na poprzednią dawkę'
      }
    },
    {
      vaccine: 'RSV',
      fullName: 'Syncytialny wirus oddechowy',
      schedule: '1 dawka u osób w wieku ≥60 lat',
      info: {
        name: 'RSV',
        fullName: 'Szczepionka przeciw syncytialnemu wirusowi oddechowemu',
        description: 'Nowa szczepionka zalecana dla starszych dorosłych z chorobami towarzyszącymi, w tym przewlekłą chorobą nerek.',
        dosage: 'Jedna dawka dla osób ≥60 lat',
        specialNotes: 'Szczególnie ważne dla pacjentów z przewlekłą chorobą nerek ≥60 lat ze względu na zwiększone ryzyko powikłań oddechowych i hospitalizacji.',
        sideEffects: 'Ból w miejscu wstrzyknięcia, zmęczenie, ból głowy',
        contraindications: 'Ciężka reakcja alergiczna na składniki szczepionki'
      }
    }
  ];

  const handleVaccineClick = (vaccine: VaccineInfo) => {
    setSelectedVaccine(vaccine);
    setShowModal(true);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-[#D2B48C] rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.134 2 5 5.134 5 9c0 2.5 1.5 4.5 3 6l4 6 4-6c1.5-1.5 3-3.5 3-6 0-3.866-3.134-7-7-7zm0 9.5c-1.381 0-2.5-1.119-2.5-2.5S10.619 6.5 12 6.5s2.5 1.119 2.5 2.5S13.381 11.5 12 11.5z" />
            </svg>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                Kalendarz szczepień dla pacjentów z przewlekłą chorobą nerek
              </h1>
              <p className="text-white/90">
                Szczepienia zalecane zgodnie z Programem Szczepień Ochronnych
              </p>
            </div>

          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FF8A50]">
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
                          className="text-gray-400 hover:text-[#FF8A50] transition-colors"
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
            Dlaczego szczepienia są kluczowe dla pacjentów z przewlekłą chorobą nerek?
          </h3>
          <div className="text-sm text-blue-700 space-y-3">
            <p>
              <strong>Osłabienie odporności:</strong> Przewlekła choroba nerek prowadzi do upośledzenia
              funkcji układu immunologicznego, zwiększając podatność na infekcje.
            </p>
            <p>
              <strong>Zwiększone ryzyko powikłań:</strong> Infekcje u pacjentów z chorobą nerek mogą
              prowadzić do pogorszenia funkcji nerek i konieczności hospitalizacji.
            </p>
            <p>
              <strong>Ekspozycja na patogeny:</strong> Częste wizyty medyczne, procedury inwazyjne
              i dializa zwiększają ryzyko zakażeń, szczególnie HBV.
            </p>
            <p>
              <strong>Słabsza odpowiedź na szczepienia:</strong> Pacjenci z chorobą nerek mogą wymagać
              wyższych dawek szczepionek lub dodatkowych dawek przypominających.
            </p>
            <p>
              <strong>Przygotowanie do transplantacji:</strong> Odpowiedni stan zaszczepienia jest
              kluczowy przed ewentualną transplantacją nerki.
            </p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Ważne informacje dla pacjentów z chorobą nerek</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-yellow-700">
            <li>Wszystkie szczepienia zalecane przez PSO są bezpieczne dla pacjentów z przewlekłą chorobą nerek</li>
            <li>Szczepienia należy wykonywać przed rozpoczęciem dializy, jeśli to możliwe</li>
            <li>U pacjentów dializowanych szczepienia wykonywać w dniu wolnym od dializy</li>
            <li>Może być konieczne monitorowanie miana przeciwciał po szczepieniu</li>
            <li>Niektóre szczepienia mogą wymagać wyższych dawek (np. HBV)</li>
            <li>Przed transplantacją nerki należy uzupełnić wszystkie szczepienia żywymi szczepionkami</li>
            <li>Po transplantacji unikać szczepionek żywych ze względu na immunosupresję</li>
            <li>Skonsultuj się z nefrologiem przed każdym szczepieniem</li>
          </ul>
        </div>

        {/* Abbreviations */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Objaśnienia skrótów</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-green-900">HBV</span>
              <span className="text-green-700"> - Wirusowe zapalenie wątroby typu B</span>
            </div>
            <div>
              <span className="font-semibold text-green-900">IIV</span>
              <span className="text-green-700"> - Inaktywowana szczepionka przeciw grypie</span>
            </div>
            <div>
              <span className="font-semibold text-green-900">PCV</span>
              <span className="text-green-700"> - Skoniugowana szczepionka przeciw pneumokokom</span>
            </div>
            <div>
              <span className="font-semibold text-green-900">PPSV</span>
              <span className="text-green-700"> - Polisacharydowa szczepionka przeciw pneumokokom</span>
            </div>
            <div>
              <span className="font-semibold text-green-900">Tdap</span>
              <span className="text-green-700"> - Błonica, tężec, krztusiec (dla dorosłych)</span>
            </div>
            <div>
              <span className="font-semibold text-green-900">RZV</span>
              <span className="text-green-700"> - Rekombinowana szczepionka przeciw półpaścowi</span>
            </div>
            <div>
              <span className="font-semibold text-green-900">RSV</span>
              <span className="text-green-700"> - Syncytialny wirus oddechowy</span>
            </div>
          </div>
        </div>

        {/* Footnotes */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Przypisy i źródła</h3>
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
              <strong>Zgodność:</strong> Wytyczne NFZ, Polskiego Towarzystwa Nefrologicznego i ECDC
            </p>
            <p>
              <strong>Kontakt:</strong> W przypadku pytań skonsultuj się z nefrologiem lub centrum dializ
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
                  <h3 className="font-semibold text-amber-800 mb-2">Szczególne uwagi dla pacjentów z chorobą nerek</h3>
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

export default VaccinationCalendarKidney;