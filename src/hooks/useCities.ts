import { useState, useEffect } from 'react';
import { db } from '../lib/apiClient';
import citiesData from '../data/cities.json';

interface City {
  id: string;
  name: string;
  created_at?: string;
}

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchCities = (query: string): City[] => {
    if (!query.trim()) return [];
    
    return cities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Limit to 10 results
  };

  const addCity = async (cityName: string): Promise<City | null> => {
    try {
      const { data, error } = await db
        .from('cities')
        .insert([{ name: cityName }])
        .select()
        .single();

      if (error) {
        if (error.message === 'API not configured') {
          console.log('API not configured, adding city locally');
          // Add city locally when API is not configured
          const newCity: City = {
            id: `local-${Date.now()}`,
            name: cityName
          };
          setCities(prev => [...prev, newCity]);
          return newCity;
        }
        console.error('Error adding city:', error);
        return null;
      }

      setCities(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error in addCity:', error);
      return null;
    }
  };

  const initializeCities = async () => {
    try {
      // First, check if cities already exist in the database
      const { data: existingCities, error: fetchError } = await db
        .from('cities')
        .select('*')
        .order('name');

      if (fetchError) {
        if (fetchError.message === 'API not configured') {
          console.log('API not configured, using local cities data');
        } else {
          console.error('Error fetching cities:', fetchError);
        }
        // Fallback to local data
        const localCities = citiesData.map((name, index) => ({
          id: `local-${index}`,
          name,
        }));
        setCities(localCities);
        setLoading(false);
        return;
      }

      if (existingCities && existingCities.length > 0) {
        setCities(existingCities);
      } else {
        // Initialize with Polish cities data
        const citiesToInsert = citiesData.map(name => ({ name }));
        
        const { data, error } = await db
          .from('cities')
          .insert(citiesToInsert)
          .select();

        if (error) {
          console.error('Error inserting cities:', error);
          // Fallback to local data
          const localCities = citiesData.map((name, index) => ({
            id: `local-${index}`,
            name,
          }));
          setCities(localCities);
        } else {
          setCities(data || []);
        }
      }
    } catch (error) {
      console.error('Error initializing cities:', error);
      setError('Failed to load cities');
      // Fallback to local data
      const localCities = citiesData.map((name, index) => ({
        id: `local-${index}`,
        name,
      }));
      setCities(localCities);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeCities();
  }, []);

  return {
    cities,
    loading,
    error,
    searchCities,
    addCity,
  };
};