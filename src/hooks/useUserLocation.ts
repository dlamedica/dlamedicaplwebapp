import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserLocation {
  country: string | null;
  countryCode: string | null;
  isForeign: boolean;
  isLoading: boolean;
}

/**
 * Hook do wykrywania lokalizacji użytkownika
 * Sprawdza profil użytkownika i geolokalizację
 */
export const useUserLocation = (): UserLocation => {
  const { profile } = useAuth();
  const [location, setLocation] = useState<UserLocation>({
    country: null,
    countryCode: null,
    isForeign: false,
    isLoading: true,
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Priority 1: Sprawdź kraj z profilu użytkownika
        if (profile?.country) {
          const country = profile.country;
          const isForeign = country.toLowerCase() !== 'polska' && country.toLowerCase() !== 'poland';
          
          setLocation({
            country,
            countryCode: getCountryCode(country),
            isForeign,
            isLoading: false,
          });
          return;
        }

        // Priority 2: Spróbuj geolokalizacji przez API
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          if (data.country_name) {
            const country = data.country_name;
            const isForeign = data.country_code !== 'PL';
            
            setLocation({
              country,
              countryCode: data.country_code || null,
              isForeign,
              isLoading: false,
            });
            return;
          }
        } catch (geoError) {
          console.log('Geolokalizacja przez API nie powiodła się:', geoError);
        }

        // Priority 3: Spróbuj geolokalizacji przeglądarki
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
                );
                const data = await response.json();
                
                if (data.countryName) {
                  const country = data.countryName;
                  const isForeign = data.countryCode !== 'PL';
                  
                  setLocation({
                    country,
                    countryCode: data.countryCode || null,
                    isForeign,
                    isLoading: false,
                  });
                  return;
                }
              } catch (error) {
                console.log('Błąd geolokalizacji:', error);
              }
            },
            (error) => {
              console.log('Błąd geolokalizacji przeglądarki:', error);
              // Fallback: domyślnie Polska
              setLocation({
                country: 'Polska',
                countryCode: 'PL',
                isForeign: false,
                isLoading: false,
              });
            }
          );
        } else {
          // Fallback: domyślnie Polska
          setLocation({
            country: 'Polska',
            countryCode: 'PL',
            isForeign: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Błąd wykrywania lokalizacji:', error);
        // Fallback: domyślnie Polska
        setLocation({
          country: 'Polska',
          countryCode: 'PL',
          isForeign: false,
          isLoading: false,
        });
      }
    };

    detectLocation();
  }, [profile]);

  return location;
};

/**
 * Pomocnicza funkcja do konwersji nazwy kraju na kod
 */
const getCountryCode = (countryName: string): string | null => {
  const countryMap: Record<string, string> = {
    'polska': 'PL',
    'poland': 'PL',
    'niemcy': 'DE',
    'germany': 'DE',
    'czechy': 'CZ',
    'czech republic': 'CZ',
    'słowacja': 'SK',
    'slovakia': 'SK',
    'ukraina': 'UA',
    'ukraine': 'UA',
    'białoruś': 'BY',
    'belarus': 'BY',
    'litwa': 'LT',
    'lithuania': 'LT',
    'łotwa': 'LV',
    'latvia': 'LV',
    'estonia': 'EE',
    'rosja': 'RU',
    'russia': 'RU',
    'wielka brytania': 'GB',
    'united kingdom': 'GB',
    'usa': 'US',
    'united states': 'US',
    'kanada': 'CA',
    'canada': 'CA',
  };

  return countryMap[countryName.toLowerCase()] || null;
};
