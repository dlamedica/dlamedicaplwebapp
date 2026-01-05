import React from 'react';
import {
  User,
  Users,
  Baby,
  Heart,
  Activity,
  Shield,
  ShieldOff,
  Plane,
  ArrowRight,
  Stethoscope,
  HeartHandshake,
  Syringe,
  Brain,
  ShieldAlert,
  Bug,
  PlaneTakeoff
} from 'lucide-react';

interface VaccinationCalendar {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const VaccinationCalendars: React.FC = () => {
  const calendars: VaccinationCalendar[] = [
    {
      id: 1,
      title: 'Kalendarz szczepień dorosłych',
      description: 'Kompleksowy przewodnik po szczepieniach zalecanych dla osób dorosłych w różnym wieku',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <User className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/dorosli'
    },
    {
      id: 2,
      title: 'Kalendarz szczepień osób starszych',
      description: 'Szczepienia ochronne dedykowane seniorom powyżej 65 roku życia',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <Users className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/seniorzy'
    },
    {
      id: 3,
      title: 'Kalendarz szczepień w okresie ciąży',
      description: 'Bezpieczne szczepienia dla kobiet w ciąży i planujących ciążę',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <HeartHandshake className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/ciaza'
    },
    {
      id: 4,
      title: 'Kalendarz szczepień dzieci i młodzieży',
      description: 'Program szczepień obowiązkowych i zalecanych dla dzieci od urodzenia do 18 roku życia',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <Baby className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/dzieci'
    },
    {
      id: 5,
      title: 'Kalendarz szczepień pacjentów z cukrzycą',
      description: 'Szczepienia ochronne dla osób z cukrzycą typu 1 i 2',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <Activity className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/cukrzyca'
    },
    {
      id: 6,
      title: 'Kalendarz szczepień pacjentów z chorobami uk. oddechowego',
      description: 'Profilaktyka zakażeń u pacjentów z astmą, POChP i innymi chorobami płuc',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-[#38b6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      link: '/kalendarze-szczepien/uklad-oddechowy'
    },
    {
      id: 7,
      title: 'Kalendarz szczepień pacjentów kardiologicznych',
      description: 'Szczepienia zalecane dla osób z chorobami serca i układu krążenia',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <Heart className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/kardiologia'
    },
    {
      id: 8,
      title: 'Kalendarz szczepień pacjentów z chorobami nerek',
      description: 'Program szczepień dla pacjentów z przewlekłą chorobą nerek i dializowanych',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-[#38b6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      link: '/kalendarze-szczepien/nefrologia'
    },
    {
      id: 9,
      title: 'Kalendarz szczepień pacjentów z chorobą wątroby',
      description: 'Szczepienia ochronne w marskości wątroby i innych chorobach wątroby',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-[#38b6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      ),
      link: '/kalendarze-szczepien/hepatologia'
    },
    {
      id: 10,
      title: 'Kalendarz szczepień pacjentów z asplenią',
      description: 'Profilaktyka zakażeń u pacjentów po splenektomii lub z wrodzoną asplenią',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/asplenia'
    },
    {
      id: 11,
      title: 'Kalendarz szczepień pacjentów z chorobami reumatycznymi',
      description: 'Szczepienia dla pacjentów z RZS, toczniem i innymi chorobami autoimmunologicznymi',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/reumatologia'
    },
    {
      id: 12,
      title: 'Kalendarz szczepień pacjentów z zaburzeniami odporności',
      description: 'Program szczepień dla osób z niedoborami odporności pierwotnej i wtórnej',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <ShieldOff className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/immunologia'
    },
    {
      id: 13,
      title: 'Kalendarz szczepień pacjentów zakażonych HIV',
      description: 'Szczepienia ochronne dla osób żyjących z HIV/AIDS',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <Bug className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/hiv'
    },
    {
      id: 14,
      title: 'Kalendarz szczepień w medycynie podróży',
      description: 'Szczepienia obowiązkowe i zalecane przed podróżami zagranicznymi',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <PlaneTakeoff className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/podroze'
    },
    {
      id: 15,
      title: 'Kalendarz szczepień pracowników ochrony zdrowia',
      description: 'Program szczepień dla personelu medycznego i pracowników służby zdrowia',
      icon: (
        <div className="w-12 h-12 bg-[#38b6ff]/10 rounded-lg flex items-center justify-center">
          <Stethoscope className="w-6 h-6 text-[#38b6ff]" />
        </div>
      ),
      link: '/kalendarze-szczepien/pracownicy-medyczni'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kalendarze szczepień
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Wybierz odpowiedni kalendarz szczepień dostosowany do wieku, stanu zdrowia i indywidualnych potrzeb pacjenta
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {calendar.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {calendar.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {calendar.description}
                    </p>
                    
                    {/* Link */}
                    <a
                      href={calendar.link}
                      className="inline-flex items-center text-[#38b6ff] hover:text-[#2a9fe5] font-medium text-sm transition-colors duration-200"
                    >
                      Zobacz szczegóły
                      <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Ostatnia aktualizacja: 22 kwietnia 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default VaccinationCalendars;