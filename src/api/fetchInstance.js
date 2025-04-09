// src/fetchInstance.js

const BASE_URL = 'http://localhost:3333/api'; // Vaš backend URL

// Funkcija za slanje zahteva
const fetchInstance = async (url, options = {}) => {
  // Proverite da li postoji access token u localStorage
  const accessToken = localStorage.getItem('accessToken');

  // Ako postoji, dodajte ga u zaglavlje Authorization
  if (accessToken) {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Podesite osnovne opcije za fetch
  const fetchOptions = {
    method: 'GET', // Podrazumevano je GET, ali možete promeniti u zavisnosti od zahteva
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : null,
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${url}`, fetchOptions);
    
    // Ako je status 401 (Unauthorized), pokušajte da osvežite token
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          // Ako je osvežavanje uspešno, sačuvajte novi access token
          const { accessToken: newAccessToken } = refreshData.data.tokens;
          localStorage.setItem('accessToken', newAccessToken);

          // Ažurirajte originalni zahtev sa novim tokenom
          const retryOptions = { ...fetchOptions };
          retryOptions.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // Ponovo pošaljite originalni zahtev sa novim tokenom
          const retryResponse = await fetch(`${BASE_URL}${url}`, retryOptions);
          return await retryResponse.json();
        } else {
          // Ako osvežavanje nije uspelo, preusmerite korisnika na login
          window.location.href = '/login';
        }
      } else {
        // Ako nema refresh tokena, preusmerite korisnika na login
        window.location.href = '/login';
      }
    }

    // Ako odgovor nije 401, parsirajte JSON i vratite podatke
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error: ', error);
    throw error; // Možete baciti grešku ili obraditi greške na drugi način
  }
};

export default fetchInstance;
