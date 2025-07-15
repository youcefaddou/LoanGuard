const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

//cache: 1h pour météo, 1 jour pour INSEE
const cache = new NodeCache({stdTTL: 3600})

//coordonnées des départements
const departmentCoords = {
    '13': { lat: 43.2965, lon: 5.3698, name: 'Bouches-du-Rhône' },
    '69': { lat: 45.7640, lon: 4.8357, name: 'Rhône' },
    '75': { lat: 48.8566, lon: 2.3522, name: 'Paris' },
    '31': { lat: 43.6047, lon: 1.4442, name: 'Haute-Garonne' },
    '33': { lat: 44.8378, lon: -0.5792, name: 'Gironde' },
    '59': { lat: 50.6292, lon: 3.0573, name: 'Nord' },
    '34': { lat: 43.6119, lon: 3.8772, name: 'Hérault' },
    '44': { lat: 47.2184, lon: -1.5536, name: 'Loire-Atlantique' },
    '06': { lat: 43.7102, lon: 7.2620, name: 'Alpes-Maritimes' },
    '68': { lat: 47.7508, lon: 7.3359, name: 'Haut-Rhin' },
    '01': { lat: 45.7640, lon: 4.8357, name: 'Ain' },
    '74': { lat: 45.8992, lon: 6.1294, name: 'Haute-Savoie' },
    '08': { lat: 49.6928, lon: 4.6667, name: 'Ardennes' },
    '42': { lat: 45.4333, lon: 4.4167, name: 'Loire' },
    '83': { lat: 43.5511, lon: 7.0128, name: 'Var' },
    '84': { lat: 43.9483, lon: 4.8055, name: 'Vaucluse' },
    //etc...
}

const externalDataService = {
  // Récupérer données météo par département
  getWeatherData: async (department) => {
    try {
      const cacheKey = `weather_${department}`;
      
      // Vérifier cache d'abord
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return { success: true, data: cachedData, source: 'cache' };
      }

      // Récupérer coordonnées du département
      const coords = departmentCoords[department] || departmentCoords['75'];
      
      // Appel API OpenWeatherMap
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=fr`
      );

      const weatherData = {
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        alerts: [], // Ajouter logique d'alertes si besoin
        riskFactor: calculateWeatherRisk(response.data)
      };

      // Sauvegarder en cache (1h)
      cache.set(cacheKey, weatherData, 3600);
      
      return { success: true, data: weatherData, source: 'api' };
      
    } catch (error) {
      console.error('Erreur API météo:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer données sectorielles INSEE
  getInseeData: async (sector) => {
    try {
      const cacheKey = `insee_${sector}`;
      
      // Vérifier cache d'abord
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return { success: true, data: cachedData, source: 'cache' };
      }

      // Pour l'instant, données simulées basées sur secteur
      // on pourra implémenter vraie API INSEE plus tard
      const inseeData = getSectorData(sector);

      // Sauvegarder en cache (24h)
      cache.set(cacheKey, inseeData, 86400);
      
      return { success: true, data: inseeData, source: 'simulated' };
      
    } catch (error) {
      console.error('Erreur données INSEE:', error);
      return { success: false, error: error.message };
    }
  },

  // Méthodes cache
  getCachedData: (key) => cache.get(key),
  setCachedData: (key, data, ttl = 3600) => cache.set(key, data, ttl)
};

// Fonction helper pour calculer risque météo
function calculateWeatherRisk(weatherData) {
  let risk = 0;
  
  // Température extrême
  if (weatherData.main.temp > 35 || weatherData.main.temp < -5) {
    risk += 0.3;
  }
  
  // Vent fort
  if (weatherData.wind.speed > 15) {
    risk += 0.2;
  }
  
  // Conditions météo difficiles
  const badWeather = ['storm', 'snow', 'rain'];
  if (badWeather.some(w => weatherData.weather[0].main.toLowerCase().includes(w))) {
    risk += 0.2;
  }
  
  return Math.min(risk, 1.0); // Maximum 1.0
}

// Fonction pour données sectorielles simulées
function getSectorData(sector) {
  const sectorData = {
    'Culture de céréales': { 
      trend: -0.8, 
      volatility: 'high', 
      seasonality: 'high',
      riskFactor: 0.7 
    },
    'Culture de la vigne': { 
      trend: -0.5, 
      volatility: 'high', 
      seasonality: 'high',
      riskFactor: 0.6 
    },
    'Construction maisons individuelles': { 
      trend: 0.2, 
      volatility: 'medium', 
      seasonality: 'medium',
      riskFactor: 0.4 
    },
    'Restauration traditionnelle': { 
      trend: -0.1, 
      volatility: 'medium', 
      seasonality: 'medium',
      riskFactor: 0.5 
    },
    'Commerce alimentaire': { 
      trend: 0.1, 
      volatility: 'low', 
      seasonality: 'low',
      riskFactor: 0.3 
    }
  };
  
  return sectorData[sector] || sectorData['Commerce alimentaire'];
}

module.exports = externalDataService;