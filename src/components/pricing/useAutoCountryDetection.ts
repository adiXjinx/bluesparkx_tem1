import { useEffect, useState } from 'react';

interface GeolocationResponse {
  country_code: string;
  country_name: string;
  city?: string;
  region?: string;
}

export function useAutoCountryDetection() {
  const [country, setCountry] = useState<string>('US'); // Default to US
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        setLoading(true);
        setError(null);

        // Method 1: Try using a free IP geolocation service with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        try {
          const response = await fetch('https://ipapi.co/json/', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const data: GeolocationResponse = await response.json();
            if (data.country_code && data.country_code !== 'undefined') {
              console.log('Auto-detected country:', data.country_code, data.country_name);
              setCountry(data.country_code);
              setLoading(false);
              return;
            }
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.warn('IP geolocation failed:', fetchError);
        }

        // Method 2: Fallback to browser's timezone-based detection
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const countryFromTimezone = getCountryFromTimezone(timezone);
        if (countryFromTimezone) {
          console.log('Country detected from timezone:', countryFromTimezone);
          setCountry(countryFromTimezone);
        }
      } catch (err) {
        console.warn('Failed to auto-detect country:', err);
        setError('Failed to detect location');

        // Fallback to browser language
        const browserLanguage = navigator.language || navigator.languages?.[0];
        if (browserLanguage) {
          const countryFromLang = browserLanguage.split('-')[1];
          if (countryFromLang && countryFromLang.length === 2) {
            setCountry(countryFromLang.toUpperCase());
          }
        }
      } finally {
        setLoading(false);
      }
    };

    detectCountry();
  }, []);

  return { country, loading, error, setCountry };
}

// Helper function to map common timezones to countries
function getCountryFromTimezone(timezone: string): string | null {
  const timezoneToCountry: Record<string, string> = {
    // North America
    'America/New_York': 'US',
    'America/Chicago': 'US',
    'America/Denver': 'US',
    'America/Los_Angeles': 'US',
    'America/Phoenix': 'US',
    'America/Anchorage': 'US',
    'America/Toronto': 'CA',
    'America/Vancouver': 'CA',
    'America/Mexico_City': 'MX',

    // Europe
    'Europe/London': 'GB',
    'Europe/Dublin': 'IE',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Europe/Rome': 'IT',
    'Europe/Madrid': 'ES',
    'Europe/Amsterdam': 'NL',
    'Europe/Brussels': 'BE',
    'Europe/Zurich': 'CH',
    'Europe/Vienna': 'AT',
    'Europe/Stockholm': 'SE',
    'Europe/Oslo': 'NO',
    'Europe/Copenhagen': 'DK',
    'Europe/Helsinki': 'FI',
    'Europe/Warsaw': 'PL',
    'Europe/Prague': 'CZ',
    'Europe/Budapest': 'HU',
    'Europe/Bucharest': 'RO',
    'Europe/Sofia': 'BG',
    'Europe/Athens': 'GR',
    'Europe/Istanbul': 'TR',
    'Europe/Moscow': 'RU',

    // Asia Pacific
    'Asia/Tokyo': 'JP',
    'Asia/Seoul': 'KR',
    'Asia/Shanghai': 'CN',
    'Asia/Hong_Kong': 'HK',
    'Asia/Singapore': 'SG',
    'Asia/Bangkok': 'TH',
    'Asia/Jakarta': 'ID',
    'Asia/Manila': 'PH',
    'Asia/Kuala_Lumpur': 'MY',
    'Asia/Kolkata': 'IN',
    'Asia/Dubai': 'AE',
    'Asia/Riyadh': 'SA',
    'Asia/Tel_Aviv': 'IL',

    // Australia & Oceania
    'Australia/Sydney': 'AU',
    'Australia/Melbourne': 'AU',
    'Australia/Brisbane': 'AU',
    'Australia/Perth': 'AU',
    'Pacific/Auckland': 'NZ',

    // South America
    'America/Sao_Paulo': 'BR',
    'America/Argentina/Buenos_Aires': 'AR',
    'America/Santiago': 'CL',
    'America/Lima': 'PE',
    'America/Bogota': 'CO',
    'America/Caracas': 'VE',

    // Africa
    'Africa/Cairo': 'EG',
    'Africa/Lagos': 'NG',
    'Africa/Johannesburg': 'ZA',
    'Africa/Nairobi': 'KE',
    'Africa/Casablanca': 'MA',
  };

  return timezoneToCountry[timezone] || null;
}
