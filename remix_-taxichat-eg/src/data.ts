import { City, LocationSuggestion, ServiceType } from './types';

export const CITIES: City[] = ['Malabo', 'Bata'];

export const NEIGHBORHOODS: Record<City, LocationSuggestion[]> = {
  Malabo: [
    { name: 'Centro Ciudad (Plaza de España)', description: 'Zona central de administración y comercios' },
    { name: 'Ela Nguema', description: 'Barrio histórico y vibrante al este' },
    { name: 'Caracolas', description: 'Zona residencial activa al norte' },
    { name: 'Paraíso', description: 'Barrio residencial con oficinas y embajadas' },
    { name: 'Hassan II', description: 'Zona de expansión con modernos edificios' },
    { name: 'Sampaka', description: 'Municipio periférico en la carretera de Luba' },
    { name: 'Banapá', description: 'Zona residencial histórica camino al sur' },
    { name: 'Campo Yaundé', description: 'Barrio residencial popular con mercados' },
    { name: 'Aeropuerto de Malabo (SSG)', description: 'Aeropuerto Internacional de Malabo' },
    { name: 'Fishtown', description: 'Zona costera de pesca y desarrollo' },
    { name: 'Alcaide', description: 'Barrio residencial en crecimiento' }
  ],
  Bata: [
    { name: 'Centro Ciudad (Bata)', description: 'Casco urbano e histórico comercial' },
    { name: 'Ngolo', description: 'Barrio residencial icónico' },
    { name: 'Comandachina', description: 'Famoso barrio comercial y de ocio' },
    { name: 'Mondoasi', description: 'Gran barrio con actividad comercial' },
    { name: 'Ndong Ndong', description: 'Zona residencial popular' },
    { name: 'Asonga', description: 'Puerto e industrial norte' },
    { name: 'Ikunde', description: 'Zona costera sur residencial' },
    { name: 'Aeropuerto de Bata (BSG)', description: 'Aeropuerto Nacional de Bata' },
    { name: 'Miyobo', description: 'Barrio de expansión' }
  ]
};

export const SERVICES: ServiceType[] = [
  {
    id: 'compartido',
    name: 'Carrera Compartida',
    price: 500,
    description: 'Servicio estándar con otros pasajeros. Tarifa habitual de día.',
    icon: 'Users'
  },
  {
    id: 'especial',
    name: 'Carrera Especial',
    price: 2500,
    description: 'Servicio exclusivo (taxi privado). Sin escalas directamente al destino.',
    icon: 'Car'
  },
  {
    id: 'aeropuerto',
    name: 'Servicio Aeropuerto',
    price: 5000,
    description: 'Servicio directo hacia/desde el aeropuerto con maletas incluidas.',
    icon: 'Plane'
  },
  {
    id: 'propuesta',
    name: 'Tarifa Propuesta (Tú decides)',
    price: 1500,
    description: 'Tú propones la tarifa al conductor según tu destino y presupuesto.',
    icon: 'Sparkles'
  }
];

export const DEFAULT_DRIVERS = [
  { name: 'Central Taxi Malabo', phone: '240222000111' },
  { name: 'Central Taxi Bata', phone: '240222000222' },
  { name: 'Conductor Privado (Editable)', phone: '240555123456' }
];
