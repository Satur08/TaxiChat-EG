import React, { useState, useEffect, useRef } from 'react';
import { 
  Car, 
  Coins,
  Users, 
  Plane, 
  Phone, 
  MapPin, 
  Compass, 
  ArrowRight, 
  Check, 
  History, 
  Info, 
  Clock, 
  Trash2, 
  Copy, 
  ExternalLink, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Smartphone,
  Navigation,
  Sparkles,
  Palette,
  Settings,
  User,
  X,
  Flame,
  AlertTriangle,
  UserCheck,
  XCircle,
  Shield,
  Gauge,
  Volume2,
  VolumeX,
  Download,
  Award,
  Mail,
  Map,
  FileSpreadsheet,
  Edit3,
  Star,
  Save,
  FileText,
  TrendingUp,
  Calendar,
  Lock,
  Unlock,
  UserX,
  ShieldAlert,
  DollarSign,
  BarChart3,
  ShieldCheck,
  Gavel,
  Wrench,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { City, ServiceClass, TaxiRequest, UrgencyLevel, DriverProfile, ExperienceLevel, DriverCommission, RegisteredPassenger, RegisteredDriver } from './types';
import { CITIES, NEIGHBORHOODS, SERVICES, DEFAULT_DRIVERS } from './data';
import { RouteVisualizer } from './components/RouteVisualizer';
import { GpsNavigator } from './components/GpsNavigator';
import { DocumentValidator } from './components/DocumentValidator';
import { SupportChat } from './components/SupportChat';
import { DriverProximityTracker } from './components/DriverProximityTracker';

// Helper: Guinea Ecuatorial Phone Number Validator
export const validateGEPhone = (num: string): { isValid: boolean; carrier: string; message: string } => {
  const clean = num.replace(/\D/g, ''); // keep only digits
  
  // If it starts with 240, extract local number
  let localNum = clean;
  if (clean.startsWith('240') && clean.length > 3) {
    localNum = clean.slice(3);
  }
  
  if (localNum.length === 0) {
    return { isValid: false, carrier: '', message: 'Introduce tu número de teléfono' };
  }
  
  if (localNum.length !== 9) {
    return { 
      isValid: false, 
      carrier: '', 
      message: `Debe tener 9 dígitos (introducido: ${localNum.length})` 
    };
  }
  
  // Determine carrier in GE
  let carrier = 'Desconocido';
  if (localNum.startsWith('222')) {
    carrier = 'GETESA';
  } else if (localNum.startsWith('555') || localNum.startsWith('666')) {
    carrier = 'Muni';
  } else if (localNum.startsWith('888') || localNum.startsWith('777')) {
    carrier = 'Gecomsa';
  }
  
  return { 
    isValid: true, 
    carrier, 
    message: `Número ${carrier} válido de Guinea Ecuatorial` 
  };
};

// Helper: Deterministic calculation of distance based on strings
export const calculateDistance = (from: string, to: string): { km: number; min: number } => {
  if (!from || !to) return { km: 0, min: 0 };
  
  const str1 = from.toLowerCase().trim();
  const str2 = to.toLowerCase().trim();
  
  if (str1 === str2) return { km: 0.5, min: 2 };
  
  let hash = 0;
  for (let i = 0; i < str1.length; i++) {
    hash += str1.charCodeAt(i);
  }
  for (let i = 0; i < str2.length; i++) {
    hash += str2.charCodeAt(i);
  }
  
  const km = parseFloat((1.2 + (hash % 68) / 10).toFixed(1));
  const min = Math.ceil(km * 2.5 + (hash % 4));
  
  return { km, min };
};

export const TRANSLATIONS = {
  es: {
    title: "TaxiChat EG",
    subtitle: "Despachador por WhatsApp de Malabo y Bata",
    passenger: "Pasajero",
    driver: "Taxista",
    requestRide: "Solicitar Viaje",
    history: "Historial",
    city: "Ciudad",
    pickup: "Punto de Recogida",
    destination: "Punto de Destino",
    serviceClass: "Clase de Servicio & Tarifa",
    shared: "Taxi Compartido (Giro)",
    special: "Carrera Especial (Privado)",
    airport: "Servicio Aeropuerto",
    propose: "Proponer Tarifa",
    orderViaWhatsapp: "Solicitar Taxi por WhatsApp",
    submitting: "Enviando...",
    estimatedPriceLabel: "Tarifa Estimada de la Carrera",
    proposedPriceLabel: "Tarifa Propuesta por Ti",
    selectedPriceLabel: "Tarifa Seleccionada por Ti",
    dataSaver: "Ahorro de Datos",
    routeValidation: "Validación de Ruta Real",
    activeRequests: "Solicitudes Activas",
    noHistory: "No tienes solicitudes registradas.",
    driverSettings: "Configuración de Conductor",
    copiarMensaje: "Copiar Mensaje 📋",
    copiado: "¡Copiado! 👍",
    tarifaEspecialDesc: "Selecciona o ajusta tu tarifa para esta carrera especial privada",
    tarifaAeropuertoDesc: "Selecciona o ajusta tu tarifa para el trayecto al aeropuerto",
    pagoEfectivo: "Pago en efectivo al conductor en Guinea Ecuatorial",
    solicitandoCon: "Solicitando con: ",
    howItWorksTitle: "¿Cómo funciona TaxiChat EG?",
    step1: "1. Elige tu barrio de partida y destino en Malabo o Bata.",
    step2: "2. Selecciona si deseas taxi compartido, carrera especial privada o proponer tu tarifa.",
    step3: "3. La app genera un mensaje formateado y te redirige a WhatsApp para despachar la carrera al taxista oficial asignado.",
    step4: "4. Simulamos la respuesta de conductores en tiempo real y te enviamos avisos visuales."
  },
  fr: {
    title: "TaxiChat EG",
    subtitle: "Répartiteur WhatsApp de Malabo et Bata",
    passenger: "Voyageur",
    driver: "Chauffeur",
    requestRide: "Demander un Trajet",
    history: "Historique",
    city: "Ville",
    pickup: "Point de Départ",
    destination: "Point de Destination",
    serviceClass: "Classe de Service & Tarif",
    shared: "Taxi Partagé (Giro)",
    special: "Course Spéciale (Privé)",
    airport: "Service Aéroport",
    propose: "Proposer un Tarif",
    orderViaWhatsapp: "Commander via WhatsApp",
    submitting: "Envoi en cours...",
    estimatedPriceLabel: "Tarif Estimé de la Course",
    proposedPriceLabel: "Tarif Proposé par Vous",
    selectedPriceLabel: "Tarif Sélectionné par Vous",
    dataSaver: "Économie de Données",
    routeValidation: "Validation de l'Itinéraire",
    activeRequests: "Demandes Actives",
    noHistory: "Vous n'avez pas de demandes enregistrées.",
    driverSettings: "Paramètres Chauffeur",
    copiarMensaje: "Copier le Message 📋",
    copiado: "Copié! 👍",
    tarifaEspecialDesc: "Sélectionnez ou ajustez votre tarif pour cette course spéciale privée",
    tarifaAeropuertoDesc: "Sélectionnez ou ajustez votre tarif pour le trajet de l'aéroport",
    pagoEfectivo: "Paiement en espèces au chauffeur en Guinée Équatoriale",
    solicitandoCon: "Demande avec : ",
    howItWorksTitle: "Comment fonctionne TaxiChat EG?",
    step1: "1. Choisissez votre quartier de départ et destination à Malabo ou Bata.",
    step2: "2. Sélectionnez si vous voulez un taxi partagé, une course privée ou proposer un tarif.",
    step3: "3. L'application génère un message formaté et vous redirige vers WhatsApp pour envoyer la course.",
    step4: "4. Nous simulons la réponse des chauffeurs en temps réel et envoyons des alertes visuelles."
  },
  en: {
    title: "TaxiChat EG",
    subtitle: "Malabo & Bata WhatsApp Dispatcher",
    passenger: "Passenger",
    driver: "Driver",
    requestRide: "Request Ride",
    history: "History",
    city: "City",
    pickup: "Pickup Point",
    destination: "Destination Point",
    serviceClass: "Service Class & Fare",
    shared: "Shared Taxi (Giro)",
    special: "Special Private Course",
    airport: "Airport Service",
    propose: "Propose Custom Price",
    orderViaWhatsapp: "Order via WhatsApp",
    submitting: "Submitting...",
    estimatedPriceLabel: "Estimated Fare",
    proposedPriceLabel: "Your Proposed Fare",
    selectedPriceLabel: "Your Selected Fare",
    dataSaver: "Data Saver",
    routeValidation: "Real Route Validation",
    activeRequests: "Active Requests",
    noHistory: "You have no registered requests.",
    driverSettings: "Driver Settings",
    copiarMensaje: "Copy Message 📋",
    copiado: "Copied! 👍",
    tarifaEspecialDesc: "Select or adjust your fare for this special private ride",
    tarifaAeropuertoDesc: "Select or adjust your fare for the airport trip",
    pagoEfectivo: "Cash payment to the driver in Equatorial Guinea",
    solicitandoCon: "Requesting with: ",
    howItWorksTitle: "How does TaxiChat EG work?",
    step1: "1. Choose your departure neighborhood and destination in Malabo or Bata.",
    step2: "2. Select whether you want a shared taxi, private course or propose your fare.",
    step3: "3. The app generates a formatted text message and redirects you to WhatsApp to dispatch.",
    step4: "4. We simulate driver acceptance in real-time and deliver desktop notifications."
  }
};

const DriverAvatar = ({ 
  avatar, 
  customUrl, 
  name = 'S', 
  className = "h-12 w-12 rounded-full border border-slate-200 object-cover shadow-sm" 
}: { 
  avatar?: string; 
  customUrl?: string; 
  name?: string; 
  className?: string; 
}) => {
  if (customUrl && customUrl.trim().length > 0) {
    return (
      <div className={`relative shrink-0 ${className}`}>
        <img 
          src={customUrl} 
          alt={name} 
          className="w-full h-full rounded-full object-cover border border-white/20 shadow-sm" 
          referrerPolicy="no-referrer"
          onError={(e) => {
            // If URL fails, display fallback overlay
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback-overlay') as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className="avatar-fallback-overlay hidden absolute inset-0 flex items-center justify-center rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 uppercase">
          {name ? name.charAt(0).toUpperCase() : 'T'}
        </div>
      </div>
    );
  }

  // Preset Avatars
  const initials = name ? name.charAt(0).toUpperCase() : 'T';
  
  let bgGradient = "from-amber-400 to-amber-600 text-slate-950";

  if (avatar === 'avatar-1') {
    bgGradient = "from-amber-400 to-amber-500 text-slate-950 font-black";
  } else if (avatar === 'avatar-2') {
    bgGradient = "from-emerald-500 to-teal-600 text-white font-black";
  } else if (avatar === 'avatar-3') {
    bgGradient = "from-sky-500 to-blue-600 text-white font-black";
  } else if (avatar === 'avatar-4') {
    bgGradient = "from-purple-500 to-indigo-600 text-white font-black";
  } else if (avatar === 'avatar-5') {
    bgGradient = "from-rose-500 to-orange-500 text-white font-black";
  } else if (avatar === 'avatar-6') {
    bgGradient = "from-slate-700 to-slate-950 text-amber-400 font-black";
  }

  return (
    <div className={`flex items-center justify-center shrink-0 rounded-full bg-gradient-to-br shadow-sm text-sm font-bold border border-white/20 select-none ${bgGradient} ${className.split(' ').filter(c => !c.startsWith('bg-') && !c.startsWith('text-')).join(' ')}`}>
      <span>{initials}</span>
    </div>
  );
};

export default function App() {
  // App Role Mode: passenger vs driver vs admin (for full interactive acceptance simulation)
  const [appRole, setAppRole] = useState<'passenger' | 'driver' | 'admin'>('passenger');

  // Input states
  const [phone, setPhone] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_phone') || '';
  });
  const [city, setCity] = useState<City>('Malabo');
  const [pickup, setPickup] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [serviceClass, setServiceClass] = useState<ServiceClass>('compartido');
  const [customDriverPhone, setCustomDriverPhone] = useState<string>('240222000111');
  const [isCustomDriver, setIsCustomDriver] = useState<boolean>(false);
  const [showDriverSettings, setShowDriverSettings] = useState<boolean>(false);
  const [customPrice, setCustomPrice] = useState<number>(1500);
  const [specialPrice, setSpecialPrice] = useState<number>(2500);
  const [aeropuertoPrice, setAeropuertoPrice] = useState<number>(5000);

  // New states
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>('normal');

  // Web Notifications API States
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const notifiedRequestsRef = useRef<Set<string>>(new Set());
  
  // Driver credentials (editable by driver in driver settings / driver view)
  const [driverVehicle, setDriverVehicle] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_driver_vehicle') || 'Toyota Corolla (Taxi)';
  });
  const [driverPlate, setDriverPlate] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_driver_plate') || 'M-4892-A';
  });

  // Driver personal profile states
  const [driverName, setDriverName] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_driver_name') || 'Santiago';
  });
  const [driverLastName, setDriverLastName] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_driver_lastname') || 'Nguema';
  });
  const [driverIdNumber, setDriverIdNumber] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_driver_id_number') || 'DIP-9402941';
  });
  const [driverAddress, setDriverAddress] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_driver_address') || 'Calle de la Independencia, Malabo';
  });
  const [driverAltPhone, setDriverAltPhone] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_driver_alt_phone') || '240555123456';
  });
  const [driverEmail, setDriverEmail] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_driver_email') || 'santiago.nguema@taxi-ge.com';
  });
  const [driverExperience, setDriverExperience] = useState<ExperienceLevel>(() => {
    return (localStorage.getItem('taxi_ge_driver_experience') as ExperienceLevel) || 'profesional';
  });

  const [driverVehicleColor, setDriverVehicleColor] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_driver_vehicle_color') || 'Blanco y Amarillo';
  });

  const [driverAvatar, setDriverAvatar] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_driver_avatar') || 'avatar-1';
  });

  const [driverAvatarUrl, setDriverAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_driver_avatar_url') || '';
  });

  // Prepaid balance and transaction history states for drivers to pre-pay commissions
  const [driverPrepaidBalance, setDriverPrepaidBalance] = useState<number>(() => {
    return Number(localStorage.getItem('taxi_ge_driver_prepaid_balance') || '0');
  });
  const [driverPrepaidTransactions, setDriverPrepaidTransactions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('taxi_ge_driver_prepaid_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wallpaper and main screen card style customization states
  const [wallpaper, setWallpaper] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_wallpaper') || 'solid-light';
  });
  const [cardStyle, setCardStyle] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_card_style') || 'glassmorphism';
  });
  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_accent_color') || 'emerald';
  });
  const [themeFont, setThemeFont] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_theme_font') || 'sans';
  });
  const [layoutDensity, setLayoutDensity] = useState<string>(() => {
    return localStorage.getItem('taxi_ge_layout_density') || 'spacious';
  });

  // Driver Availability State ('Disponible' vs 'Ocupado/Desconectado')
  const [driverAvailable, setDriverAvailable] = useState<boolean>(() => {
    return localStorage.getItem('taxi_ge_driver_available') !== 'false';
  });

  // Driver Terms and Conditions States
  const [driverTermsAccepted, setDriverTermsAccepted] = useState<boolean>(() => {
    return localStorage.getItem('taxi_ge_driver_terms_accepted') === 'true';
  });
  const [driverCommissionContractAccepted, setDriverCommissionContractAccepted] = useState<boolean>(() => {
    return localStorage.getItem('taxi_ge_driver_commission_accepted') === 'true';
  });
  const [termsModalStep, setTermsModalStep] = useState<'rules' | 'commission'>('rules');
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  // States for Driver Prepayment Simulation Modals
  const [showPrepayModal, setShowPrepayModal] = useState<boolean>(false);
  const [prepayAmount, setPrepayAmount] = useState<number>(500);
  const [customPrepayInput, setCustomPrepayInput] = useState<string>('');
  const [isPrepayProcessing, setIsPrepayProcessing] = useState<boolean>(false);

  // Price Negotiation / Counteroffer States
  const [suggestingPriceForTripId, setSuggestingPriceForTripId] = useState<string | null>(null);
  const [suggestedPriceInput, setSuggestedPriceInput] = useState<string>('');

  // Simulated Muni Dinero transaction history
  const [muniTransfers, setMuniTransfers] = useState<Array<{ id: string; timestamp: string; amount: number; referenceTrip: string }>>(() => {
    const saved = localStorage.getItem('taxi_ge_muni_transfers');
    return saved ? JSON.parse(saved) : [];
  });
  const [muniTransferAlert, setMuniTransferAlert] = useState<{ amount: number; reference: string; date: string } | null>(null);

  // Administrative and Commissions states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('taxi_ge_admin_logged_in') === 'true';
  });

  const isUserAdmin = () => {
    const cleanPassenger = (phone || '').replace(/\D/g, '');
    const cleanDriver = (driverAltPhone || '').replace(/\D/g, '');
    const adminPhones = ['222111222', '240222111222', '999999999', '240999999999'];
    return isAdminLoggedIn || adminPhones.includes(cleanPassenger) || adminPhones.includes(cleanDriver);
  };

  // Restrict access to admin role and redirect to passenger if unauthorized
  useEffect(() => {
    if (appRole === 'admin' && !isUserAdmin()) {
      setAppRole('passenger');
    }
  }, [appRole, phone, driverAltPhone, isAdminLoggedIn]);

  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminPinInput, setAdminPinInput] = useState<string>('');
  const [adminPinError, setAdminPinError] = useState<string>('');
  const [adminTab, setAdminTab] = useState<'overview' | 'drivers' | 'ledger' | 'users'>('overview');
  const [commissions, setCommissions] = useState<DriverCommission[]>([]);
  
  // New States for Driver Verification & Safety Controls
  const [verificationSubTab, setVerificationSubTab] = useState<'finance' | 'compliance'>('compliance');
  const [selectedVerificationDriverId, setSelectedVerificationDriverId] = useState<string | null>('DRV-102'); // Defaults to Antonio Ondo who is pending
  const [complianceSearchQuery, setComplianceSearchQuery] = useState<string>('');
  const [complianceCityFilter, setComplianceCityFilter] = useState<'all' | 'Malabo' | 'Bata'>('all');
  const [complianceStatusFilter, setComplianceStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected' | 'no_submitted'>('all');
  const [customRejectReason, setCustomRejectReason] = useState<string>('');
  const [inspectionChecks, setInspectionChecks] = useState<string[]>(['pintura', 'matricula', 'luces']);
  
  const isDarkTheme = () => {
    return wallpaper === 'gradient-midnight' || wallpaper === 'solid-dark' || wallpaper === 'retro-glass';
  };

  const getFontRootClass = () => {
    switch (themeFont) {
      case 'mono':
        return 'font-mono text-[13px]';
      case 'serif':
        return 'font-serif';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  // Accent color mapping helpers
  const getAccentBgClass = (shade: '50' | '100' | '500' | '600' | '700' | '800' | '900') => {
    const mapping: Record<string, Record<string, string>> = {
      emerald: {
        '50': 'bg-emerald-50',
        '100': 'bg-emerald-100',
        '500': 'bg-emerald-500',
        '600': 'bg-emerald-600',
        '700': 'bg-emerald-700',
        '800': 'bg-emerald-800',
        '900': 'bg-emerald-900',
      },
      indigo: {
        '50': 'bg-indigo-50',
        '100': 'bg-indigo-100',
        '500': 'bg-indigo-500',
        '600': 'bg-indigo-600',
        '700': 'bg-indigo-700',
        '800': 'bg-indigo-800',
        '900': 'bg-indigo-900',
      },
      amber: {
        '50': 'bg-amber-50',
        '100': 'bg-amber-100',
        '500': 'bg-amber-500',
        '600': 'bg-amber-600',
        '700': 'bg-amber-700',
        '800': 'bg-amber-800',
        '900': 'bg-amber-900',
      },
      rose: {
        '50': 'bg-rose-50',
        '100': 'bg-rose-100',
        '500': 'bg-rose-500',
        '600': 'bg-rose-600',
        '700': 'bg-rose-700',
        '800': 'bg-rose-800',
        '900': 'bg-rose-900',
      },
      violet: {
        '50': 'bg-violet-50',
        '100': 'bg-violet-100',
        '500': 'bg-violet-500',
        '600': 'bg-violet-600',
        '700': 'bg-violet-700',
        '800': 'bg-violet-800',
        '900': 'bg-violet-900',
      },
    };
    return mapping[accentColor]?.[shade] || mapping.emerald[shade];
  };

  const getAccentTextClass = (shade: '500' | '600' | '700' | '800') => {
    const mapping: Record<string, Record<string, string>> = {
      emerald: {
        '500': 'text-emerald-500',
        '600': 'text-emerald-600',
        '700': 'text-emerald-700',
        '800': 'text-emerald-800',
      },
      indigo: {
        '500': 'text-indigo-500',
        '600': 'text-indigo-600',
        '700': 'text-indigo-700',
        '800': 'text-indigo-800',
      },
      amber: {
        '505': 'text-amber-500',
        '500': 'text-amber-500',
        '600': 'text-amber-600',
        '700': 'text-amber-700',
        '800': 'text-amber-800',
      },
      rose: {
        '500': 'text-rose-500',
        '600': 'text-rose-600',
        '700': 'text-rose-700',
        '800': 'text-rose-800',
      },
      violet: {
        '500': 'text-violet-500',
        '600': 'text-violet-600',
        '700': 'text-violet-700',
        '800': 'text-violet-800',
      },
    };
    return mapping[accentColor]?.[shade] || mapping.emerald[shade];
  };

  const getAccentBorderClass = (shade: '100' | '200' | '500' | '600') => {
    const mapping: Record<string, Record<string, string>> = {
      emerald: {
        '100': 'border-emerald-100',
        '200': 'border-emerald-200',
        '500': 'border-emerald-500',
        '600': 'border-emerald-600',
      },
      indigo: {
        '100': 'border-indigo-100',
        '200': 'border-indigo-200',
        '500': 'border-indigo-500',
        '600': 'border-indigo-600',
      },
      amber: {
        '100': 'border-amber-100',
        '200': 'border-amber-200',
        '500': 'border-amber-500',
        '600': 'border-amber-600',
      },
      rose: {
        '100': 'border-rose-100',
        '200': 'border-rose-200',
        '500': 'border-rose-500',
        '600': 'border-rose-600',
      },
      violet: {
        '100': 'border-violet-100',
        '200': 'border-violet-200',
        '500': 'border-violet-500',
        '600': 'border-violet-600',
      },
    };
    return mapping[accentColor]?.[shade] || mapping.emerald[shade];
  };

  const getAccentRingClass = () => {
    const mapping: Record<string, string> = {
      emerald: 'focus:ring-emerald-500 focus:border-emerald-500 ring-emerald-500/20',
      indigo: 'focus:ring-indigo-500 focus:border-indigo-500 ring-indigo-500/20',
      amber: 'focus:ring-amber-500 focus:border-amber-500 ring-amber-500/20',
      rose: 'focus:ring-rose-500 focus:border-rose-500 ring-rose-500/20',
      violet: 'focus:ring-violet-500 focus:border-violet-500 ring-violet-500/20',
    };
    return mapping[accentColor] || mapping.emerald;
  };

  // Helper to get card style classes dynamically
  const getCardStyleClass = () => {
    const isDark = isDarkTheme();
    const roundedClass = layoutDensity === 'compact' ? 'rounded-xl' : 'rounded-3xl';
    
    // 1. RETRO TERMINAL (Overriding standard behavior)
    if (cardStyle === 'retro-terminal') {
      return `bg-black text-green-400 border border-green-500 font-mono shadow-[0_0_15px_rgba(34,197,94,0.3)] ${roundedClass}`;
    }
    
    // 2. SOFT CLAY (Custom 3D tactile appearance)
    if (cardStyle === 'soft-clay') {
      if (isDark) {
        return `bg-slate-800 text-slate-100 border border-slate-700 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.05),inset_-2px_-2px_5px_rgba(0,0,0,0.5),4px_4px_10px_rgba(0,0,0,0.4)] ${roundedClass}`;
      } else {
        return `bg-slate-100 text-slate-850 border border-slate-200/60 shadow-[inset_3px_3px_6px_rgba(255,255,255,0.8),inset_-3px_-3px_6px_rgba(0,0,0,0.06),5px_5px_12px_rgba(0,0,0,0.05)] ${roundedClass}`;
      }
    }
    
    // 3. GLASSMORPHISM
    if (cardStyle === 'glassmorphism') {
      if (isDark) {
        return `glassmorphism-dark text-slate-100 border border-white/8 backdrop-blur-md shadow-lg ${roundedClass}`;
      } else {
        return `glassmorphism text-slate-800 border border-white/45 backdrop-blur-md shadow-xs ${roundedClass}`;
      }
    }
    
    // 4. NEOBRUTALISM
    if (cardStyle === 'neobrutalism') {
      if (isDark) {
        return `bg-slate-900 text-slate-100 border-2 border-slate-200 shadow-[4px_4px_0px_0px_rgba(248,250,252,1)] ${roundedClass}`;
      } else {
        return `bg-white text-slate-800 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${roundedClass}`;
      }
    }
    
    // 5. MINIMALIST
    if (cardStyle === 'minimalist') {
      if (isDark) {
        return `bg-slate-900/60 text-slate-100 border border-slate-800/80 shadow-none ${roundedClass}`;
      } else {
        return `bg-white/85 text-slate-850 border border-slate-150 shadow-none ${roundedClass}`;
      }
    }
    
    // 6. SOFT SHADOWS (default)
    if (isDark) {
      return `bg-slate-900/90 text-slate-100 border border-slate-800/60 shadow-lg shadow-black/30 ${roundedClass}`;
    } else {
      return `bg-white text-slate-800 border border-slate-100/80 shadow-md ${roundedClass}`;
    }
  };

  // Registered users states (passengers and drivers)
  const [registeredPassengers, setRegisteredPassengers] = useState<RegisteredPassenger[]>(() => {
    const saved = localStorage.getItem('taxi_ge_registered_passengers_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing registered passengers', e);
      }
    }
    // Default seed data for passengers in EG
    return [
      { id: 'PAS-201', name: 'Mariana', lastName: 'Ndong', phone: '240222111333', city: 'Malabo', registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), tripsCount: 14 },
      { id: 'PAS-202', name: 'Juan', lastName: 'Mba', phone: '240555888222', city: 'Bata', registeredAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), tripsCount: 8 },
      { id: 'PAS-203', name: 'Diosdado', lastName: 'Nguema', phone: '240222333444', city: 'Malabo', registeredAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), tripsCount: 21 },
      { id: 'PAS-204', name: 'Consuelo', lastName: 'Obiang', phone: '240555312102', city: 'Malabo', registeredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), tripsCount: 32 },
      { id: 'PAS-205', name: 'Teresa', lastName: 'Mangue', phone: '240222444555', city: 'Bata', registeredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), tripsCount: 5 },
      { id: 'PAS-206', name: 'Crispín', lastName: 'Ondo', phone: '240555999000', city: 'Malabo', registeredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), tripsCount: 2 }
    ];
  });

  const [registeredDrivers, setRegisteredDrivers] = useState<RegisteredDriver[]>(() => {
    const saved = localStorage.getItem('taxi_ge_registered_drivers_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing registered drivers', e);
      }
    }
    // Default seed data for drivers in EG with detailed verification states
    return [
      { 
        id: 'DRV-101', 
        name: 'Santiago', 
        lastName: 'Nguema', 
        phone: '240222000111', 
        city: 'Malabo', 
        vehiclePlate: 'M-4892-A', 
        vehicleType: 'Toyota Corolla (Taxi)', 
        registeredAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), 
        status: 'activo',
        verificationStatus: 'verified',
        backgroundCheckStatus: 'passed',
        vehicleInspectionStatus: 'passed',
        documents: {
          dip: { status: 'verified', docNumber: 'DIP-390124', expiryDate: '2029-12-10' },
          license: { status: 'verified', docNumber: 'LC-20491-GE', expiryDate: '2028-05-24' },
          permit: { status: 'verified', docNumber: 'MUN-MAL-4821', expiryDate: '2027-01-15' }
        }
      },
      { 
        id: 'DRV-102', 
        name: 'Antonio', 
        lastName: 'Ondo', 
        phone: '240222000222', 
        city: 'Bata', 
        vehiclePlate: 'B-9011-B', 
        vehicleType: 'Hyundai Elantra', 
        registeredAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(), 
        status: 'activo',
        verificationStatus: 'pending',
        backgroundCheckStatus: 'pending',
        vehicleInspectionStatus: 'pending',
        documents: {
          dip: { status: 'pending', docNumber: 'DIP-891044', expiryDate: '2031-03-12' },
          license: { status: 'pending', docNumber: 'LC-11029-GE', expiryDate: '2026-11-05' },
          permit: { status: 'empty' }
        }
      },
      { 
        id: 'DRV-103', 
        name: 'Manuel', 
        lastName: 'Mangue', 
        phone: '240555123456', 
        city: 'Malabo', 
        vehiclePlate: 'M-7711-X', 
        vehicleType: 'Toyota RAV4', 
        registeredAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), 
        status: 'activo',
        verificationStatus: 'verified',
        backgroundCheckStatus: 'passed',
        vehicleInspectionStatus: 'passed',
        documents: {
          dip: { status: 'verified', docNumber: 'DIP-551029', expiryDate: '2030-08-19' },
          license: { status: 'verified', docNumber: 'LC-99014-GE', expiryDate: '2029-10-30' },
          permit: { status: 'verified', docNumber: 'MUN-MAL-1109', expiryDate: '2026-12-31' }
        }
      },
      { 
        id: 'DRV-104', 
        name: 'Crispín', 
        lastName: 'Mba', 
        phone: '240222000333', 
        city: 'Bata', 
        vehiclePlate: 'B-8812-C', 
        vehicleType: 'Suzuki Swift', 
        registeredAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), 
        status: 'activo',
        verificationStatus: 'rejected',
        rejectedReason: 'La Licencia de Conducir cargada expiró en febrero de 2026 y presenta enmiendas no autorizadas.',
        backgroundCheckStatus: 'passed',
        vehicleInspectionStatus: 'failed',
        documents: {
          dip: { status: 'verified', docNumber: 'DIP-401924', expiryDate: '2028-09-14' },
          license: { status: 'rejected', docNumber: 'LC-00214-GE', expiryDate: '2026-02-14', rejectedReason: 'Licencia expirada y con tachaduras.' },
          permit: { status: 'pending', docNumber: 'MUN-BAT-8831', expiryDate: '2026-12-25' }
        }
      },
      { 
        id: 'DRV-105', 
        name: 'Severo', 
        lastName: 'Obiang', 
        phone: '240555888111', 
        city: 'Malabo', 
        vehiclePlate: 'M-5522-Y', 
        vehicleType: 'Toyota Yaris', 
        registeredAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), 
        status: 'activo',
        verificationStatus: 'pending',
        backgroundCheckStatus: 'passed',
        vehicleInspectionStatus: 'pending',
        documents: {
          dip: { status: 'verified', docNumber: 'DIP-129031', expiryDate: '2032-11-20' },
          license: { status: 'pending', docNumber: 'LC-55912-GE', expiryDate: '2027-04-12' },
          permit: { status: 'empty' }
        }
      }
    ];
  });

  // Persist registered users on change
  useEffect(() => {
    localStorage.setItem('taxi_ge_registered_passengers_v1', JSON.stringify(registeredPassengers));
  }, [registeredPassengers]);

  useEffect(() => {
    localStorage.setItem('taxi_ge_registered_drivers_v1', JSON.stringify(registeredDrivers));
  }, [registeredDrivers]);

  // Store lists of suspended drivers
  const [suspendedDriverPlates, setSuspendedDriverPlates] = useState<string[]>(() => {
    const saved = localStorage.getItem('taxi_ge_suspended_drivers');
    return saved ? JSON.parse(saved) : [];
  });

  // Simulation and search states for the Admin Growth/Users tab
  const [simUserRole, setSimUserRole] = useState<'passenger' | 'driver'>('passenger');
  const [simUserName, setSimUserName] = useState<string>('');
  const [simUserLastName, setSimUserLastName] = useState<string>('');
  const [simUserPhone, setSimUserPhone] = useState<string>('');
  const [simUserCity, setSimUserCity] = useState<City>('Malabo');
  const [simUserVehicleType, setSimUserVehicleType] = useState<string>('Toyota Corolla');
  const [simUserVehiclePlate, setSimUserVehiclePlate] = useState<string>('');
  
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [userFilterRole, setUserFilterRole] = useState<'all' | 'passenger' | 'driver'>('all');
  const [userFilterCity, setUserFilterCity] = useState<'all' | 'Malabo' | 'Bata'>('all');

  // Client rating state variables
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [ratingText, setRatingText] = useState<string>('');
  const [ratingSubmittingFor, setRatingSubmittingFor] = useState<string | null>(null);

  // Language selection state
  const [language, setLanguage] = useState<'es' | 'fr' | 'en'>(() => {
    return (localStorage.getItem('taxi_ge_language') as any) || 'es';
  });

  // Data Saver mode state
  const [dataSaver, setDataSaver] = useState<boolean>(() => {
    return localStorage.getItem('taxi_ge_data_saver') === 'true';
  });

  // Translation helper function
  const t = (key: keyof typeof TRANSLATIONS['es']) => {
    return TRANSLATIONS[language][key] || TRANSLATIONS['es'][key];
  };

  // Sounds state
  const [soundsEnabled, setSoundsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('taxi_ge_sounds_enabled') !== 'false';
  });

  // Sound playback helper using pure Web Audio API synthesis (zero external files)
  const playNotificationSound = (type: 'new' | 'success' | 'alert') => {
    if (!soundsEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (type === 'new') {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        gain1.gain.setValueAtTime(0.08, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.15);

        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(880, ctx.currentTime); // A5
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          gain2.gain.setValueAtTime(0.08, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.25);
        }, 120);
      } else if (type === 'success') {
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((f, idx) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
          }, idx * 75);
        });
      } else if (type === 'alert') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(330, ctx.currentTime); // E4
        osc.frequency.linearRampToValueAtTime(165, ctx.currentTime + 0.35); // downward sweep
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (err) {
      console.warn('Audio Context playback blocked or unavailable', err);
    }
  };

  // Web Notifications permission request helper
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') {
          // Send a friendly verification notification
          try {
            new Notification('TaxiChat EG 🚖', {
              body: '¡Notificaciones activadas correctamente! Te avisaremos cuando tu taxista acepte el viaje.',
              icon: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png'
            });
          } catch (e) {
            console.warn('Error displaying initial notification', e);
          }
          setStatus('Avisos visuales de escritorio activados correctamente.');
          setStatusType('success');
        } else if (permission === 'denied') {
          setStatus('Has denegado las notificaciones. Por favor, restablécelas en el candado de la barra de direcciones.');
          setStatusType('error');
        }
      } catch (err) {
        console.error('Error requesting notification permission', err);
      }
    } else {
      setStatus('Tu navegador no es compatible con las notificaciones del sistema.');
      setStatusType('error');
    }
  };

  // CSV Report Exporter Helper
  const exportHistoryReport = () => {
    if (requestHistory.length === 0) {
      alert('No hay solicitudes de viaje registradas en el historial para exportar.');
      return;
    }
    const headers = [
      'ID de Viaje', 'Ciudad', 'Fecha y Hora', 'Origen', 'Destino', 'Categoria', 
      'Pasajeros', 'Urgencia', 'Distancia (KM)', 'Duracion (Min)', 'Tarifa (FCFA)', 
      'Estado', 'Telefono Cliente', 'Conductor Asignado', 'ID Conductor', 'Vehiculo', 'Matricula'
    ];
    const rows = requestHistory.map(req => [
      req.id,
      req.city,
      new Date(req.timestamp).toLocaleString('es-ES'),
      `"${req.pickup.replace(/"/g, '""')}"`,
      `"${req.destination.replace(/"/g, '""')}"`,
      req.serviceClass,
      req.passengers || 1,
      req.urgency || 'normal',
      req.distanceKm || 0,
      req.durationMin || 0,
      req.estimatedPrice,
      req.status === 'pending' ? 'Pendiente' :
      req.status === 'accepted' ? 'Aceptado' :
      req.status === 'cancelled_by_passenger' ? 'Cancelado por Pasajero' : 'Cancelado por Conductor',
      `+${req.phone}`,
      req.driverName ? `"${req.driverName} ${req.driverLastName}"` : '"Central / Desconocido"',
      req.driverIdNumber || 'N/A',
      req.vehicleType || 'N/A',
      req.vehiclePlate || 'N/A'
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = `Reporte_TaxiGE_Guinea_Ecuatorial_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setStatus('Se ha descargado tu reporte oficial de carreras en formato CSV para Excel.');
    setStatusType('success');
    playNotificationSound('success');
  };

  // Active simulated request tracking
  const [activeRequestId, setActiveRequestId] = useState<string | null>(() => {
    return localStorage.getItem('taxi_ge_active_request_id') || null;
  });

  // PWA installation states & listeners
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(true);
  const [installStepView, setInstallStepView] = useState<'none' | 'android' | 'ios'>('none');

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setStatus('¡Enhorabuena! Taxi GE se ha instalado en tu teléfono con éxito. 🎉');
      setStatusType('success');
      playNotificationSound('success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      // Show Android custom manual guide
      setInstallStepView('android');
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA installation outcome: ${outcome}`);
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error('Error triggering PWA prompt:', err);
      setInstallStepView('android');
    }
  };


  // Status & lists
  const [status, setStatus] = useState<string>('Esperando solicitud...');
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');
  const [requestHistory, setRequestHistory] = useState<TaxiRequest[]>([]);
  const activeRequest = activeRequestId 
    ? requestHistory.find(r => r.id === activeRequestId) 
    : null;
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'request' | 'history'>('request');
  const [activeDriverTab, setActiveDriverTab] = useState<'requests' | 'profile' | 'heatmap' | 'reports'>('requests');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(true);

  // Auto-suggestions states
  const [showPickupSuggestions, setShowPickupSuggestions] = useState<boolean>(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState<boolean>(false);

  // GPS Navigation simulation state
  const [showGpsNavigatorFor, setShowGpsNavigatorFor] = useState<string | null>(null);

  // Passenger Cancellation Confirmation State
  const [showCancelConfirmFor, setShowCancelConfirmFor] = useState<string | null>(null);

  // Initialize and load from local storage with realistic default seeding
  useEffect(() => {
    const savedHistory = localStorage.getItem('taxi_ge_history');
    const savedCommissions = localStorage.getItem('taxi_ge_commissions_v2');
    
    let historyData: TaxiRequest[] = [];
    let commissionsData: DriverCommission[] = [];

    if (savedHistory) {
      try {
        historyData = JSON.parse(savedHistory);
      } catch (e) {
        console.error('Error parsing request history', e);
      }
    }

    if (savedCommissions) {
      try {
        commissionsData = JSON.parse(savedCommissions);
      } catch (e) {
        console.error('Error parsing commissions', e);
      }
    }

    // If both are empty, let's seed realistic data to make the app functional on first load!
    if (historyData.length === 0 && commissionsData.length === 0) {
      // Helper to generate ISO dates relative to now (July 7, 2026)
      const daysAgo = (d: number) => {
        const date = new Date();
        date.setDate(date.getDate() - d);
        return date.toISOString();
      };

      const hoursAgo = (h: number) => {
        const date = new Date();
        date.setHours(date.getHours() - h);
        return date.toISOString();
      };

      // Seed history
      historyData = [
        {
          id: 'REQ-101',
          phone: '240555312102',
          pickup: 'Paraíso, Malabo',
          destination: 'Ela Nguema, Malabo',
          city: 'Malabo',
          serviceClass: 'compartido',
          driverPhone: '240222000111',
          timestamp: daysAgo(10),
          estimatedPrice: 1000,
          passengers: 1,
          urgency: 'normal',
          distanceKm: 3.2,
          durationMin: 12,
          driverName: 'Santiago',
          driverLastName: 'Nguema',
          vehicleType: 'Toyota Corolla',
          vehiclePlate: 'M-4892-A',
          status: 'completed',
          paymentStatus: 'paid',
          completedAt: daysAgo(10),
          rating: 5,
          ratingComment: 'Excelente servicio, muy puntual.'
        },
        {
          id: 'REQ-102',
          phone: '240222111333',
          pickup: 'Ngolo, Bata',
          destination: 'Comandachina, Bata',
          city: 'Bata',
          serviceClass: 'especial',
          driverPhone: '240222000222',
          timestamp: daysAgo(6),
          estimatedPrice: 2000,
          passengers: 1,
          urgency: 'normal',
          distanceKm: 5.1,
          durationMin: 18,
          driverName: 'Antonio',
          driverLastName: 'Ondo',
          vehicleType: 'Hyundai Elantra',
          vehiclePlate: 'B-9011-B',
          status: 'completed',
          paymentStatus: 'paid',
          completedAt: daysAgo(6),
          rating: 4,
          ratingComment: 'Buen conductor.'
        },
        {
          id: 'REQ-103',
          phone: '240333444555',
          pickup: 'Caracolas, Malabo',
          destination: 'Semu, Malabo',
          city: 'Malabo',
          serviceClass: 'compartido',
          driverPhone: '240555123456',
          timestamp: daysAgo(3), // 72 hours ago
          estimatedPrice: 1500,
          passengers: 1,
          urgency: 'urgente',
          distanceKm: 4.5,
          durationMin: 15,
          driverName: 'Manuel',
          driverLastName: 'Mangue',
          vehicleType: 'Toyota RAV4',
          vehiclePlate: 'M-7711-X',
          status: 'completed',
          paymentStatus: 'pending',
          completedAt: daysAgo(3)
        },
        {
          id: 'REQ-104',
          phone: '240555312102',
          pickup: 'Perez, Malabo',
          destination: 'Buena Esperanza, Malabo',
          city: 'Malabo',
          serviceClass: 'compartido',
          driverPhone: '240222000111',
          timestamp: hoursAgo(5),
          estimatedPrice: 1000,
          passengers: 1,
          urgency: 'normal',
          distanceKm: 2.8,
          durationMin: 10,
          driverName: 'Santiago',
          driverLastName: 'Nguema',
          vehicleType: 'Toyota Corolla',
          vehiclePlate: 'M-4892-A',
          status: 'completed',
          paymentStatus: 'pending',
          completedAt: hoursAgo(5)
        },
        {
          id: 'REQ-105',
          phone: '240333444555',
          pickup: 'Airport Malabo',
          destination: 'Paraíso, Malabo',
          city: 'Malabo',
          serviceClass: 'aeropuerto',
          driverPhone: '240555123456',
          timestamp: daysAgo(12),
          estimatedPrice: 5000,
          passengers: 2,
          urgency: 'normal',
          distanceKm: 8.4,
          durationMin: 22,
          driverName: 'Manuel',
          driverLastName: 'Mangue',
          vehicleType: 'Toyota RAV4',
          vehiclePlate: 'M-7711-X',
          status: 'completed',
          paymentStatus: 'paid',
          completedAt: daysAgo(12),
          rating: 5
        }
      ];

      // Seed matching commissions (each is exactly 50 XAF)
      commissionsData = [
        {
          id: 'COMM-101',
          tripId: 'REQ-101',
          driverName: 'Santiago',
          driverLastName: 'Nguema',
          driverPhone: '240222000111',
          driverPlate: 'M-4892-A',
          pickup: 'Paraíso, Malabo',
          destination: 'Ela Nguema, Malabo',
          tripPrice: 1000,
          commissionAmount: 50,
          createdAt: daysAgo(10),
          status: 'paid',
          paidAt: daysAgo(9),
          dueDate: new Date(new Date(daysAgo(10)).getTime() + 48 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'COMM-102',
          tripId: 'REQ-102',
          driverName: 'Antonio',
          driverLastName: 'Ondo',
          driverPhone: '240222000222',
          driverPlate: 'B-9011-B',
          pickup: 'Ngolo, Bata',
          destination: 'Comandachina, Bata',
          tripPrice: 2000,
          commissionAmount: 50,
          createdAt: daysAgo(6),
          status: 'paid',
          paidAt: daysAgo(6),
          dueDate: new Date(new Date(daysAgo(6)).getTime() + 48 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'COMM-103',
          tripId: 'REQ-103',
          driverName: 'Manuel',
          driverLastName: 'Mangue',
          driverPhone: '240555123456',
          driverPlate: 'M-7711-X',
          pickup: 'Caracolas, Malabo',
          destination: 'Semu, Malabo',
          tripPrice: 1500,
          commissionAmount: 50,
          createdAt: daysAgo(3), // Vencido (> 48 horas)
          status: 'pending',
          dueDate: new Date(new Date(daysAgo(3)).getTime() + 48 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'COMM-104',
          tripId: 'REQ-104',
          driverName: 'Santiago',
          driverLastName: 'Nguema',
          driverPhone: '240222000111',
          driverPlate: 'M-4892-A',
          pickup: 'Perez, Malabo',
          destination: 'Buena Esperanza, Malabo',
          tripPrice: 1000,
          commissionAmount: 50,
          createdAt: hoursAgo(5), // No vencido aún
          status: 'pending',
          dueDate: new Date(new Date(hoursAgo(5)).getTime() + 48 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'COMM-105',
          tripId: 'REQ-105',
          driverName: 'Manuel',
          driverLastName: 'Mangue',
          driverPhone: '240555123456',
          driverPlate: 'M-7711-X',
          pickup: 'Airport Malabo',
          destination: 'Paraíso, Malabo',
          tripPrice: 5000,
          commissionAmount: 50,
          createdAt: daysAgo(12),
          status: 'paid',
          paidAt: daysAgo(11),
          dueDate: new Date(new Date(daysAgo(12)).getTime() + 48 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Save seed values
      localStorage.setItem('taxi_ge_history', JSON.stringify(historyData));
      localStorage.setItem('taxi_ge_commissions_v2', JSON.stringify(commissionsData));
    }

    setRequestHistory(historyData);
    setCommissions(commissionsData);
  }, []);

  // Sync phone to local storage for convenience
  useEffect(() => {
    localStorage.setItem('taxi_ge_phone', phone);
  }, [phone]);

  // Sync driver availability to local storage
  useEffect(() => {
    localStorage.setItem('taxi_ge_driver_available', String(driverAvailable));
  }, [driverAvailable]);

  // Handle city changes to update default driver phone
  useEffect(() => {
    if (!isCustomDriver) {
      const defaultDriver = DEFAULT_DRIVERS.find(d => d.name.includes(city));
      if (defaultDriver) {
        setCustomDriverPhone(defaultDriver.phone);
      }
    }
  }, [city, isCustomDriver]);

  // Register existing non-pending requests in the notified set on initial load
  useEffect(() => {
    if (requestHistory.length > 0) {
      requestHistory.forEach(req => {
        if (req.status !== 'pending') {
          notifiedRequestsRef.current.add(req.id);
        }
      });
    }
  }, [requestHistory.length === 0]);

  // Watch request status changes and trigger Web Notifications
  useEffect(() => {
    // Find requests in history that are accepted but NOT in our notified set
    const newlyAccepted = requestHistory.filter(req => req.status === 'accepted' && !notifiedRequestsRef.current.has(req.id));
    
    newlyAccepted.forEach(req => {
      notifiedRequestsRef.current.add(req.id);
      
      // Play a custom sound if allowed
      playNotificationSound('success');

      // Trigger Web Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const title = '¡Viaje Aceptado! 🚖';
        const body = `Tu taxi de ${req.pickup} a ${req.destination} ha sido confirmado por ${req.driverName || 'Santiago'} (${req.vehicleType || 'Toyota Corolla'}). Matrícula: ${req.vehiclePlate || 'M-4892-A'}`;
        
        try {
          const notification = new Notification(title, {
            body,
            icon: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
            tag: req.id,
            requireInteraction: true
          });
          
          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        } catch (e) {
          console.warn('Error displaying background browser notification', e);
        }
      }
    });
  }, [requestHistory]);

  // Auto-simulate driver acceptance for passenger requests in the background
  useEffect(() => {
    const pendingRequest = requestHistory.find(req => req.status === 'pending');
    if (!pendingRequest) return;

    // Only auto-simulate if the app role is set to passenger (so driver is someone else)
    if (appRole === 'passenger') {
      const timer = setTimeout(() => {
        const selectedDriver = DEFAULT_DRIVERS.find(d => d.name.includes(pendingRequest.city)) || DEFAULT_DRIVERS[0];
        
        // Update request history with accepted status
        const updated = requestHistory.map(req => {
          if (req.id === pendingRequest.id) {
            return {
              ...req,
              status: 'accepted' as const,
              vehicleType: pendingRequest.serviceClass === 'aeropuerto' ? 'Toyota RAV4 (SUV)' : 'Toyota Corolla (Taxi)',
              vehiclePlate: pendingRequest.city === 'Malabo' ? 'M-4892-A' : 'B-7721-C',
              driverName: pendingRequest.city === 'Malabo' ? 'Santiago' : 'Marcos',
              driverLastName: pendingRequest.city === 'Malabo' ? 'Nguema' : 'Esono',
              driverExperience: 'profesional' as const,
              driverAltPhone: selectedDriver.phone,
              acceptedAt: new Date().toISOString()
            };
          }
          return req;
        });

        setRequestHistory(updated);
        localStorage.setItem('taxi_ge_history', JSON.stringify(updated));
        setStatus('¡Tu solicitud ha sido aceptada por un taxista cercano! 🚖');
        setStatusType('success');
      }, 7000); // 7 seconds delay to let the user check out WhatsApp first

      return () => clearTimeout(timer);
    }
  }, [requestHistory, appRole]);

  // Selected Service configuration
  const currentService = SERVICES.find(s => s.id === serviceClass) || SERVICES[0];

  // Generate WhatsApp text content
  const generateMessage = (
    pickupVal = pickup, 
    destVal = destination, 
    serviceClassVal = serviceClass,
    passengersVal = passengersCount,
    urgencyVal = urgencyLevel
  ) => {
    const selectedService = SERVICES.find(s => s.id === serviceClassVal) || SERVICES[0];
    const finalPrice = serviceClassVal === 'propuesta' 
      ? customPrice 
      : serviceClassVal === 'especial'
        ? specialPrice
        : serviceClassVal === 'aeropuerto'
          ? aeropuertoPrice
          : selectedService.price;
    const formattedDate = new Date().toLocaleString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const { km, min } = calculateDistance(pickupVal, destVal);
    const urgencyLabels: Record<UrgencyLevel, string> = {
      normal: 'Normal 🟢',
      intermedio: 'Prisa Intermedia 🟡',
      urgente: 'Urgente 🔴',
      muy_urgente: 'Muy Urgente 🔥'
    };

    const labelTarifa = serviceClassVal === 'propuesta' 
      ? 'Tarifa propuesta' 
      : (serviceClassVal === 'especial' || serviceClassVal === 'aeropuerto')
        ? 'Tarifa seleccionada'
        : 'Tarifa estimada';

    return `Solicitud de viaje 🚖
----------------------------------
• Ciudad: ${city}
• Origen: ${pickupVal}
• Destino: ${destVal}
• Distancia: ${km > 0 ? `${km} km (~${min} min)` : 'No especificada'}
• Pasajeros: ${passengersVal} ${passengersVal === 1 ? 'persona' : 'personas'}
• Urgencia: ${urgencyLabels[urgencyVal]}
• Servicio: ${selectedService.name}
• ${labelTarifa}: ${finalPrice.toLocaleString()} FCFA
• Cliente (Tel): ${phone}
• Hora: ${formattedDate}
----------------------------------
Enviado desde la App TaxiChat EG.`;
  };

  const requestRide = () => {
    if (!phone || !pickup || !destination) {
      setStatus('Por favor, completa todos los campos del formulario');
      setStatusType('error');
      return;
    }

    // Real Route Validation Checks
    if (pickup.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setStatus('La validación de la ruta ha fallado: El punto de origen y el de destino no pueden ser idénticos.');
      setStatusType('error');
      playNotificationSound('alert');
      return;
    }

    if (pickup.trim().length < 3 || destination.trim().length < 3) {
      setStatus('La validación de la ruta ha fallado: Los nombres de origen o destino deben tener al menos 3 caracteres.');
      setStatusType('error');
      playNotificationSound('alert');
      return;
    }

    // Phone number validation check
    const phoneValidation = validateGEPhone(phone);
    if (!phoneValidation.isValid) {
      setStatus(`Número incorrecto: ${phoneValidation.message}. Por favor introduce un número de teléfono válido de Guinea Ecuatorial.`);
      setStatusType('error');
      return;
    }

    // Clean phone input of spaces/dashes
    const cleanPhone = phone.replace(/\s+/g, '');
    
    // Assemble driver phone (Guinea Ecuatorial code is 240)
    let driverPhone = customDriverPhone.replace(/\s+/g, '');
    if (!driverPhone.startsWith('240') && driverPhone.length === 9) {
      driverPhone = '240' + driverPhone;
    }

    const { km, min } = calculateDistance(pickup, destination);
    const message = generateMessage();
    const url = `https://wa.me/${driverPhone}?text=${encodeURIComponent(message)}`;

    // Create a new request log item with status 'pending'
    const displayPrice = serviceClass === 'propuesta' 
      ? customPrice 
      : serviceClass === 'especial'
        ? specialPrice
        : serviceClass === 'aeropuerto'
          ? aeropuertoPrice
          : currentService.price;
    const newRequestId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    
    const newRequest: TaxiRequest = {
      id: newRequestId,
      phone: cleanPhone,
      pickup,
      destination,
      city,
      serviceClass,
      driverPhone,
      timestamp: new Date().toISOString(),
      estimatedPrice: displayPrice,
      passengers: passengersCount,
      urgency: urgencyLevel,
      distanceKm: km,
      durationMin: min,
      status: 'pending'
    };

    // Update and persist history & active request tracking
    const updatedHistory = [newRequest, ...requestHistory];
    setRequestHistory(updatedHistory);
    localStorage.setItem('taxi_ge_history', JSON.stringify(updatedHistory));

    // Sync to registered passengers database
    setRegisteredPassengers(prev => {
      const existingIdx = prev.findIndex(p => p.phone === cleanPhone);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          tripsCount: updated[existingIdx].tripsCount + 1,
          city: city
        };
        return updated;
      } else {
        const newPassenger: RegisteredPassenger = {
          id: `PAS-${Math.floor(207 + Math.random() * 800)}`,
          name: 'Pasajero',
          lastName: 'Muni #' + cleanPhone.slice(-4),
          phone: cleanPhone,
          city: city,
          registeredAt: new Date().toISOString(),
          tripsCount: 1
        };
        return [newPassenger, ...prev];
      }
    });
    
    setActiveRequestId(newRequestId);
    localStorage.setItem('taxi_ge_active_request_id', newRequestId);

    // Request permission pro-actively for Web Notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      }).catch(err => {
        console.error('Error requesting notification permission on requestRide', err);
      });
    }

    // Open WhatsApp
    setStatus('¡Solicitud enviada por WhatsApp! Esperando que el conductor acepte la carrera...');
    setStatusType('success');
    playNotificationSound('new');

    // Attempt to open WhatsApp
    const win = window.open(url, '_blank');
    if (win) {
      win.focus();
    } else {
      // Direct redirect fallback if blocked by popups
      window.location.href = url;
    }
  };

  const copyToClipboard = () => {
    const message = generateMessage();
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error('No se pudo copiar el texto: ', err);
    });
  };

  const reSendRequest = (req: TaxiRequest) => {
    // Fill state
    setCity(req.city);
    setPickup(req.pickup);
    setDestination(req.destination);
    setServiceClass(req.serviceClass);
    setPhone(req.phone);
    if (req.serviceClass === 'propuesta') {
      setCustomPrice(req.estimatedPrice);
    } else if (req.serviceClass === 'especial') {
      setSpecialPrice(req.estimatedPrice);
    } else if (req.serviceClass === 'aeropuerto') {
      setAeropuertoPrice(req.estimatedPrice);
    }
    setCustomDriverPhone(req.driverPhone);
    setIsCustomDriver(true);
    setActiveTab('request');
    
    setStatus(`Datos de la carrera anterior cargados. ¡Pulsa solicitar!`);
    setStatusType('info');
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = requestHistory.filter(item => item.id !== id);
    setRequestHistory(updated);
    localStorage.setItem('taxi_ge_history', JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    if (window.confirm('¿Seguro que deseas vaciar todo el historial de solicitudes?')) {
      setRequestHistory([]);
      localStorage.removeItem('taxi_ge_history');
    }
  };

  // Live simulation: Accept ride as a driver
  const acceptRequest = (requestId: string) => {
    const updated = requestHistory.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'accepted' as const,
          vehicleType: driverVehicle,
          vehiclePlate: driverPlate,
          driverName: driverName,
          driverLastName: driverLastName,
          driverExperience: driverExperience,
          driverAltPhone: driverAltPhone,
          driverVehicleColor: driverVehicleColor,
          driverAvatar: driverAvatar,
          driverAvatarUrl: driverAvatarUrl,
          acceptedAt: new Date().toISOString()
        };
      }
      return req;
    });
    setRequestHistory(updated);
    localStorage.setItem('taxi_ge_history', JSON.stringify(updated));
    setStatus('Viaje aceptado con éxito. El cliente verá tu perfil, matrícula y tipo de vehículo.');
    setStatusType('success');
    playNotificationSound('success');
  };

  // Suggest a different price for a request (Counteroffer)
  const suggestPriceForRequest = (requestId: string, price: number) => {
    if (price <= 0 || isNaN(price)) {
      setStatus('Por favor ingrese un precio sugerido válido.');
      setStatusType('error');
      return;
    }
    const updated = requestHistory.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          suggestedPrice: price,
          driverName: driverName,
          driverLastName: driverLastName,
          driverAltPhone: driverAltPhone || '240555312102',
          driverPhone: driverAltPhone || '240555312102',
          vehicleType: driverVehicle,
          vehiclePlate: driverPlate,
          driverVehicleColor: driverVehicleColor,
          driverAvatar: driverAvatar,
          driverAvatarUrl: driverAvatarUrl,
          driverExperience: driverExperience,
        };
      }
      return req;
    });
    setRequestHistory(updated);
    localStorage.setItem('taxi_ge_history', JSON.stringify(updated));
    setSuggestingPriceForTripId(null);
    setSuggestedPriceInput('');
    setStatus(`Propuesta de tarifa de ${price.toLocaleString()} FCFA enviada al pasajero.`);
    setStatusType('success');
    playNotificationSound('success');
  };

  // Passenger accepts the driver's suggested price counteroffer
  const acceptSuggestedPrice = (requestId: string) => {
    const updated = requestHistory.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          estimatedPrice: req.suggestedPrice || req.estimatedPrice,
          status: 'accepted' as const,
          acceptedAt: new Date().toISOString()
        };
      }
      return req;
    });
    setRequestHistory(updated);
    localStorage.setItem('taxi_ge_history', JSON.stringify(updated));
    setStatus('¡Has aceptado la tarifa sugerida del conductor! El viaje está confirmado.');
    setStatusType('success');
    playNotificationSound('success');
  };

  // Passenger rejects the driver's suggested price counteroffer (resets back to standard pending state)
  const rejectSuggestedPrice = (requestId: string) => {
    const updated = requestHistory.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          suggestedPrice: undefined, // Clear the proposed price
          // Clear cloned driver info
          driverName: undefined,
          driverLastName: undefined,
          driverPhone: '',
          vehicleType: undefined,
          vehiclePlate: undefined,
          driverVehicleColor: undefined,
          driverAvatar: undefined,
          driverAvatarUrl: undefined,
          driverExperience: undefined
        };
      }
      return req;
    });
    setRequestHistory(updated);
    localStorage.setItem('taxi_ge_history', JSON.stringify(updated));
    setStatus('Has rechazado la tarifa propuesta. Tu viaje sigue buscando otros conductores con la tarifa original.');
    setStatusType('info');
    playNotificationSound('new');
  };

  // Live simulation: Cancel ride as a passenger
  const cancelRequestByPassenger = (requestId: string) => {
    const updated = requestHistory.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'cancelled_by_passenger' as const,
          cancelledAt: new Date().toISOString()
        };
      }
      return req;
    });
    setRequestHistory(updated);
    localStorage.setItem('taxi_ge_history', JSON.stringify(updated));
    
    if (activeRequestId === requestId) {
      setActiveRequestId(null);
      localStorage.removeItem('taxi_ge_active_request_id');
    }
    setShowCancelConfirmFor(null);
    setStatus('Has cancelado tu solicitud de taxi.');
    setStatusType('info');
    playNotificationSound('alert');
  };

  // Live simulation: Cancel/Reject ride as a driver
  const cancelRequestByDriver = (requestId: string) => {
    const updated = requestHistory.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'cancelled_by_driver' as const,
          cancelledAt: new Date().toISOString()
        };
      }
      return req;
    });
    setRequestHistory(updated);
    localStorage.setItem('taxi_ge_history', JSON.stringify(updated));
    setStatus('Viaje cancelado por el conductor.');
    setStatusType('info');
    playNotificationSound('alert');
  };

  // Helper to create and save a new commission record of 50 XAF
  const createCommissionRecord = (trip: TaxiRequest) => {
    // Check if commission already registered to prevent duplicates
    const alreadyHas = commissions.some(c => c.tripId === trip.id);
    if (alreadyHas) return;

    const commissionId = `COMM-${Math.floor(Math.random() * 90000) + 10000}`;
    const now = new Date().toISOString();
    const dueDate = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const currentDriverPlate = trip.vehiclePlate || driverPlate || 'M-4892-A';
    let isCommissionPaid = driverCommissionContractAccepted;
    let updatedPrepaidBalance = driverPrepaidBalance;

    if (!isCommissionPaid && currentDriverPlate === (driverPlate || 'M-4892-A') && driverPrepaidBalance >= 50) {
      isCommissionPaid = true;
      updatedPrepaidBalance = driverPrepaidBalance - 50;
      setDriverPrepaidBalance(updatedPrepaidBalance);
      localStorage.setItem('taxi_ge_driver_prepaid_balance', String(updatedPrepaidBalance));
      
      // Notify driver of auto-deduction
      setStatus('¡Comisión de 50 XAF descontada automáticamente de su saldo prepago!');
      setStatusType('success');
      playNotificationSound('success');
    }

    const newCommission: DriverCommission = {
      id: commissionId,
      tripId: trip.id,
      driverName: trip.driverName || driverName || 'Santiago',
      driverLastName: trip.driverLastName || driverLastName || 'Nguema',
      driverPhone: trip.driverPhone || driverAltPhone || phone || '240222000111',
      driverPlate: currentDriverPlate,
      pickup: trip.pickup,
      destination: trip.destination,
      tripPrice: trip.estimatedPrice,
      commissionAmount: 50, // Standard commission of 50 XAF
      createdAt: now,
      status: isCommissionPaid ? 'paid' : 'pending',
      paidAt: isCommissionPaid ? now : undefined,
      dueDate: dueDate
    };

    if (isCommissionPaid) {
      // Simulate automatic Muni Dinero transfer
      const transferObj = {
        id: `MUNI-${trip.id}`,
        timestamp: now,
        amount: 50,
        referenceTrip: `Comisión Carrera desde ${trip.pickup} a ${trip.destination} (${trip.estimatedPrice} XAF) [Saldo Prepago]`
      };
      setMuniTransfers(prev => {
        const updatedTransfers = [transferObj, ...prev];
        localStorage.setItem('taxi_ge_muni_transfers', JSON.stringify(updatedTransfers));
        return updatedTransfers;
      });

      setMuniTransferAlert({
        amount: 50,
        reference: `MUNI-${trip.id}`,
        date: new Date().toLocaleTimeString()
      });
    }

    setCommissions(prev => {
      const updatedCommissions = [newCommission, ...prev];
      localStorage.setItem('taxi_ge_commissions_v2', JSON.stringify(updatedCommissions));
      return updatedCommissions;
    });
  };

  // Live simulation: Complete and rate ride
  const completeAndRateRequest = (requestId: string, rating: number, comment: string) => {
    let completedTrip: TaxiRequest | null = null;
    const updated = requestHistory.map(req => {
      if (req.id === requestId) {
        completedTrip = {
          ...req,
          status: 'completed' as const,
          rating,
          ratingComment: comment,
          completedAt: new Date().toISOString()
        };
        return completedTrip;
      }
      return req;
    });
    setRequestHistory(updated);
    localStorage.setItem('taxi_ge_history', JSON.stringify(updated));
    
    if (activeRequestId === requestId) {
      setActiveRequestId(null);
      localStorage.removeItem('taxi_ge_active_request_id');
    }
    setRatingSubmittingFor(null);
    setRatingStars(5);
    setRatingText('');
    setStatus('¡Viaje completado! Has valorado al conductor con ' + rating + ' estrellas. ⭐');
    setStatusType('success');
    playNotificationSound('success');

    // Create 50 XAF commission record
    if (completedTrip) {
      createCommissionRecord(completedTrip);
    }
  };

  // Live simulation: Update trip payment status and trigger alerts/acustes
  const setRequestPaymentStatus = (requestId: string, paymentStatus: 'pending' | 'paid') => {
    let paidTrip: TaxiRequest | null = null;
    const updated = requestHistory.map(req => {
      if (req.id === requestId) {
        paidTrip = {
          ...req,
          paymentStatus
        };
        return paidTrip;
      }
      return req;
    });
    setRequestHistory(updated);
    localStorage.setItem('taxi_ge_history', JSON.stringify(updated));
    
    if (paymentStatus === 'paid') {
      setStatus('¡Acuse de pago enviado! Viaje Pagado con éxito 🎉');
      setStatusType('success');
      playNotificationSound('success');

      // Create commission record if it doesn't exist
      const matchingTrip = requestHistory.find(req => req.id === requestId) || paidTrip;
      if (matchingTrip) {
        createCommissionRecord(matchingTrip);
      }
    } else {
      setStatus('Estado de pago actualizado: Factura Pendiente.');
      setStatusType('info');
    }
  };

  // Pay an individual driver commission manually via Muni Dinero simulation
  const payDriverCommission = (commissionId: string) => {
    const now = new Date().toISOString();
    const updated = commissions.map(c => {
      if (c.id === commissionId) {
        return {
          ...c,
          status: 'paid' as const,
          paidAt: now
        };
      }
      return c;
    });

    setCommissions(updated);
    localStorage.setItem('taxi_ge_commissions_v2', JSON.stringify(updated));

    const target = commissions.find(c => c.id === commissionId);
    if (target) {
      const transferId = `MUNI-${target.tripId}`;
      const transferObj = {
        id: transferId,
        timestamp: now,
        amount: target.commissionAmount,
        referenceTrip: `Pago Manual Comisión Carrera desde ${target.pickup} a ${target.destination}`
      };

      setMuniTransfers(prev => {
        const nextTransfers = [transferObj, ...prev];
        localStorage.setItem('taxi_ge_muni_transfers', JSON.stringify(nextTransfers));
        return nextTransfers;
      });

      setMuniTransferAlert({
        amount: target.commissionAmount,
        reference: transferId,
        date: new Date().toLocaleTimeString()
      });
    }

    setStatus('¡Comisión de 50 XAF pagada con éxito! Deuda saldada ✓');
    setStatusType('success');
    playNotificationSound('success');
  };

  // Pay all outstanding commissions for the current driver
  const payAllMyPendingCommissions = () => {
    const myPlate = driverPlate || 'M-4892-A';
    const now = new Date().toISOString();
    
    const pendingsToPay = commissions.filter(c => c.driverPlate === myPlate && c.status === 'pending');
    if (pendingsToPay.length === 0) return;

    const updated = commissions.map(c => {
      if (c.driverPlate === myPlate && c.status === 'pending') {
        return {
          ...c,
          status: 'paid' as const,
          paidAt: now
        };
      }
      return c;
    });

    setCommissions(updated);
    localStorage.setItem('taxi_ge_commissions_v2', JSON.stringify(updated));

    // Register Muni Dinero transfer receipt for each
    pendingsToPay.forEach(target => {
      const transferId = `MUNI-${target.tripId}`;
      const transferObj = {
        id: transferId,
        timestamp: now,
        amount: target.commissionAmount,
        referenceTrip: `Pago Deuda Comisión Carrera de ${target.pickup} a ${target.destination}`
      };
      setMuniTransfers(prev => {
        const next = [transferObj, ...prev];
        localStorage.setItem('taxi_ge_muni_transfers', JSON.stringify(next));
        return next;
      });
    });

    // Remove suspension if active
    if (suspendedDriverPlates.includes(myPlate)) {
      const nextSuspended = suspendedDriverPlates.filter(p => p !== myPlate);
      setSuspendedDriverPlates(nextSuspended);
      localStorage.setItem('taxi_ge_suspended_drivers', JSON.stringify(nextSuspended));
    }

    setStatus(`¡Se han pagado ${pendingsToPay.length} comisiones de 50 XAF con éxito! Su cuenta está activa.`);
    setStatusType('success');
    playNotificationSound('success');
  };

  // Prepay driver commissions via Muni Dinero simulation
  const handleConfirmPrepay = (amount: number) => {
    if (amount <= 0 || isNaN(amount)) return;
    setIsPrepayProcessing(true);

    setTimeout(() => {
      const now = new Date().toISOString();
      const transactionId = `PREPAY-${Math.floor(Math.random() * 90000) + 10000}`;
      const myPlate = driverPlate || 'M-4892-A';

      // 1. Calculate new balance
      let newBalance = driverPrepaidBalance + amount;

      // 2. Add transaction record
      const newTx = {
        id: transactionId,
        amount: amount,
        timestamp: now,
        tripsCount: Math.floor(amount / 50),
        method: 'Muni Dinero'
      };

      const updatedTxs = [newTx, ...driverPrepaidTransactions];
      setDriverPrepaidTransactions(updatedTxs);
      localStorage.setItem('taxi_ge_driver_prepaid_transactions', JSON.stringify(updatedTxs));

      // 3. Auto-settle any pending commissions if possible
      const myPendingCommissions = commissions.filter(c => c.driverPlate === myPlate && c.status === 'pending');
      let settledCount = 0;
      
      const updatedCommissions = commissions.map(c => {
        if (c.driverPlate === myPlate && c.status === 'pending' && newBalance >= 50) {
          newBalance -= 50;
          settledCount++;
          return {
            ...c,
            status: 'paid' as const,
            paidAt: now
          };
        }
        return c;
      });

      if (settledCount > 0) {
        setCommissions(updatedCommissions);
        localStorage.setItem('taxi_ge_commissions_v2', JSON.stringify(updatedCommissions));
        
        // Also register Muni Dinero transfers for the settled ones
        for (let i = 0; i < settledCount; i++) {
          const transId = `MUNI-SETTLE-${Math.floor(Math.random() * 90000) + 10000}`;
          const transferObj = {
            id: transId,
            timestamp: now,
            amount: 50,
            referenceTrip: `Saldado Automático con Saldo Prepago`
          };
          setMuniTransfers(prev => {
            const next = [transferObj, ...prev];
            localStorage.setItem('taxi_ge_muni_transfers', JSON.stringify(next));
            return next;
          });
        }

        // Unsuspend if they cleared all overdue commissions
        const remainingOverdue = updatedCommissions.filter(c => c.driverPlate === myPlate && c.status === 'pending').filter(c => {
          const hours = (new Date().getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60);
          return hours > 48;
        });

        if (remainingOverdue.length === 0 && suspendedDriverPlates.includes(myPlate)) {
          const nextSuspended = suspendedDriverPlates.filter(p => p !== myPlate);
          setSuspendedDriverPlates(nextSuspended);
          localStorage.setItem('taxi_ge_suspended_drivers', JSON.stringify(nextSuspended));
        }
      }

      setDriverPrepaidBalance(newBalance);
      localStorage.setItem('taxi_ge_driver_prepaid_balance', String(newBalance));

      setIsPrepayProcessing(false);
      setShowPrepayModal(false);
      
      let msg = `¡Recarga de ${amount} XAF realizada con éxito mediante Muni Dinero!`;
      if (settledCount > 0) {
        msg += ` Se usaron ${settledCount * 50} XAF para saldar ${settledCount} deudas de comisiones pendientes.`;
      }
      setStatus(msg);
      setStatusType('success');
      playNotificationSound('success');
    }, 1500);
  };

  // Toggle suspension state of a driver by their license plate (Admin)
  const toggleSuspendDriver = (plate: string) => {
    let nextSuspended: string[];
    if (suspendedDriverPlates.includes(plate)) {
      nextSuspended = suspendedDriverPlates.filter(p => p !== plate);
      setStatus(`Cuenta de conductor con matrícula ${plate} reactivada con éxito.`);
      setStatusType('success');
    } else {
      nextSuspended = [...suspendedDriverPlates, plate];
      setStatus(`Cuenta de conductor con matrícula ${plate} suspendida debido a deudas.`);
      setStatusType('error');
    }
    setSuspendedDriverPlates(nextSuspended);
    localStorage.setItem('taxi_ge_suspended_drivers', JSON.stringify(nextSuspended));
    playNotificationSound('alert');
  };

  // Condonar deudas (Forgive debt) of a driver (Admin)
  const forgiveDriverDebt = (plate: string) => {
    const updated = commissions.map(c => {
      if (c.driverPlate === plate && c.status === 'pending') {
        return {
          ...c,
          status: 'paid' as const,
          paidAt: new Date().toISOString()
        };
      }
      return c;
    });
    setCommissions(updated);
    localStorage.setItem('taxi_ge_commissions_v2', JSON.stringify(updated));

    // Remove suspension
    if (suspendedDriverPlates.includes(plate)) {
      const nextSuspended = suspendedDriverPlates.filter(p => p !== plate);
      setSuspendedDriverPlates(nextSuspended);
      localStorage.setItem('taxi_ge_suspended_drivers', JSON.stringify(nextSuspended));
    }

    setStatus(`Deudas condonadas con éxito para la matrícula ${plate}.`);
    setStatusType('success');
    playNotificationSound('success');
  };

  // Update a driver's verification status, documents, background check, and inspection state (Admin)
  const updateDriverVerification = (driverId: string, updates: Partial<RegisteredDriver>) => {
    setRegisteredDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        // Deep copy documents or merge them correctly
        const documents = {
          dip: { ...d.documents?.dip, ...updates.documents?.dip },
          license: { ...d.documents?.license, ...updates.documents?.license },
          permit: { ...d.documents?.permit, ...updates.documents?.permit }
        };
        
        const updated: RegisteredDriver = {
          ...d,
          ...updates,
          documents
        };
        
        // Auto-recalculate overall verificationStatus
        const dipStatus = updated.documents?.dip?.status || 'empty';
        const licenseStatus = updated.documents?.license?.status || 'empty';
        const permitStatus = updated.documents?.permit?.status || 'empty';
        const bgStatus = updated.backgroundCheckStatus || 'pending';
        const insStatus = updated.vehicleInspectionStatus || 'pending';
        
        const isAllVerified = dipStatus === 'verified' && 
                             licenseStatus === 'verified' && 
                             permitStatus === 'verified' && 
                             bgStatus === 'passed' && 
                             insStatus === 'passed';
                             
        const isAnyRejected = dipStatus === 'rejected' || 
                             licenseStatus === 'rejected' || 
                             permitStatus === 'rejected' || 
                             bgStatus === 'failed' || 
                             insStatus === 'failed';
                             
        if (isAllVerified) {
          updated.verificationStatus = 'verified';
          updated.rejectedReason = undefined;
        } else if (isAnyRejected) {
          updated.verificationStatus = 'rejected';
        } else {
          updated.verificationStatus = 'pending';
        }
        
        // Overwrite overall verificationStatus and rejectedReason if explicitly passed in updates
        if (updates.verificationStatus !== undefined) {
          updated.verificationStatus = updates.verificationStatus;
        }
        if (updates.rejectedReason !== undefined) {
          updated.rejectedReason = updates.rejectedReason;
        }
        
        return updated;
      }
      return d;
    }));
    
    setStatus('Expediente de homologación del taxista actualizado en tiempo real.');
    setStatusType('success');
    playNotificationSound('success');
  };

  // Backdate/simulate overdue commission (>48h) to trigger the account cancellation warning
  const simulateOverdueCommissionForDriver = () => {
    const myPlate = driverPlate || 'M-4892-A';
    const myPending = commissions.find(c => c.driverPlate === myPlate && c.status === 'pending');
    
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    if (myPending) {
      const updated = commissions.map(c => {
        if (c.id === myPending.id) {
          return {
            ...c,
            createdAt: threeDaysAgo.toISOString(),
            dueDate: new Date(threeDaysAgo.getTime() + 48 * 60 * 60 * 1000).toISOString()
          };
        }
        return c;
      });
      setCommissions(updated);
      localStorage.setItem('taxi_ge_commissions_v2', JSON.stringify(updated));
    } else {
      // Create a brand new backdated pending commission of 50 XAF
      const commissionId = `COMM-${Math.floor(Math.random() * 90000) + 10000}`;
      const newCommission: DriverCommission = {
        id: commissionId,
        tripId: `REQ-SIM-${Math.floor(Math.random() * 9000) + 1000}`,
        driverName: driverName || 'Santiago',
        driverLastName: driverLastName || 'Nguema',
        driverPhone: driverAltPhone || '240222000111',
        driverPlate: myPlate,
        pickup: 'Zona Parque de Malabo',
        destination: 'Sipopo Resort',
        tripPrice: 3500,
        commissionAmount: 50,
        createdAt: threeDaysAgo.toISOString(),
        status: 'pending',
        dueDate: new Date(threeDaysAgo.getTime() + 48 * 60 * 60 * 1000).toISOString()
      };

      const updated = [newCommission, ...commissions];
      setCommissions(updated);
      localStorage.setItem('taxi_ge_commissions_v2', JSON.stringify(updated));
    }

    setStatus('¡Simulación activada! Se ha configurado una comisión de 50 XAF vencida por más de 48 horas.');
    setStatusType('error');
    playNotificationSound('alert');
  };

  const getServiceIcon = (id: ServiceClass) => {
    switch (id) {
      case 'compartido': return <Users className="h-5 w-5 text-emerald-600" id="icon-users" />;
      case 'especial': return <Car className="h-5 w-5 text-amber-500" id="icon-car" />;
      case 'aeropuerto': return <Plane className="h-5 w-5 text-sky-500" id="icon-plane" />;
      case 'propuesta': return <Sparkles className="h-5 w-5 text-purple-500" id="icon-sparkles" />;
    }
  };

  const heatmapData = {
    Malabo: [
      { id: 'h1', name: 'Ela Nguema', demand: 'alta' as const, count: 18, factor: 1.2, time: '7:00 - 18:00' },
      { id: 'h2', name: 'Caracolas', demand: 'alta' as const, count: 14, factor: 1.1, time: '8:00 - 15:00' },
      { id: 'h3', name: 'Semu', demand: 'alta' as const, count: 25, factor: 1.3, time: '11:00 - 19:00' },
      { id: 'h4', name: 'Paraíso', demand: 'media' as const, count: 8, factor: 1.0, time: '9:00 - 17:00' },
      { id: 'h5', name: 'Buena Esperanza', demand: 'media' as const, count: 10, factor: 1.0, time: '10:00 - 20:00' },
      { id: 'h6', name: 'Perez', demand: 'baja' as const, count: 3, factor: 1.0, time: 'Cualquier hora' }
    ],
    Bata: [
      { id: 'h7', name: 'Ndong', demand: 'alta' as const, count: 12, factor: 1.1, time: '8:00 - 18:00' },
      { id: 'h8', name: 'Ngolo', demand: 'alta' as const, count: 15, factor: 1.2, time: '7:30 - 16:30' },
      { id: 'h9', name: 'Comandachina', demand: 'alta' as const, count: 22, factor: 1.3, time: '10:00 - 21:00' },
      { id: 'h10', name: 'Biyetem', demand: 'media' as const, count: 7, factor: 1.0, time: '9:00 - 18:00' },
      { id: 'h11', name: 'San Juan', demand: 'media' as const, count: 9, factor: 1.0, time: '11:00 - 19:00' },
      { id: 'h12', name: 'Shangu', demand: 'baja' as const, count: 2, factor: 1.0, time: 'Cualquier hora' }
    ]
  };

  const simulateRequestFromRegion = (regionName: string) => {
    if (!driverAvailable) {
      setStatus('No puedes simular o recibir nuevas solicitudes de viaje mientras estés "Ocupado/Desconectado".');
      setStatusType('error');
      playNotificationSound('alert');
      return;
    }

    const prefixes = ['555', '666', '222', '888', '777'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const numberPart = Math.floor(Math.random() * 899999 + 100000).toString();
    const randomCustomerPhone = '240' + prefix + numberPart;
    
    const neighborhoodList = NEIGHBORHOODS[city] || [];
    const destinations = neighborhoodList.map(n => n.name).filter(name => name !== regionName);
    const randomDest = destinations.length > 0 ? destinations[Math.floor(Math.random() * destinations.length)] : 'Aeropuerto Internacional ✈️';
    
    const classes: ServiceClass[] = ['compartido', 'especial', 'propuesta'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const price = randomClass === 'compartido' ? 500 : randomClass === 'especial' ? 1500 : 2500;
    
    const { km, min } = calculateDistance(regionName, randomDest);
    const requestId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    
    const simulatedReq: TaxiRequest = {
      id: requestId,
      phone: randomCustomerPhone,
      pickup: regionName,
      destination: randomDest,
      city: city,
      serviceClass: randomClass,
      driverPhone: isCustomDriver ? customDriverPhone : (city === 'Malabo' ? '240222000111' : '240222000222'),
      timestamp: new Date().toISOString(),
      estimatedPrice: price,
      passengers: Math.floor(Math.random() * 3) + 1,
      urgency: ['normal', 'intermedio', 'urgente'][Math.floor(Math.random() * 3)] as UrgencyLevel,
      distanceKm: km,
      durationMin: min,
      status: 'pending'
    };
    
    const updated = [simulatedReq, ...requestHistory];
    setRequestHistory(updated);
    localStorage.setItem('taxi_ge_history', JSON.stringify(updated));
    
    setStatus(`Simulada nueva solicitud de cliente desde ${regionName}!`);
    setStatusType('success');
    playNotificationSound('new');
    setActiveDriverTab('requests');
  };

  // Compute driver ratings and average rating
  const driverRatedTrips = requestHistory.filter(req => req.status === 'completed' && req.rating !== undefined);
  
  const averageRating = driverRatedTrips.length > 0
    ? (driverRatedTrips.reduce((acc, req) => acc + (req.rating || 0), 0) / driverRatedTrips.length).toFixed(1)
    : null;

  // Compute stats for drivers
  const getDriversStats = () => {
    const driverMap: { [plate: string]: {
      name: string;
      lastName: string;
      phone: string;
      plate: string;
      totalCommissions: number;
      paidCommissions: number;
      pendingCommissions: number;
      overdueCommissions: number;
    }} = {};

    // Initialize map with default driver records from DEFAULT_DRIVERS
    const defaultDriverInfo = [
      { name: 'Santiago', lastName: 'Nguema', phone: '240222000111', plate: 'M-4892-A' },
      { name: 'Antonio', lastName: 'Ondo', phone: '240222000222', plate: 'B-9011-B' },
      { name: 'Manuel', lastName: 'Mangue', phone: '240555123456', plate: 'M-7711-X' }
    ];

    defaultDriverInfo.forEach(d => {
      driverMap[d.plate] = {
        name: d.name,
        lastName: d.lastName,
        phone: d.phone,
        plate: d.plate,
        totalCommissions: 0,
        paidCommissions: 0,
        pendingCommissions: 0,
        overdueCommissions: 0
      };
    });

    // Process all current commissions
    commissions.forEach(c => {
      const plate = c.driverPlate || 'M-4892-A';
      if (!driverMap[plate]) {
        driverMap[plate] = {
          name: c.driverName,
          lastName: c.driverLastName,
          phone: c.driverPhone,
          plate: plate,
          totalCommissions: 0,
          paidCommissions: 0,
          pendingCommissions: 0,
          overdueCommissions: 0
        };
      }

      const driver = driverMap[plate];
      driver.totalCommissions += c.commissionAmount;
      
      const isOverdue = c.status === 'pending' && (new Date().getTime() - new Date(c.createdAt).getTime() > 48 * 60 * 60 * 1000);

      if (c.status === 'paid') {
        driver.paidCommissions += c.commissionAmount;
      } else {
        driver.pendingCommissions += c.commissionAmount;
        if (isOverdue) {
          driver.overdueCommissions += c.commissionAmount;
        }
      }
    });

    return Object.values(driverMap);
  };

  // Compute stats for weekly and monthly commission targets
  const getPeriodStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let weeklyPaid = 0;
    let weeklyPending = 0;
    let monthlyPaid = 0;
    let monthlyPending = 0;

    commissions.forEach(c => {
      const date = new Date(c.createdAt);
      
      if (date >= oneWeekAgo) {
        if (c.status === 'paid') {
          weeklyPaid += c.commissionAmount;
        } else {
          weeklyPending += c.commissionAmount;
        }
      }
      
      if (date >= oneMonthAgo) {
        if (c.status === 'paid') {
          monthlyPaid += c.commissionAmount;
        } else {
          monthlyPending += c.commissionAmount;
        }
      }
    });

    return {
      weeklyPaid,
      weeklyPending,
      weeklyTotal: weeklyPaid + weeklyPending,
      monthlyPaid,
      monthlyPending,
      monthlyTotal: monthlyPaid + monthlyPending
    };
  };

  // Render high-fidelity Admin Dashboard
  const renderAdminDashboard = () => {
    const driverStats = getDriversStats();
    const periodStats = getPeriodStats();

    // Sum overall stats
    const totalCommissionsCollected = commissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    const totalCommissionsPending = commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    const totalCommissionsCount = commissions.length;
    const totalCommissionsAmount = totalCommissionsCollected + totalCommissionsPending;

    return (
      <div className="space-y-5 animate-fade-in text-left" id="admin-dashboard-container">
        {/* Admin Header Info */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-500 text-slate-950 p-2 rounded-xl shadow-md">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">Panel de Control de Comisiones</h3>
                <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">CREADOR Y ADMINISTRADOR</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAdminLoggedIn(false);
                localStorage.removeItem('taxi_ge_admin_logged_in');
                setAppRole('passenger');
                setStatus('Sesión de administrador cerrada con éxito.');
                setStatusType('info');
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              id="admin-logout-btn"
            >
              <Unlock className="h-3.5 w-3.5" /> Salir 🚪
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800/60">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Recaudado 🧾</span>
              <span className="text-sm font-black text-emerald-400 block">{totalCommissionsCollected.toLocaleString()} XAF</span>
              <span className="text-[8px] text-slate-500 block mt-0.5">{commissions.filter(c => c.status === 'paid').length} viajes</span>
            </div>
            <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800/60">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Pendiente ⏳</span>
              <span className="text-sm font-black text-amber-500 block">{totalCommissionsPending.toLocaleString()} XAF</span>
              <span className="text-[8px] text-slate-500 block mt-0.5">{commissions.filter(c => c.status === 'pending').length} impagos</span>
            </div>
            <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800/60">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Total Generado</span>
              <span className="text-sm font-black text-slate-200 block">{totalCommissionsAmount.toLocaleString()} XAF</span>
              <span className="text-[8px] text-slate-500 block mt-0.5">{totalCommissionsCount} comisiones</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Admin */}
        <div className="flex bg-slate-200/80 p-1.5 rounded-2xl gap-1" id="admin-tabs">
          <button
            type="button"
            onClick={() => setAdminTab('overview')}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${adminTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Resumen
          </button>
          <button
            type="button"
            onClick={() => setAdminTab('drivers')}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${adminTab === 'drivers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
          >
            <Users className="h-3.5 w-3.5 text-amber-500 shrink-0" /> Taxistas
          </button>
          <button
            type="button"
            onClick={() => setAdminTab('ledger')}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${adminTab === 'ledger' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-purple-600 shrink-0" /> Contabilidad
          </button>
          <button
            type="button"
            onClick={() => setAdminTab('users')}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${adminTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
            id="admin-users-tab-btn"
          >
            <TrendingUp className="h-3.5 w-3.5 text-sky-600 shrink-0" /> Usuarios
          </button>
        </div>

        {/* TAB CONTENT: OVERVIEW */}
        {adminTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            {/* Weekly and Monthly controls */}
            <div className="bg-white rounded-3xl p-5 border border-slate-150 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                <TrendingUp className="h-4 w-4 text-emerald-600" /> Control de Comisiones (Semanales y Mensuales)
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-left space-y-2">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Últimos 7 Días</span>
                  </div>
                  <div>
                    <span className="text-lg font-black text-slate-900">{periodStats.weeklyTotal.toLocaleString()} XAF</span>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Cobrado: <strong className="text-emerald-600">{periodStats.weeklyPaid} XAF</strong></span>
                      <span>Deuda: <strong className="text-red-600">{periodStats.weeklyPending} XAF</strong></span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-left space-y-2">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Últimos 30 Días</span>
                  </div>
                  <div>
                    <span className="text-lg font-black text-slate-900">{periodStats.monthlyTotal.toLocaleString()} XAF</span>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Cobrado: <strong className="text-emerald-600">{periodStats.monthlyPaid} XAF</strong></span>
                      <span>Deuda: <strong className="text-red-600">{periodStats.monthlyPending} XAF</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
                <strong>Análisis Fiscal:</strong> Las comisiones de 50 XAF fijas por viaje representan el sustento operativo del canal directo Muni Dinero de TaxiChat EG. La recaudación promedio mensual estimada por taxista es de aproximadamente <strong>4,500 XAF</strong> sobre una cuota de 90 carreras.
              </div>
            </div>

            {/* Platform status overview */}
            <div className="bg-white rounded-3xl p-5 border border-slate-150 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Shield className="h-4 w-4 text-amber-500" /> Estado Administrativo de Taxistas
              </h4>
              
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-100/60 font-bold">
                  <span className="text-[9.5px] uppercase text-emerald-600 block mb-0.5">Cuentas Activas</span>
                  <p className="text-lg font-black">{driverStats.filter(d => !suspendedDriverPlates.includes(d.plate)).length} taxistas</p>
                </div>
                <div className="bg-red-50 text-red-800 p-3 rounded-2xl border border-red-100 font-bold">
                  <span className="text-[9.5px] uppercase text-red-600 block mb-0.5">Cuentas Suspendidas</span>
                  <p className="text-lg font-black">{driverStats.filter(d => suspendedDriverPlates.includes(d.plate) || d.overdueCommissions > 0).length} bloqueados</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: DRIVERS */}
        {adminTab === 'drivers' && (
          <div className="space-y-4 animate-fade-in" id="admin-drivers-control-tab">
            {/* Secondary compliance sub-tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 max-w-md" id="drivers-subtabs">
              <button
                type="button"
                onClick={() => setVerificationSubTab('compliance')}
                className={`flex-1 py-2 text-[10px] sm:text-xs font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  verificationSubTab === 'compliance' 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                id="subtab-compliance-btn"
              >
                <ShieldCheck className="h-4 w-4 text-amber-500" /> Homologación y Seguridad
              </button>
              <button
                type="button"
                onClick={() => setVerificationSubTab('finance')}
                className={`flex-1 py-2 text-[10px] sm:text-xs font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  verificationSubTab === 'finance' 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                id="subtab-finance-btn"
              >
                <DollarSign className="h-4 w-4 text-emerald-500" /> Finanzas y Sanciones
              </button>
            </div>

            {/* SUB-TAB: COMPLIANCE & SAFETY DOCUMENT REVIEW */}
            {verificationSubTab === 'compliance' && (
              <div className="space-y-4 animate-fade-in" id="compliance-workspace">
                {/* Regulation alert box */}
                <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-3xl flex items-start gap-3">
                  <ShieldCheck className="h-5.5 w-5.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-normal">
                    <p className="font-bold">Marco Regulatorio de Seguridad y Homologación Nacional</p>
                    <p className="text-[11px] text-amber-800/90 mt-0.5">
                      En coordinación con la <strong>Dirección General de Tráfico</strong> y el <strong>Ministerio de Justicia, Culto e Instituciones Penitenciarias de Guinea Ecuatorial</strong>, todo taxista operativo en la plataforma debe superar la validación del DIP, Licencia de Conducir, Licencia Municipal, Verificación de Antecedentes Penales e Inspección Física del Vehículo para garantizar la seguridad ciudadana en Malabo y Bata.
                    </p>
                  </div>
                </div>

                {/* Filters Panel */}
                <div className="bg-white rounded-3xl p-4 border border-slate-150 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Buscar Conductor</label>
                    <input
                      type="text"
                      value={complianceSearchQuery}
                      onChange={(e) => setComplianceSearchQuery(e.target.value)}
                      placeholder="Nombre, apellido, placa o teléfono..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                      id="compliance-search"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Filtrar por Ciudad</label>
                    <select
                      value={complianceCityFilter}
                      onChange={(e) => setComplianceCityFilter(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                    >
                      <option value="all">Todas las Ciudades 🌍</option>
                      <option value="Malabo">Malabo 🏝️</option>
                      <option value="Bata">Bata 🌊</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Estado de Homologación</label>
                    <select
                      value={complianceStatusFilter}
                      onChange={(e) => setComplianceStatusFilter(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                    >
                      <option value="all">Todos los Estados 📁</option>
                      <option value="verified">Homologado (Aprobado ✓)</option>
                      <option value="pending">Pendiente de Revisión ⏳</option>
                      <option value="rejected">Rechazado / Revocado ❌</option>
                    </select>
                  </div>
                </div>

                {/* Master Directory & Detailed Dossier Split-Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* LEFT COLUMN: Registered Drivers Directory */}
                  <div className="lg:col-span-5 bg-white rounded-3xl p-4 border border-slate-150 shadow-sm space-y-3 flex flex-col max-h-[600px]">
                    <div className="border-b border-slate-100 pb-2">
                      <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-slate-500" /> Directorio de Expedientes ({
                          registeredDrivers.filter(d => {
                            const matchesCity = complianceCityFilter === 'all' || d.city === complianceCityFilter;
                            const matchesStatus = complianceStatusFilter === 'all' || (d.verificationStatus || 'no_submitted') === complianceStatusFilter;
                            return matchesCity && matchesStatus;
                          }).length
                        })
                      </h5>
                    </div>

                    <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                      {(() => {
                        const filtered = registeredDrivers.filter(driver => {
                          const matchesCity = complianceCityFilter === 'all' || driver.city === complianceCityFilter;
                          const matchesStatus = complianceStatusFilter === 'all' || (driver.verificationStatus || 'no_submitted') === complianceStatusFilter;
                          
                          const query = complianceSearchQuery.toLowerCase();
                          const matchesQuery = !complianceSearchQuery ||
                            driver.name.toLowerCase().includes(query) ||
                            driver.lastName.toLowerCase().includes(query) ||
                            driver.phone.includes(query) ||
                            driver.vehiclePlate.toLowerCase().includes(query);
                            
                          return matchesCity && matchesStatus && matchesQuery;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-12 text-slate-400 italic text-xs">
                              No se encontraron expedientes con los filtros aplicados.
                            </div>
                          );
                        }

                        return filtered.map(driver => {
                          const isSelected = selectedVerificationDriverId === driver.id;
                          const initials = `${driver.name.charAt(0)}${driver.lastName.charAt(0)}`.toUpperCase();
                          const status = driver.verificationStatus || 'no_submitted';
                          
                          // Count passed components
                          let passedComponents = 0;
                          if (driver.documents?.dip?.status === 'verified') passedComponents++;
                          if (driver.documents?.license?.status === 'verified') passedComponents++;
                          if (driver.documents?.permit?.status === 'verified') passedComponents++;
                          if (driver.backgroundCheckStatus === 'passed') passedComponents++;
                          if (driver.vehicleInspectionStatus === 'passed') passedComponents++;

                          return (
                            <button
                              key={driver.id}
                              type="button"
                              onClick={() => {
                                setSelectedVerificationDriverId(driver.id);
                                setCustomRejectReason('');
                              }}
                              className={`w-full text-left p-3 rounded-2xl border transition-all flex flex-col gap-2 cursor-pointer ${
                                isSelected 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-500/35' 
                                  : 'bg-slate-50 hover:bg-slate-100/70 border-slate-150 text-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 border ${
                                    isSelected 
                                      ? 'bg-slate-800 text-white border-slate-700' 
                                      : 'bg-white text-slate-700 border-slate-200'
                                  }`}>
                                    {initials}
                                  </div>
                                  <div>
                                    <p className="font-bold text-[11.5px] leading-tight flex items-center gap-1 flex-wrap">
                                      {driver.name} {driver.lastName}
                                      {driver.verificationStatus === 'verified' && (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                                      )}
                                    </p>
                                    <p className={`text-[9px] font-mono leading-none mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                                      {driver.vehiclePlate} • {driver.city}
                                    </p>
                                  </div>
                                </div>

                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 tracking-wider ${
                                  status === 'verified' 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                    : status === 'rejected' 
                                      ? 'bg-red-100 text-red-800 border border-red-200' 
                                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}>
                                  {status === 'verified' ? 'Homologado ✓' : status === 'rejected' ? 'Rechazado ❌' : 'Pendiente ⏳'}
                                </span>
                              </div>

                              {/* Progress of verifications indicators */}
                              <div className="flex items-center justify-between gap-2 border-t pt-2 border-slate-200/10">
                                <div className="flex gap-1">
                                  {/* DIP icon indicator */}
                                  <span className={`text-[8.5px] font-black uppercase px-1 rounded ${
                                    driver.documents?.dip?.status === 'verified' 
                                      ? 'bg-emerald-500/20 text-emerald-500' 
                                      : driver.documents?.dip?.status === 'rejected' 
                                        ? 'bg-red-500/20 text-red-500' 
                                        : 'bg-slate-300/30 text-slate-400'
                                  }`} title="DIP">
                                    DIP
                                  </span>
                                  {/* LIC icon indicator */}
                                  <span className={`text-[8.5px] font-black uppercase px-1 rounded ${
                                    driver.documents?.license?.status === 'verified' 
                                      ? 'bg-emerald-500/20 text-emerald-500' 
                                      : driver.documents?.license?.status === 'rejected' 
                                        ? 'bg-red-500/20 text-red-500' 
                                        : 'bg-slate-300/30 text-slate-400'
                                  }`} title="Licencia">
                                    LIC
                                  </span>
                                  {/* MUN icon indicator */}
                                  <span className={`text-[8.5px] font-black uppercase px-1 rounded ${
                                    driver.documents?.permit?.status === 'verified' 
                                      ? 'bg-emerald-500/20 text-emerald-500' 
                                      : driver.documents?.permit?.status === 'rejected' 
                                        ? 'bg-red-500/20 text-red-500' 
                                        : 'bg-slate-300/30 text-slate-400'
                                  }`} title="Municipal">
                                    MUN
                                  </span>
                                  {/* BACKGROUND indicator */}
                                  <span className={`text-[8.5px] font-black uppercase px-1 rounded ${
                                    driver.backgroundCheckStatus === 'passed' 
                                      ? 'bg-emerald-500/20 text-emerald-500' 
                                      : driver.backgroundCheckStatus === 'failed' 
                                        ? 'bg-red-500/20 text-red-500' 
                                        : 'bg-slate-300/30 text-slate-400'
                                  }`} title="Antecedentes">
                                    PEN
                                  </span>
                                  {/* VEHICLE INSPECTION indicator */}
                                  <span className={`text-[8.5px] font-black uppercase px-1 rounded ${
                                    driver.vehicleInspectionStatus === 'passed' 
                                      ? 'bg-emerald-500/20 text-emerald-500' 
                                      : driver.vehicleInspectionStatus === 'failed' 
                                        ? 'bg-red-500/20 text-red-500' 
                                        : 'bg-slate-300/30 text-slate-400'
                                  }`} title="Inspección Mecánica">
                                    INSP
                                  </span>
                                </div>
                                
                                <span className="text-[9.5px] font-bold font-mono">
                                  {passedComponents}/5 completado
                                </span>
                              </div>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Selected Driver Detailed Verification Dossier */}
                  <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-150 shadow-sm min-h-[450px]">
                    {(() => {
                      const activeDriver = registeredDrivers.find(d => d.id === selectedVerificationDriverId);
                      if (!activeDriver) {
                        return (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3" id="no-driver-selected-compliance">
                            <ShieldAlert className="h-10 w-10 text-slate-300" />
                            <p className="text-xs font-bold text-slate-700">Ningún Expediente Seleccionado</p>
                            <p className="text-[11px] text-slate-400 leading-normal max-w-sm">
                              Selecciona un conductor del directorio nacional para auditar sus documentos cargados por el OCR, verificar antecedentes penales oficiales y certificar la inspección física obligatoria.
                            </p>
                          </div>
                        );
                      }

                      // Calculate points
                      let passedCount = 0;
                      if (activeDriver.documents?.dip?.status === 'verified') passedCount++;
                      if (activeDriver.documents?.license?.status === 'verified') passedCount++;
                      if (activeDriver.documents?.permit?.status === 'verified') passedCount++;
                      if (activeDriver.backgroundCheckStatus === 'passed') passedCount++;
                      if (activeDriver.vehicleInspectionStatus === 'passed') passedCount++;

                      const progressPercentage = Math.round((passedCount / 5) * 100);

                      return (
                        <div className="space-y-5 animate-fade-in text-xs text-left" id={`compliance-dossier-${activeDriver.id}`}>
                          {/* Dossier Header */}
                          <div className="border-b border-slate-100 pb-3 flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 block">EXPEDIENTE DE HOMOLOGACIÓN VINCULADO</span>
                              <h4 className="font-black text-slate-900 text-sm">{activeDriver.name} {activeDriver.lastName}</h4>
                              <p className="font-mono text-slate-400 text-[10px] mt-0.5">ID: {activeDriver.id} • +{activeDriver.phone}</p>
                            </div>

                            <div className="text-right">
                              <span className="text-[9px] text-slate-400 block font-bold uppercase">Ubicación y Flota</span>
                              <span className="text-[11px] font-black text-slate-800 block">{activeDriver.city} • {activeDriver.vehicleType}</span>
                              <span className="text-[9.5px] font-mono text-slate-500">Matrícula: {activeDriver.vehiclePlate}</span>
                            </div>
                          </div>

                          {/* Compliance progress bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10.5px] font-bold">
                              <span className="text-slate-600 flex items-center gap-1">
                                <FileCheck className="h-4 w-4 text-emerald-500" /> Progreso de Validación General
                              </span>
                              <span className="text-slate-800 font-mono">{progressPercentage}% ({passedCount}/5)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 rounded-full ${
                                  progressPercentage === 100 
                                    ? 'bg-emerald-500' 
                                    : progressPercentage >= 60 
                                      ? 'bg-amber-400' 
                                      : 'bg-rose-500'
                                }`}
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* General Certification status block */}
                          <div className={`p-4 rounded-2xl border text-xs leading-normal space-y-2.5 ${
                            activeDriver.verificationStatus === 'verified' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                              : activeDriver.verificationStatus === 'rejected' 
                                ? 'bg-red-50 border-red-200 text-red-900' 
                                : 'bg-amber-50 border-amber-200 text-amber-900'
                          }`}>
                            <div className="flex items-start gap-2">
                              {activeDriver.verificationStatus === 'verified' ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                              ) : activeDriver.verificationStatus === 'rejected' ? (
                                <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                              ) : (
                                <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <p className="font-bold text-[12px] text-slate-900">
                                  {activeDriver.verificationStatus === 'verified' && '✓ Homologación Oficial Aprobada'}
                                  {activeDriver.verificationStatus === 'rejected' && '❌ Homologación Denegada o Revocada'}
                                  {(activeDriver.verificationStatus === 'pending' || !activeDriver.verificationStatus) && '⏳ Expediente Pendiente de Homologar'}
                                </p>
                                <p className="text-[11px] text-slate-600 mt-0.5">
                                  {activeDriver.verificationStatus === 'verified' && 'Este conductor cuenta con todas las garantías del Gobierno y posee la insignia de taxista de confianza en TaxiChat EG.'}
                                  {activeDriver.verificationStatus === 'rejected' && `Acceso denegado temporalmente de la plataforma de solicitud de viajes por: "${activeDriver.rejectedReason || 'No cumple con las normativas mínimas de seguridad'}"`}
                                  {(activeDriver.verificationStatus === 'pending' || !activeDriver.verificationStatus) && 'Sujeto a verificación. Revise cada una de las 3 secciones documentales, antecedentes e inspección técnica para tomar una resolución final.'}
                                </p>
                              </div>
                            </div>

                            {/* Direct Overrides / Core Verification Decisions */}
                            <div className="flex flex-wrap gap-2 border-t pt-3 border-slate-200/60 justify-end">
                              {activeDriver.verificationStatus !== 'verified' && (
                                <button
                                  type="button"
                                  onClick={() => updateDriverVerification(activeDriver.id, { 
                                    verificationStatus: 'verified', 
                                    rejectedReason: undefined,
                                    documents: {
                                      dip: { status: 'verified', docNumber: activeDriver.documents?.dip?.docNumber || 'DIP-' + Math.floor(100000 + Math.random()*900000), expiryDate: activeDriver.documents?.dip?.expiryDate || '2030-01-01' },
                                      license: { status: 'verified', docNumber: activeDriver.documents?.license?.docNumber || 'LC-' + Math.floor(10000 + Math.random()*90000) + '-GE', expiryDate: activeDriver.documents?.license?.expiryDate || '2029-01-01' },
                                      permit: { status: 'verified', docNumber: activeDriver.documents?.permit?.docNumber || 'MUN-' + (activeDriver.city === 'Malabo' ? 'MAL' : 'BAT') + '-' + Math.floor(1000 + Math.random()*9000), expiryDate: activeDriver.documents?.permit?.expiryDate || '2028-01-01' }
                                    },
                                    backgroundCheckStatus: 'passed',
                                    vehicleInspectionStatus: 'passed'
                                  })}
                                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                                  id="btn-force-approve-all"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Forzar Homologación Completa ✓
                                </button>
                              )}

                              {activeDriver.verificationStatus !== 'rejected' ? (
                                <div className="w-full flex flex-col sm:flex-row gap-1.5 items-end mt-2">
                                  <input
                                    type="text"
                                    placeholder="Motivo del rechazo (ej. Documento expirado)..."
                                    value={customRejectReason}
                                    onChange={(e) => setCustomRejectReason(e.target.value)}
                                    className="flex-1 bg-white border border-slate-250 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!customRejectReason.trim()) {
                                        setStatus('Por favor ingrese un motivo de rechazo.');
                                        setStatusType('error');
                                        return;
                                      }
                                      updateDriverVerification(activeDriver.id, { 
                                        verificationStatus: 'rejected', 
                                        rejectedReason: customRejectReason 
                                      });
                                      setCustomRejectReason('');
                                    }}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer whitespace-nowrap"
                                  >
                                    Denegar Conductor ❌
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateDriverVerification(activeDriver.id, { 
                                    verificationStatus: 'pending',
                                    rejectedReason: undefined 
                                  })}
                                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer"
                                >
                                  Mandar a Revisión ⏳
                                </button>
                              )}
                            </div>
                          </div>

                          {/* SECTIONS GRID */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* SECTION 1: DOCUMENT REVIEW (OCR + Approval) */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/75 space-y-3">
                              <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                                <FileText className="h-4 w-4 text-sky-600" /> 1. Validación de Documentos
                              </h5>

                              <div className="space-y-3">
                                {/* DIP */}
                                <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-100">
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-slate-700">DIP Guinea Ecuatorial:</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                      activeDriver.documents?.dip?.status === 'verified' 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : activeDriver.documents?.dip?.status === 'rejected' 
                                          ? 'bg-red-100 text-red-800' 
                                          : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {activeDriver.documents?.dip?.status === 'verified' ? 'Aprobado ✓' : activeDriver.documents?.dip?.status === 'rejected' ? 'Rechazado ❌' : 'Pendiente ⏳'}
                                    </span>
                                  </div>
                                  <p className="font-mono text-[9px] text-slate-400">Nº: {activeDriver.documents?.dip?.docNumber || 'No ingresado'} • Exp: {activeDriver.documents?.dip?.expiryDate || 'No ingresado'}</p>
                                  
                                  {/* Stylized Scan simulation */}
                                  <div className="bg-slate-100/70 border border-slate-250 p-2 rounded-lg text-center my-1 select-none relative overflow-hidden flex flex-col items-center justify-center min-h-[50px]">
                                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">MINISTERIO DE SEGURIDAD</span>
                                    <span className="text-[7.5px] text-slate-400 font-bold block">FOTO ID ADJUNTA - SCAN_DIP_{activeDriver.lastName.toUpperCase()}.PNG</span>
                                    <div className="absolute inset-0 bg-amber-500/5 rotate-12 flex items-center justify-center font-mono font-black text-[12px] text-amber-600/10 pointer-events-none uppercase tracking-[6px]">Guinea Ecuatorial</div>
                                  </div>

                                  <div className="flex gap-1 justify-end pt-1">
                                    <button
                                      type="button"
                                      onClick={() => updateDriverVerification(activeDriver.id, {
                                        documents: { dip: { status: 'verified', docNumber: activeDriver.documents?.dip?.docNumber || 'DIP-332014', expiryDate: activeDriver.documents?.dip?.expiryDate || '2030-01-01' } }
                                      })}
                                      className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[9px] font-bold uppercase hover:bg-emerald-600 transition-colors"
                                    >
                                      ✓ Validar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateDriverVerification(activeDriver.id, {
                                        documents: { dip: { status: 'rejected', docNumber: activeDriver.documents?.dip?.docNumber, expiryDate: activeDriver.documents?.dip?.expiryDate, rejectedReason: 'Imagen del DIP borrosa o firma no legible.' } }
                                      })}
                                      className="px-2 py-0.5 bg-red-500 text-white rounded text-[9px] font-bold uppercase hover:bg-red-600 transition-colors"
                                    >
                                      ✗ Rechazar
                                    </button>
                                  </div>
                                </div>

                                {/* LICENCIA */}
                                <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-100">
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-slate-700">Licencia de Conducir (DGT):</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                      activeDriver.documents?.license?.status === 'verified' 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : activeDriver.documents?.license?.status === 'rejected' 
                                          ? 'bg-red-100 text-red-800' 
                                          : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {activeDriver.documents?.license?.status === 'verified' ? 'Aprobada ✓' : activeDriver.documents?.license?.status === 'rejected' ? 'Rechazada ❌' : 'Pendiente ⏳'}
                                    </span>
                                  </div>
                                  <p className="font-mono text-[9px] text-slate-400">Nº: {activeDriver.documents?.license?.docNumber || 'No ingresado'} • Exp: {activeDriver.documents?.license?.expiryDate || 'No ingresado'}</p>
                                  
                                  {/* Stylized Scan simulation */}
                                  <div className="bg-slate-100/70 border border-slate-250 p-2 rounded-lg text-center my-1 select-none relative overflow-hidden flex flex-col items-center justify-center min-h-[50px]">
                                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">MINISTERIO DE TRANSPORTES</span>
                                    <span className="text-[7.5px] text-slate-400 font-bold block">LICENCIA DGT COMPLETA - REVERSO_Y_ANVERSO.JPG</span>
                                  </div>

                                  <div className="flex gap-1 justify-end pt-1">
                                    <button
                                      type="button"
                                      onClick={() => updateDriverVerification(activeDriver.id, {
                                        documents: { license: { status: 'verified', docNumber: activeDriver.documents?.license?.docNumber || 'LC-91041-GE', expiryDate: activeDriver.documents?.license?.expiryDate || '2028-11-20' } }
                                      })}
                                      className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[9px] font-bold uppercase hover:bg-emerald-600 transition-colors"
                                    >
                                      ✓ Validar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateDriverVerification(activeDriver.id, {
                                        documents: { license: { status: 'rejected', docNumber: activeDriver.documents?.license?.docNumber, expiryDate: activeDriver.documents?.license?.expiryDate, rejectedReason: 'Licencia vencida o categoría no apta para taxi.' } }
                                      })}
                                      className="px-2 py-0.5 bg-red-500 text-white rounded text-[9px] font-bold uppercase hover:bg-red-600 transition-colors"
                                    >
                                      ✗ Rechazar
                                    </button>
                                  </div>
                                </div>

                                {/* AUTORIZACION / LICENCIA MUNICIPAL */}
                                <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-100">
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-slate-700">Licencia Municipal (Taxi):</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                      activeDriver.documents?.permit?.status === 'verified' 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : activeDriver.documents?.permit?.status === 'rejected' 
                                          ? 'bg-red-100 text-red-800' 
                                          : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {activeDriver.documents?.permit?.status === 'verified' ? 'Aprobada ✓' : activeDriver.documents?.permit?.status === 'rejected' ? 'Rechazada ❌' : 'Pendiente ⏳'}
                                    </span>
                                  </div>
                                  <p className="font-mono text-[9px] text-slate-400">Nº: {activeDriver.documents?.permit?.docNumber || 'No ingresado'} • Exp: {activeDriver.documents?.permit?.expiryDate || 'No ingresado'}</p>
                                  
                                  {/* Stylized Scan simulation */}
                                  <div className="bg-slate-100/70 border border-slate-250 p-2 rounded-lg text-center my-1 select-none relative overflow-hidden flex flex-col items-center justify-center min-h-[50px]">
                                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">AYUNTAMIENTO DE {activeDriver.city.toUpperCase()}</span>
                                    <span className="text-[7.5px] text-slate-400 font-bold block">PERMISO OFICIAL DE VEHÍCULO - AUTORIZACION_{activeDriver.vehiclePlate}.PDF</span>
                                  </div>

                                  <div className="flex gap-1 justify-end pt-1">
                                    <button
                                      type="button"
                                      onClick={() => updateDriverVerification(activeDriver.id, {
                                        documents: { permit: { status: 'verified', docNumber: activeDriver.documents?.permit?.docNumber || 'MUN-' + (activeDriver.city === 'Malabo' ? 'MAL' : 'BAT') + '-2104', expiryDate: activeDriver.documents?.permit?.expiryDate || '2027-12-31' } }
                                      })}
                                      className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[9px] font-bold uppercase hover:bg-emerald-600 transition-colors"
                                    >
                                      ✓ Validar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateDriverVerification(activeDriver.id, {
                                        documents: { permit: { status: 'rejected', docNumber: activeDriver.documents?.permit?.docNumber, expiryDate: activeDriver.documents?.permit?.expiryDate, rejectedReason: 'Número de matrícula de taxi municipal no coincide con el chasis del vehículo.' } }
                                      })}
                                      className="px-2 py-0.5 bg-red-500 text-white rounded text-[9px] font-bold uppercase hover:bg-red-600 transition-colors"
                                    >
                                      ✗ Rechazar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* RIGHT SIDE OF SECTIONS GRID: BACKGROUND CHECK & PHYSICAL INSPECTION */}
                            <div className="space-y-4">
                              {/* SECTION 2: BACKGROUND CHECK (Ministerio de Justicia) */}
                              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/75 space-y-3">
                                <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                                  <Gavel className="h-4 w-4 text-purple-600" /> 2. Historial Civil y Penal
                                </h5>

                                <p className="text-[10px] text-slate-500 leading-normal">
                                  Consulta de seguridad automatizada al Ministerio de Justicia, Culto e Instituciones Penitenciarias para verificar deudas penales activas o antecedentes.
                                </p>

                                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                                  <div className="space-y-0.5">
                                    <span className="text-[8.5px] text-slate-400 uppercase font-black">Estado Judicial</span>
                                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                      <span className={`w-2 h-2 rounded-full inline-block ${
                                        activeDriver.backgroundCheckStatus === 'passed' 
                                          ? 'bg-emerald-500 animate-pulse' 
                                          : activeDriver.backgroundCheckStatus === 'failed' 
                                            ? 'bg-red-500' 
                                            : 'bg-amber-500 animate-pulse'
                                      }`}></span>
                                      {activeDriver.backgroundCheckStatus === 'passed' && 'Libre de Antecedentes ✓'}
                                      {activeDriver.backgroundCheckStatus === 'failed' && 'Antecedentes Penales Activos 🚨'}
                                      {(activeDriver.backgroundCheckStatus === 'pending' || !activeDriver.backgroundCheckStatus) && 'Consulta Pendiente ⏳'}
                                    </p>
                                  </div>
                                  
                                  <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded ${
                                    activeDriver.backgroundCheckStatus === 'passed' 
                                      ? 'bg-emerald-50 text-emerald-700' 
                                      : activeDriver.backgroundCheckStatus === 'failed' 
                                        ? 'bg-red-50 text-red-700' 
                                        : 'bg-amber-50 text-amber-700'
                                  }`}>
                                    {activeDriver.backgroundCheckStatus || 'Pendiente'}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => updateDriverVerification(activeDriver.id, { backgroundCheckStatus: 'passed' })}
                                    className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-bold uppercase transition-all text-center cursor-pointer"
                                  >
                                    Aprobar Apto ✓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateDriverVerification(activeDriver.id, { backgroundCheckStatus: 'failed' })}
                                    className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-[9px] font-bold uppercase border border-red-200 transition-all text-center cursor-pointer"
                                  >
                                    Denegar Penal ✗
                                  </button>
                                </div>
                              </div>

                              {/* SECTION 3: PHYSICAL VEHICLE INSPECTION */}
                              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/75 space-y-3">
                                <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                                  <Wrench className="h-4 w-4 text-emerald-600" /> 3. Inspección del Vehículo
                                </h5>

                                <p className="text-[10.5px] text-slate-500 leading-normal">
                                  Auditoría de cumplimiento estético y mecánico con la directriz municipal de Guinea Ecuatorial.
                                </p>

                                {/* Checkboxes checklist simulation */}
                                <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1.5 text-[10.5px] font-medium text-slate-600">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const tag = 'pintura';
                                      setInspectionChecks(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
                                    }}
                                    className="flex items-center gap-1.5 w-full text-left"
                                  >
                                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${inspectionChecks.includes('pintura') ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 border-slate-350 text-transparent'}`}>✓</span>
                                    <span>Pintura Reglamentaria ({activeDriver.city === 'Malabo' ? 'Techo Rojo / Amarillo' : 'Techo Blanco / Azul'})</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const tag = 'matricula';
                                      setInspectionChecks(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
                                    }}
                                    className="flex items-center gap-1.5 w-full text-left"
                                  >
                                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${inspectionChecks.includes('matricula') ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 border-slate-350 text-transparent'}`}>✓</span>
                                    <span>Matrícula oficial visible del vehículo ({activeDriver.vehiclePlate})</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const tag = 'cinturones';
                                      setInspectionChecks(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
                                    }}
                                    className="flex items-center gap-1.5 w-full text-left"
                                  >
                                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${inspectionChecks.includes('cinturones') ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 border-slate-350 text-transparent'}`}>✓</span>
                                    <span>Cinturones de seguridad delanteros y traseros funcionales</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const tag = 'mecanica';
                                      setInspectionChecks(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
                                    }}
                                    className="flex items-center gap-1.5 w-full text-left"
                                  >
                                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${inspectionChecks.includes('mecanica') ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 border-slate-350 text-transparent'}`}>✓</span>
                                    <span>Mecánica general, luces y frenos certificados</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const tag = 'higiene';
                                      setInspectionChecks(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
                                    }}
                                    className="flex items-center gap-1.5 w-full text-left"
                                  >
                                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${inspectionChecks.includes('higiene') ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 border-slate-350 text-transparent'}`}>✓</span>
                                    <span>Higiene y habitáculo limpio</span>
                                  </button>
                                </div>

                                <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-xl border border-slate-150">
                                  <span className="font-bold text-slate-700">Estado de la Inspección:</span>
                                  <span className={`font-black uppercase text-[8.5px] px-1.5 py-0.5 rounded ${
                                    activeDriver.vehicleInspectionStatus === 'passed' 
                                      ? 'bg-emerald-100 text-emerald-800' 
                                      : activeDriver.vehicleInspectionStatus === 'failed' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {activeDriver.vehicleInspectionStatus === 'passed' ? 'Aprobado ✓' : activeDriver.vehicleInspectionStatus === 'failed' ? 'Reprobado ❌' : 'Pendiente ⏳'}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Tick all checks automatically and pass the inspection
                                      setInspectionChecks(['pintura', 'matricula', 'cinturones', 'mecanica', 'higiene']);
                                      updateDriverVerification(activeDriver.id, { vehicleInspectionStatus: 'passed' });
                                    }}
                                    className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-bold uppercase transition-all text-center cursor-pointer"
                                  >
                                    ✓ Vehículo Apto
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateDriverVerification(activeDriver.id, { vehicleInspectionStatus: 'failed' })}
                                    className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-[9px] font-bold uppercase border border-red-200 transition-all text-center cursor-pointer"
                                  >
                                    ✗ Reprobar Inspección
                                  </button>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB: FINANCIAL & SANCTIONS MANAGEMENT */}
            {verificationSubTab === 'finance' && (
              <div className="bg-white rounded-3xl p-5 border border-slate-150 shadow-sm space-y-4 animate-fade-in" id="finance-workspace">
                <div className="border-b border-slate-100 pb-2.5">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-emerald-600" /> Monitoreo y Sanción de Taxistas (Finanzas)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Lista de conductores registrados con desglose financiero. Las cuentas con comisiones impagadas por más de 48 horas se marcan para suspensión inmediata.
                  </p>
                </div>

                <div className="space-y-3">
                  {driverStats.map(driver => {
                    const isSuspended = suspendedDriverPlates.includes(driver.plate) || driver.overdueCommissions > 0;
                    return (
                      <div key={driver.plate} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs space-y-3">
                        {/* Driver Metadata */}
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-800 text-sm">{driver.name} {driver.lastName}</p>
                            <p className="font-mono text-slate-500 text-[10px]">+{driver.phone} • {driver.plate}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            isSuspended ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isSuspended ? 'Suspendido 🚨' : 'Activo ✓'}
                          </span>
                        </div>

                        {/* Driver Financial details */}
                        <div className="grid grid-cols-4 gap-2 bg-white border border-slate-100 p-2.5 rounded-xl text-center">
                          <div>
                            <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Total</span>
                            <span className="font-mono font-bold text-slate-700">{driver.totalCommissions} XAF</span>
                          </div>
                          <div>
                            <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Pagado</span>
                            <span className="font-mono font-bold text-emerald-600">+{driver.paidCommissions} XAF</span>
                          </div>
                          <div>
                            <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Pendiente</span>
                            <span className="font-mono font-bold text-amber-600">{driver.pendingCommissions} XAF</span>
                          </div>
                          <div>
                            <span className="text-[8.5px] uppercase font-bold text-red-400 block">Excedido</span>
                            <span className="font-mono font-bold text-red-600">{driver.overdueCommissions} XAF</span>
                          </div>
                        </div>

                        {/* Management Actions */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => toggleSuspendDriver(driver.plate)}
                            className={`py-2 px-3 rounded-xl font-bold text-[10.5px] transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                              suspendedDriverPlates.includes(driver.plate)
                                ? 'bg-slate-900 text-white hover:bg-slate-800'
                                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/50'
                            }`}
                          >
                            <UserX className="h-3.5 w-3.5" />
                            {suspendedDriverPlates.includes(driver.plate) ? 'Reactivar Cuenta' : 'Suspender Cuenta'}
                          </button>
                          <button
                            type="button"
                            disabled={driver.pendingCommissions === 0}
                            onClick={() => forgiveDriverDebt(driver.plate)}
                            className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-[10.5px] transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Award className="h-3.5 w-3.5" /> Condonar Deudas
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: LEDGER / RECEIPTS */}
        {adminTab === 'ledger' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-5 border border-slate-150 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <FileSpreadsheet className="h-4 w-4 text-purple-600" /> Libro Mayor de Comisiones
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Historial cronológico de todos los aportes de 50 XAF por viaje registrados.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {commissions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-6">No hay registros de comisiones aún.</p>
                ) : (
                  commissions.map(c => {
                    const dateStr = new Date(c.createdAt).toLocaleDateString([], {day: '2-digit', month: 'short'});
                    const timeStr = new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                    const isOverdue = c.status === 'pending' && (new Date().getTime() - new Date(c.createdAt).getTime() > 48 * 60 * 60 * 1000);

                    return (
                      <div key={c.id} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 text-xs text-left">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-slate-800 text-[11px]">{c.id}</span>
                            <span className="bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">{c.driverPlate}</span>
                            {isOverdue && <span className="bg-red-100 text-red-800 text-[8px] font-bold px-1.5 py-0.5 rounded">Vencido 48h 🚨</span>}
                          </div>
                          <p className="text-[10.5px] text-slate-600">{c.driverName} • {c.pickup} ➔ {c.destination}</p>
                          <p className="text-[9.5px] text-slate-400">{dateStr} {timeStr}</p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                          <div className="text-right space-y-0.5">
                            <span className="font-mono font-black text-slate-900 block">{c.commissionAmount} XAF</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                              c.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {c.status === 'paid' ? 'Cobrado ✓' : 'Impago'}
                            </span>
                          </div>

                          {c.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => payDriverCommission(c.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                              id={`pay-commission-btn-${c.id}`}
                            >
                              Registrar Pago
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: USERS & GROWTH */}
        {adminTab === 'users' && (
          <div className="space-y-4 animate-fade-in" id="admin-users-growth-content">
            {/* Bento statistics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-3xl p-4 border border-slate-150 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Users className="h-4 w-4 text-sky-500" />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Total Usuarios</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 block">{(registeredPassengers.length + registeredDrivers.length).toLocaleString()}</span>
                <span className="text-[9px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-full font-bold inline-block">crecimiento continuo 📈</span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-150 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Smartphone className="h-4 w-4 text-emerald-500" />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Pasajeros</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 block">{registeredPassengers.length}</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold inline-block">+18% expansión 🌍</span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white rounded-3xl p-4 border border-slate-150 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Car className="h-4 w-4 text-amber-500" />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Taxistas</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 block">{registeredDrivers.length}</span>
                <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full font-bold inline-block">+15% flota local 🚖</span>
              </div>
            </div>

            {/* Expansion by City (Malabo vs Bata) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-150 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                <Map className="h-4 w-4 text-indigo-500" /> Expansión Nacional (Cobertura por Región)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Malabo */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      Región Insular (Malabo)
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full uppercase">Sede Central</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Pasajeros</span>
                      <span className="text-base font-black text-slate-800">{registeredPassengers.filter(p => p.city === 'Malabo').length}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Taxistas</span>
                      <span className="text-base font-black text-slate-800">{registeredDrivers.filter(d => d.city === 'Malabo').length}</span>
                    </div>
                  </div>

                  {/* Malabo Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>Proporción de mercado</span>
                      <span>{Math.round(((registeredPassengers.filter(p => p.city === 'Malabo').length + registeredDrivers.filter(d => d.city === 'Malabo').length) / (registeredPassengers.length + registeredDrivers.length || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-500" 
                        style={{ width: `${((registeredPassengers.filter(p => p.city === 'Malabo').length + registeredDrivers.filter(d => d.city === 'Malabo').length) / (registeredPassengers.length + registeredDrivers.length || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Bata */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                      Región Continental (Bata)
                    </span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded-full uppercase">Expansión</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Pasajeros</span>
                      <span className="text-base font-black text-slate-800">{registeredPassengers.filter(p => p.city === 'Bata').length}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Taxistas</span>
                      <span className="text-base font-black text-slate-800">{registeredDrivers.filter(d => d.city === 'Bata').length}</span>
                    </div>
                  </div>

                  {/* Bata Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>Proporción de mercado</span>
                      <span>{Math.round(((registeredPassengers.filter(p => p.city === 'Bata').length + registeredDrivers.filter(d => d.city === 'Bata').length) / (registeredPassengers.length + registeredDrivers.length || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full transition-all duration-500" 
                        style={{ width: `${((registeredPassengers.filter(p => p.city === 'Bata').length + registeredDrivers.filter(d => d.city === 'Bata').length) / (registeredPassengers.length + registeredDrivers.length || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Simulator (Admin Tool) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-150 shadow-sm space-y-4" id="user-simulator-card">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                <Sparkles className="h-4 w-4 text-sky-500" /> Simular Registro de Nuevo Usuario (Prototipado)
              </h4>

              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Rol</label>
                    <select
                      value={simUserRole}
                      onChange={(e) => setSimUserRole(e.target.value as 'passenger' | 'driver')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                      id="sim-role-select"
                    >
                      <option value="passenger">Pasajero 📱</option>
                      <option value="driver">Taxista 🚖</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Nombre</label>
                    <input
                      type="text"
                      value={simUserName}
                      onChange={(e) => setSimUserName(e.target.value)}
                      placeholder="Ej. Bonifacio"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                      id="sim-name-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Apellido</label>
                    <input
                      type="text"
                      value={simUserLastName}
                      onChange={(e) => setSimUserLastName(e.target.value)}
                      placeholder="Ej. Ondo"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                      id="sim-lastname-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Número de Teléfono</label>
                    <input
                      type="text"
                      value={simUserPhone}
                      onChange={(e) => setSimUserPhone(e.target.value)}
                      placeholder="Ej. 240222111"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                      id="sim-phone-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Ciudad</label>
                    <select
                      value={simUserCity}
                      onChange={(e) => setSimUserCity(e.target.value as City)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                      id="sim-city-select"
                    >
                      <option value="Malabo">Malabo 🏝️</option>
                      <option value="Bata">Bata 🌊</option>
                    </select>
                  </div>

                  {simUserRole === 'driver' ? (
                    <div className="space-y-1 col-span-2 sm:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Matrícula</label>
                      <input
                        type="text"
                        value={simUserVehiclePlate}
                        onChange={(e) => setSimUserVehiclePlate(e.target.value)}
                        placeholder="Ej. M-4012-B"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                        id="sim-plate-input"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1 col-span-2 sm:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Tipo</label>
                      <span className="text-[11px] text-slate-400 italic block py-1.5">No requiere vehículo</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!simUserName || !simUserLastName || !simUserPhone) {
                        setStatus('Por favor complete el nombre, apellido y teléfono para simular el registro.');
                        setStatusType('error');
                        return;
                      }
                      
                      let cleanPhone = simUserPhone.replace(/\s+/g, '');
                      if (!cleanPhone.startsWith('240') && cleanPhone.length === 9) {
                        cleanPhone = '240' + cleanPhone;
                      }

                      if (simUserRole === 'passenger') {
                        const newPassenger: RegisteredPassenger = {
                          id: `PAS-${Math.floor(210 + Math.random() * 700)}`,
                          name: simUserName,
                          lastName: simUserLastName,
                          phone: cleanPhone,
                          city: simUserCity,
                          registeredAt: new Date().toISOString(),
                          tripsCount: 0
                        };
                        setRegisteredPassengers(prev => [newPassenger, ...prev]);
                      } else {
                        const newDriver: RegisteredDriver = {
                          id: `DRV-${Math.floor(106 + Math.random() * 800)}`,
                          name: simUserName,
                          lastName: simUserLastName,
                          phone: cleanPhone,
                          city: simUserCity,
                          vehiclePlate: simUserVehiclePlate || 'M-DEFAULT-' + Math.floor(10 + Math.random() * 89),
                          vehicleType: simUserVehicleType || 'Toyota Corolla (Simulado)',
                          registeredAt: new Date().toISOString(),
                          status: 'activo'
                        };
                        setRegisteredDrivers(prev => [newDriver, ...prev]);
                      }

                      // Reset form fields
                      setSimUserName('');
                      setSimUserLastName('');
                      setSimUserPhone('');
                      setSimUserVehiclePlate('');

                      setStatus(`¡Simulación de Registro completada para ${simUserName} ${simUserLastName}! Las estadísticas se han actualizado.`);
                      setStatusType('success');
                      playNotificationSound('success');
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    id="submit-sim-user-btn"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Registrar en Base de Datos 💾
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Search & Directory Panel */}
            <div className="bg-white rounded-3xl p-5 border border-slate-150 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-sky-600" /> Directorio Nacional de Usuarios
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Lista completa de registros activos de taxistas y pasajeros.
                  </p>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUserFilterRole('all')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${userFilterRole === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    Todos ({registeredPassengers.length + registeredDrivers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserFilterRole('passenger')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${userFilterRole === 'passenger' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    Pasajeros ({registeredPassengers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserFilterRole('driver')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${userFilterRole === 'driver' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    Taxistas ({registeredDrivers.length})
                  </button>
                </div>
              </div>

              {/* Search input + City filter */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="col-span-2 relative">
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Buscar usuario por nombre, apellido o teléfono..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                    id="user-search-input"
                  />
                  {userSearchQuery && (
                    <button 
                      type="button"
                      onClick={() => setUserSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <select
                    value={userFilterCity}
                    onChange={(e) => setUserFilterCity(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                    id="user-city-filter-select"
                  >
                    <option value="all">Todas las Ciudades 🌍</option>
                    <option value="Malabo">Malabo 🏝️</option>
                    <option value="Bata">Bata 🌊</option>
                  </select>
                </div>
              </div>

              {/* Users Directory List */}
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {(() => {
                  const pList = userFilterRole === 'driver' ? [] : registeredPassengers.map(p => ({ ...p, role: 'passenger' as const }));
                  const dList = userFilterRole === 'passenger' ? [] : registeredDrivers.map(d => ({ ...d, role: 'driver' as const }));
                  
                  const combined = [...pList, ...dList].sort((a, b) => {
                    return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
                  });

                  const filtered = combined.filter(u => {
                    const matchesCity = userFilterCity === 'all' || u.city === userFilterCity;
                    
                    const query = userSearchQuery.toLowerCase();
                    const matchesQuery = !userSearchQuery || 
                      u.name.toLowerCase().includes(query) ||
                      u.lastName.toLowerCase().includes(query) ||
                      u.phone.includes(query) ||
                      u.id.toLowerCase().includes(query);

                    return matchesCity && matchesQuery;
                  });

                  if (filtered.length === 0) {
                    return (
                      <p className="text-xs text-slate-400 italic text-center py-8">
                        No se encontraron usuarios registrados que coincidan con los filtros.
                      </p>
                    );
                  }

                  return filtered.map(u => {
                    const initials = `${u.name.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();
                    const regDate = new Date(u.registeredAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

                    return (
                      <div 
                        key={u.id} 
                        className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs text-left hover:border-slate-200 hover:bg-slate-100/50 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] tracking-wider shrink-0 shadow-sm ${
                            u.role === 'passenger' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {initials}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-800">{u.name} {u.lastName}</span>
                              <span className="text-[8.5px] font-mono px-1 bg-slate-200 text-slate-600 rounded">{u.id}</span>
                              <span className={`text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded ${
                                u.role === 'passenger' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-amber-50 text-amber-700 border border-amber-150'
                              }`}>
                                {u.role === 'passenger' ? 'Pasajero' : 'Taxista'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span className="flex items-center gap-0.5"><Phone className="h-3 w-3" /> +{u.phone}</span>
                              <span>•</span>
                              <span className={`font-semibold ${u.city === 'Malabo' ? 'text-teal-600' : 'text-indigo-600'}`}>
                                {u.city}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <span className="text-[9.5px] text-slate-400 block">Reg: {regDate}</span>
                          {u.role === 'passenger' ? (
                            <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-lg inline-block">
                              {(u as any).tripsCount || 0} viajes 📱
                            </span>
                          ) : (
                            <span className="text-[9.5px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-lg inline-block">
                              {(u as any).vehiclePlate} 🚖
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getWallpaperClass = () => {
    switch (wallpaper) {
      case 'gradient-emerald':
        return 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 text-slate-800';
      case 'gradient-sunset':
        return 'bg-gradient-to-br from-orange-50 via-rose-50 to-orange-100 text-slate-800';
      case 'gradient-ocean':
        return 'bg-gradient-to-br from-sky-50 via-indigo-50 to-sky-100 text-slate-800';
      case 'gradient-midnight':
        return 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100';
      case 'solid-dark':
        return 'bg-slate-950 text-slate-100';
      case 'retro-glass':
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100';
      case 'solid-light':
      default:
        return 'bg-slate-50 text-slate-800';
    }
  };

  return (
    <div className={`min-h-screen ${getWallpaperClass()} flex flex-col justify-between ${getFontRootClass()} transition-all duration-500`} id="app-root">

      {/* Simulated Muni Dinero Transfer Floating Notification */}
      <AnimatePresence>
        {muniTransferAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto text-left"
            id="muni-transfer-floating-toast"
          >
            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/30 flex items-start gap-3.5 backdrop-blur-md">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0 border border-emerald-500/20 animate-pulse">
                💸
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">MUNI DINERO ALERTA</span>
                  <span className="text-[9px] text-slate-400 font-bold">{muniTransferAlert.date}</span>
                </div>
                <h4 className="font-bold text-xs text-white mt-1 truncate">
                  ¡Transferencia Automática de Comisión!
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Has transferido <strong className="text-emerald-400">{muniTransferAlert.amount} XAF</strong> al número estándar <strong className="text-white">00240555312102</strong> correspondientes al 10% de la carrera.
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                  <span>REF: {muniTransferAlert.reference}</span>
                  <span className="bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded uppercase text-[8.5px]">ÉXITO ✓</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMuniTransferAlert(null)}
                className="text-slate-400 hover:text-white shrink-0 p-1 rounded-lg cursor-pointer"
                id="dismiss-muni-alert-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dynamic Equatorial Guinea Flag Header Accent */}
      <div className="w-full h-2 flex" id="eg-flag-strip">
        <div className="flex-1 bg-emerald-600 h-full"></div>
        <div className="flex-1 bg-white h-full"></div>
        <div className="flex-1 bg-red-600 h-full"></div>
        <div className="w-12 bg-sky-500 h-full relative">
          {/* Triangular blue wedge representing the flag's chevron */}
          <div className="absolute inset-0 bg-sky-500" style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }}></div>
        </div>
      </div>

      <header className={`py-4 shadow-xs border-b transition-all duration-500 ${
        isDarkTheme()
          ? 'bg-slate-900/95 border-slate-800 text-white backdrop-blur-md shadow-black/40' 
          : 'bg-white/95 border-slate-100 text-slate-900 backdrop-blur-md'
      }`} id="app-header">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${getAccentBgClass('600')} text-white p-2 rounded-xl shadow-sm`} id="header-logo-bg">
              <Car className="h-6 w-6" id="logo-icon" />
            </div>
            <div>
              <h1 className={`font-display font-bold text-xl tracking-tight flex items-center gap-1.5 ${
                isDarkTheme() ? 'text-white' : 'text-slate-900'
              }`} id="app-title">
                {TRANSLATIONS[language].title} <span className={`text-xs ${getAccentBgClass('100')} ${getAccentTextClass('800')} font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider`}>Guinea Ecuatorial</span>
              </h1>
              <p className={`text-xs font-medium ${
                isDarkTheme() ? 'text-slate-400' : 'text-slate-500'
              }`} id="app-subtitle">{TRANSLATIONS[language].subtitle}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowDriverSettings(!showDriverSettings)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkTheme()
                ? showDriverSettings ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : showDriverSettings ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="Configuración y Estilo"
            id="driver-settings-btn"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6" id="app-main">
        {/* Interactive Mode Switcher */}
        <div className="flex bg-slate-200/80 p-1.5 rounded-2xl mb-5 shadow-inner" id="app-role-switcher">
          <button
            type="button"
            onClick={() => setAppRole('passenger')}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${appRole === 'passenger' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
            id="role-passenger-btn"
          >
            <User className="h-3.5 w-3.5" /> Pasajero
          </button>
          <button
            type="button"
            onClick={() => setAppRole('driver')}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${appRole === 'driver' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
            id="role-driver-btn"
          >
            <Car className="h-3.5 w-3.5" /> Taxista
          </button>
          {isUserAdmin() && (
            <button
              type="button"
              onClick={() => {
                if (isAdminLoggedIn) {
                  setAppRole('admin');
                } else {
                  setAdminPinInput('');
                  setAdminPinError('');
                  setShowAdminLoginModal(true);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${appRole === 'admin' ? 'bg-slate-900 text-amber-400 shadow-md border border-slate-800' : 'text-slate-600 hover:text-slate-900'}`}
              id="role-admin-btn"
            >
              <Shield className="h-3.5 w-3.5" /> Admin 👑
            </button>
          )}
        </div>

        {/* Driver Settings Panel */}
        <AnimatePresence>
          {showDriverSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 text-white rounded-2xl p-4 mb-5 shadow-lg overflow-hidden border border-slate-800"
              id="driver-settings-panel"
            >
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-amber-400">
                  <Settings className="h-4 w-4" /> Configuración de Conductor
                </h3>
                <button 
                  onClick={() => setShowDriverSettings(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800"
                  id="close-settings-btn"
                >
                  Listo
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Por defecto, la app envía el WhatsApp a los números centrales de Malabo o Bata. Puedes cambiarlo aquí para mandar la solicitud directamente a tu conductor de confianza o a tu propio número.
                </p>

                <div className="flex items-center gap-2 py-1.5">
                  <input 
                    type="checkbox" 
                    id="isCustomCheckbox" 
                    checked={isCustomDriver}
                    onChange={(e) => setIsCustomDriver(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                  />
                  <label htmlFor="isCustomCheckbox" className="font-medium text-xs select-none cursor-pointer">
                    Usar Conductor Personalizado / Central Propia
                  </label>
                </div>

                {isCustomDriver ? (
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Número de WhatsApp del Conductor (con 240)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono font-medium">+240</span>
                      <input 
                        type="tel"
                        value={customDriverPhone.replace('240', '')}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setCustomDriverPhone('240' + val);
                        }}
                        placeholder="555123456"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-13 pr-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400"
                        id="custom-driver-phone-input"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 space-y-1.5">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">Centrales activas por ciudad:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-850 p-2 rounded-lg border border-slate-750">
                        <p className="font-medium text-slate-300">Central Malabo</p>
                        <p className="font-mono text-emerald-400 text-[11px]">+240 222 000 111</p>
                      </div>
                      <div className="bg-slate-850 p-2 rounded-lg border border-slate-750">
                        <p className="font-medium text-slate-300">Central Bata</p>
                        <p className="font-mono text-sky-400 text-[11px]">+240 222 000 222</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vehicle specifications section */}
                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 block">Datos de tu Taxi (Para Aceptación de Viajes):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-300">Tipo de Vehículo</label>
                      <input 
                        type="text"
                        value={driverVehicle}
                        onChange={(e) => {
                          setDriverVehicle(e.target.value);
                          localStorage.setItem('taxi_ge_driver_vehicle', e.target.value);
                        }}
                        placeholder="Ej. Toyota Corolla (Taxi)"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                        id="driver-vehicle-input"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-300">Matrícula</label>
                      <input 
                        type="text"
                        value={driverPlate}
                        onChange={(e) => {
                          setDriverPlate(e.target.value);
                          localStorage.setItem('taxi_ge_driver_plate', e.target.value);
                        }}
                        placeholder="Ej. M-4892-A"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                        id="driver-plate-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferencia de Idioma y Modo Ahorro de Datos */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 block">Preferencias de la App / App Preferences:</span>
                  
                  {/* Idioma / Language */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-300">Idioma / Language</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['es', 'fr', 'en'] as const).map(lang => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setLanguage(lang);
                            localStorage.setItem('taxi_ge_language', lang);
                          }}
                          className={`py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${language === lang ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-850 text-slate-300 hover:bg-slate-800'}`}
                        >
                          {lang === 'es' ? 'Español' : lang === 'fr' ? 'Français' : 'English'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ahorro de datos / Data Saver */}
                  <div className="flex items-center justify-between py-1 bg-slate-850 rounded-lg px-2 border border-slate-800">
                    <div className="pr-2">
                      <label htmlFor="dataSaverCheckbox" className="font-medium text-xs text-slate-200 block cursor-pointer">
                        {t('dataSaver')} (Data Saver)
                      </label>
                      <span className="text-[10px] text-slate-400 block">Desactiva animaciones del mapa para ahorrar megas</span>
                    </div>
                    <input 
                      type="checkbox" 
                      id="dataSaverCheckbox" 
                      checked={dataSaver}
                      onChange={(e) => {
                        setDataSaver(e.target.checked);
                        localStorage.setItem('taxi_ge_data_saver', e.target.checked ? 'true' : 'false');
                      }}
                      className="rounded border-slate-700 bg-slate-800 text-amber-400 focus:ring-amber-400 h-4 w-4 cursor-pointer"
                    />
                  </div>

                  {/* Personalizar Fondo y Estilo */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5 text-amber-400" /> Personalización Visual Avanzada:
                    </span>
                    
                    {/* Fondo */}
                    <div className="space-y-1">
                      <label className="block text-[10.5px] font-medium text-slate-300">Fondo de Pantalla / Wallpaper</label>
                      <div className="grid grid-cols-7 gap-1" id="settings-wallpaper-selector">
                        {[
                          { id: 'solid-light', color: 'bg-slate-300', name: 'Gris' },
                          { id: 'solid-dark', color: 'bg-slate-800 border border-slate-600', name: 'Carbón' },
                          { id: 'gradient-emerald', color: 'bg-emerald-500', name: 'Esmeralda' },
                          { id: 'gradient-sunset', color: 'bg-orange-400', name: 'Sunset' },
                          { id: 'gradient-ocean', color: 'bg-sky-400', name: 'Ocean' },
                          { id: 'gradient-midnight', color: 'bg-slate-950 border border-slate-800', name: 'Noche' },
                          { id: 'retro-glass', color: 'bg-radial-gradient from-slate-900 to-black border border-green-900/30', name: 'Retro' }
                        ].map(wp => (
                          <button
                            key={wp.id}
                            type="button"
                            onClick={() => {
                              setWallpaper(wp.id);
                              localStorage.setItem('taxi_ge_wallpaper', wp.id);
                            }}
                            className={`h-7 rounded-lg relative flex items-center justify-center ${wp.color} ${
                              wallpaper === wp.id ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 scale-105' : 'hover:scale-102 opacity-80 hover:opacity-100'
                            }`}
                            title={wp.name}
                          >
                            {wallpaper === wp.id && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Estilo de Tarjetas */}
                    <div className="space-y-1">
                      <label className="block text-[10.5px] font-medium text-slate-300">Diseño / Estilo de Tarjeta</label>
                      <div className="grid grid-cols-3 gap-1" id="settings-cardstyle-selector">
                        {[
                          { id: 'glassmorphism', name: 'Vidrio ✨' },
                          { id: 'soft-shadows', name: 'Sombra ☁️' },
                          { id: 'neobrutalism', name: 'Brutal 🎨' },
                          { id: 'minimalist', name: 'Plano 📐' },
                          { id: 'retro-terminal', name: 'Terminal 📟' },
                          { id: 'soft-clay', name: 'Clay ☁️' }
                        ].map(style => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => {
                              setCardStyle(style.id);
                              localStorage.setItem('taxi_ge_card_style', style.id);
                            }}
                            className={`py-1 px-1 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all duration-150 ${
                              cardStyle === style.id 
                                ? 'bg-amber-400 text-slate-950 font-black shadow-sm' 
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                            }`}
                          >
                            {style.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color de Acento */}
                    <div className="space-y-1">
                      <label className="block text-[10.5px] font-medium text-slate-300">Color de Acento / Tema</label>
                      <div className="grid grid-cols-5 gap-1" id="settings-accent-selector">
                        {[
                          { id: 'emerald', color: 'bg-emerald-500', name: 'Verde' },
                          { id: 'indigo', color: 'bg-indigo-500', name: 'Azul' },
                          { id: 'amber', color: 'bg-amber-500', name: 'Oro' },
                          { id: 'rose', color: 'bg-rose-500', name: 'Rosa' },
                          { id: 'violet', color: 'bg-violet-500', name: 'Violeta' }
                        ].map(accent => (
                          <button
                            key={accent.id}
                            type="button"
                            onClick={() => {
                              setAccentColor(accent.id);
                              localStorage.setItem('taxi_ge_accent_color', accent.id);
                            }}
                            className={`py-1 px-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-1.5 ${
                              accentColor === accent.id 
                                ? 'bg-amber-400 text-slate-950 font-black' 
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                            }`}
                          >
                            <span className={`h-2.5 w-2.5 rounded-full ${accent.color} inline-block border border-black/20`}></span>
                            {accent.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tipografía y Densidad en una sola fila */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="space-y-1">
                        <label className="block text-[10.5px] font-medium text-slate-300">Tipografía / Font</label>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { id: 'sans', name: 'Sans' },
                            { id: 'mono', name: 'Mono' },
                            { id: 'serif', name: 'Serif' }
                          ].map(font => (
                            <button
                              key={font.id}
                              type="button"
                              onClick={() => {
                                setThemeFont(font.id);
                                localStorage.setItem('taxi_ge_theme_font', font.id);
                              }}
                              className={`py-1 rounded text-[9.5px] font-bold uppercase tracking-wider transition-all duration-150 ${
                                themeFont === font.id 
                                  ? 'bg-amber-400 text-slate-950 font-black' 
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                              }`}
                            >
                              {font.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10.5px] font-medium text-slate-300">Densidad / Padding</label>
                        <div className="grid grid-cols-2 gap-1">
                          {[
                            { id: 'spacious', name: 'Clásica' },
                            { id: 'compact', name: 'Compacta' }
                          ].map(density => (
                            <button
                              key={density.id}
                              type="button"
                              onClick={() => {
                                setLayoutDensity(density.id);
                                localStorage.setItem('taxi_ge_layout_density', density.id);
                              }}
                              className={`py-1 rounded text-[9.5px] font-bold uppercase tracking-wider transition-all duration-150 ${
                                layoutDensity === density.id 
                                  ? 'bg-amber-400 text-slate-950 font-black' 
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                              }`}
                            >
                              {density.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {appRole === 'passenger' ? (
          <>
            {/* Navigation Tabs */}
            <div className={`flex p-1.5 rounded-2xl mb-5 transition-all duration-300 ${
              isDarkTheme() 
                ? 'bg-slate-900/90 border border-slate-800' 
                : 'bg-slate-200/60'
            }`} id="nav-tabs">
              <button
                onClick={() => setActiveTab('request')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'request' 
                    ? isDarkTheme() ? 'bg-slate-800 text-white shadow-sm font-bold border border-slate-750' : 'bg-white text-slate-900 shadow-sm' 
                    : isDarkTheme() ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
                id="tab-request-btn"
              >
                <Car className="h-4 w-4" /> Solicitar Viaje
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                  activeTab === 'history' 
                    ? isDarkTheme() ? 'bg-slate-800 text-white shadow-sm font-bold border border-slate-750' : 'bg-white text-slate-900 shadow-sm' 
                    : isDarkTheme() ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
                id="tab-history-btn"
              >
                <History className="h-4 w-4" /> Historial
                {requestHistory.length > 0 && (
                  <span className="absolute right-3 top-2.5 flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getAccentBgClass('500')} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${getAccentBgClass('500')}`}></span>
                  </span>
                )}
              </button>
            </div>

            {/* Tab 1: Request Taxi */}
            {activeTab === 'request' && (
              <div className="space-y-5" id="request-tab-content">
                
                {/* Active Request Tracker Widget */}
                {activeRequest && (
                  <motion.div 
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className={`${getCardStyleClass()} p-5 space-y-4 transition-all duration-300`}
                    id="active-request-tracker"
                  >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado de tu Solicitud</span>
                  </div>
                  
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    activeRequest.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    activeRequest.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {activeRequest.status === 'pending' ? 'Buscando Taxi ⌛' :
                     activeRequest.status === 'accepted' ? '¡Confirmado! 🚖' :
                     'Cancelado ❌'}
                  </span>
                </div>

                {activeRequest.status === 'pending' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-50 p-2.5 rounded-2xl shrink-0">
                        <Clock className="h-6 w-6 text-amber-500 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-950 text-sm">Buscando conductor cercano...</h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          Hemos enviado tu solicitud de viaje de <strong>{activeRequest.pickup}</strong> a <strong>{activeRequest.destination}</strong>. Puedes esperar en esta pantalla o cambiar al <strong>"Modo Taxista"</strong> en el selector superior para simular la aceptación de tu viaje.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-2xl p-3 flex justify-between text-xs font-mono text-slate-600">
                      <div>
                        <span className="font-semibold block text-[10px] uppercase text-slate-400">Pasajeros</span>
                        <span>{activeRequest.passengers} {activeRequest.passengers === 1 ? 'persona' : 'personas'}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold block text-[10px] uppercase text-slate-400">Tarifa Estimada</span>
                        <span className="font-bold text-emerald-600">{activeRequest.estimatedPrice.toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    {/* Tarifa Sugerida por un Taxista Conductor */}
                    {activeRequest.suggestedPrice && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 space-y-3 text-left shadow-xs"
                      >
                        <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                          <span className="text-[10px] uppercase text-amber-800 font-extrabold tracking-widest block">💰 Propuesta de Tarifa Recibida</span>
                          <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                            ¡Nueva Oferta!
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <DriverAvatar 
                            avatar={activeRequest.driverAvatar} 
                            customUrl={activeRequest.driverAvatarUrl} 
                            name={activeRequest.driverName || 'Santiago'} 
                            className="h-11 w-11 rounded-xl ring-2 ring-amber-400/30 object-cover shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-extrabold text-slate-900 text-xs">
                              {activeRequest.driverName || 'Conductor Registrado'} te sugiere:
                            </h5>
                            <p className="text-lg font-black text-amber-750 tracking-tight mt-0.5">
                              {activeRequest.suggestedPrice.toLocaleString()} FCFA
                            </p>
                            <span className="text-[10px] text-slate-500">
                              (Precio original: {activeRequest.estimatedPrice.toLocaleString()} FCFA)
                            </span>
                          </div>
                        </div>

                        {activeRequest.vehicleType && (
                          <p className="text-[11px] text-slate-600 italic">
                            Vehículo: <strong>{activeRequest.vehicleType}</strong> ({activeRequest.driverVehicleColor || 'Blanco/Amarillo'}).
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => acceptSuggestedPrice(activeRequest.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                          >
                            Aceptar Oferta ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => rejectSuggestedPrice(activeRequest.id)}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 rounded-xl text-xs transition-all cursor-pointer"
                          >
                            Rechazar Oferta ❌
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Web Notification Setup Banner */}
                    <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg shrink-0">
                          <Volume2 className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h5 className="font-bold text-xs text-slate-800">Avisos en segundo plano (Notification API)</h5>
                          <p className="text-[10.5px] text-slate-500 leading-normal mt-0.5">
                            Te enviaremos una notificación de escritorio cuando el taxista confirme tu viaje, ideal para enterarte si estás chateando en WhatsApp.
                          </p>
                        </div>
                      </div>

                      {notificationPermission === 'default' ? (
                        <button
                          type="button"
                          onClick={requestNotificationPermission}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>🔔 Activar Notificaciones de Confirmación</span>
                        </button>
                      ) : notificationPermission === 'granted' ? (
                        <div className="bg-emerald-100/60 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>¡Notificaciones activadas! Te avisaremos al confirmar.</span>
                        </div>
                      ) : (
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5 flex items-start gap-2 text-rose-800 text-[10.5px] text-left leading-normal">
                          <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>Notificaciones bloqueadas en el navegador. Haz clic en el candado al lado de la URL para habilitarlas.</span>
                        </div>
                      )}
                    </div>

                    {showCancelConfirmFor === activeRequest.id ? (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3" id="cancel-confirmation-box-pending">
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                          <div className="text-left">
                            <h5 className="font-bold text-slate-900 text-xs">¿Estás seguro de que deseas cancelar el viaje?</h5>
                            <p className="text-[11px] text-slate-600 leading-normal mt-0.5">
                              Esta acción cancelará tu solicitud actual y los taxistas ya no podrán atenderte para este trayecto.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => cancelRequestByPassenger(activeRequest.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-xs"
                            id="confirm-cancel-yes-pending"
                          >
                            Sí, cancelar viaje ❌
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCancelConfirmFor(null)}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-all hover:bg-slate-50"
                            id="confirm-cancel-no-pending"
                          >
                            No, mantener viaje
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirmFor(activeRequest.id)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 rounded-xl text-xs transition-colors border border-red-200"
                        id="cancel-request-pending-btn"
                      >
                        Cancelar Solicitud de Viaje ❌
                      </button>
                    )}
                  </div>
                )}

                {activeRequest.status === 'accepted' && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-emerald-50 p-2.5 rounded-2xl shrink-0">
                        <UserCheck className="h-6 w-6 text-emerald-600 animate-bounce" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-950 text-sm">¡Tu taxista viene en camino! 🎉</h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          La central o un conductor cercano ha confirmado tu viaje. Por favor, prepárate para abordar el vehículo.
                        </p>
                      </div>
                    </div>

                    {/* Ficha Oficial del Conductor Asignado */}
                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-3xl p-4.5 space-y-4 text-left">
                      <div className="flex items-center justify-between border-b border-emerald-100/50 pb-2">
                        <span className="text-[10px] uppercase text-emerald-800 font-extrabold tracking-widest block">🚖 Ficha de Identidad del Conductor</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Confirmado ✓
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5 text-left">
                        <DriverAvatar 
                          avatar={activeRequest.driverAvatar} 
                          customUrl={activeRequest.driverAvatarUrl} 
                          name={activeRequest.driverName || 'Santiago'} 
                          className="h-14 w-14 rounded-2xl ring-4 ring-emerald-400/20 shadow-md object-cover" 
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-extrabold text-slate-900 text-sm tracking-tight">
                            {activeRequest.driverName || 'Santiago'} {activeRequest.driverLastName || 'Nguema'}
                          </h5>
                          
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-0.5 text-[10.5px]">
                            <span className="text-amber-700 font-bold uppercase tracking-wide bg-amber-50 px-1.5 py-0.5 rounded">
                              {activeRequest.driverExperience === 'novato' ? 'Novato (0-2a)' :
                               activeRequest.driverExperience === 'ocasional' ? 'Ocasional (2-5a)' :
                               activeRequest.driverExperience === 'profesional' ? 'Profesional (5-10a)' : 'Experto (10a+)'}
                            </span>
                            <div className="flex items-center gap-0.5 text-emerald-800 font-extrabold">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                              <span>4.9/5 Media</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle and Plate Info Grid */}
                      <div className="grid grid-cols-3 gap-2.5 bg-white p-3 rounded-2xl border border-emerald-100/60 shadow-xs text-xs text-left">
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[9px] uppercase text-emerald-700 font-bold tracking-wider block">Vehículo</span>
                          <span className="font-bold text-slate-850 block truncate" title={activeRequest.vehicleType || 'Toyota Corolla'}>
                            {activeRequest.vehicleType || 'Toyota Corolla'}
                          </span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[9px] uppercase text-emerald-700 font-bold tracking-wider block">Color</span>
                          <span className="font-bold text-slate-850 block truncate" title={activeRequest.driverVehicleColor || 'Blanco/Amarillo'}>
                            {activeRequest.driverVehicleColor || 'Blanco/Amarillo'}
                          </span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[9px] uppercase text-emerald-700 font-bold tracking-wider block">Matrícula</span>
                          <span className="font-mono font-black text-emerald-950 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block text-[10.5px] truncate max-w-full">
                            {activeRequest.vehiclePlate || 'M-4892-A'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-emerald-100/50 flex items-center justify-between text-xs text-emerald-800">
                        <span className="font-medium">Número de Contacto:</span>
                        <a 
                          href={`tel:+${activeRequest.driverPhone || '240555312102'}`}
                          className="font-mono font-black text-emerald-900 hover:underline flex items-center gap-1 bg-emerald-100/80 hover:bg-emerald-200/80 px-2.5 py-1 rounded-xl transition-all"
                        >
                          <Phone className="h-3.5 w-3.5 shrink-0 animate-pulse text-emerald-600" /> +{activeRequest.driverPhone || '240555312102'}
                        </a>
                      </div>
                    </div>

                    {/* Live Driver Proximity Tracker */}
                    <div id="driver-live-proximity-container" className="animate-fade-in">
                      <DriverProximityTracker
                        request={activeRequest}
                        onArrived={() => {
                          setStatus('¡Tu taxista ha llegado! Por favor, búscalo con matrícula ' + (activeRequest.vehiclePlate || 'M-4892-A'));
                          setStatusType('success');
                        }}
                      />
                    </div>

                    {/* GPS Navigation Live Trigger */}
                    <div className="space-y-2">
                      {showGpsNavigatorFor === activeRequest.id ? (
                        <div id="passenger-gps-pane" className="animate-fade-in">
                          <GpsNavigator
                            city={activeRequest.city}
                            pickup={activeRequest.pickup}
                            destination={activeRequest.destination}
                            onClose={() => setShowGpsNavigatorFor(null)}
                            isDriver={false}
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setShowGpsNavigatorFor(activeRequest.id);
                            setStatus('GPS iniciado: Sigue la navegación en tiempo real de tu taxi.');
                            setStatusType('success');
                          }}
                          className="w-full bg-slate-950 hover:bg-slate-900 text-slate-100 border border-slate-800 font-bold py-3 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                          id="passenger-open-gps-btn"
                        >
                          <Navigation className="h-4 w-4 text-sky-400 animate-bounce" />
                          Iniciar Navegación GPS en Tiempo Real 🧭
                        </button>
                      )}
                    </div>

                    {/* Sección de Confirmación de Pago del Pasajero */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-4 space-y-3 text-left shadow-xs" id="payment-confirmation-section">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Confirmación de Pago</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          (activeRequest.paymentStatus || 'pending') === 'paid' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {(activeRequest.paymentStatus || 'pending') === 'paid' ? 'Viaje Pagado ✓' : 'Factura Pendiente ⏳'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Selecciona el estado de pago una vez realizado el abono de la carrera en Guinea Ecuatorial.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setRequestPaymentStatus(activeRequest.id, 'pending')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            (activeRequest.paymentStatus || 'pending') === 'pending'
                              ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400'
                              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                          id="pay-pending-btn"
                        >
                          Factura Pendiente ⏳
                        </button>
                        <button
                          type="button"
                          onClick={() => setRequestPaymentStatus(activeRequest.id, 'paid')}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            (activeRequest.paymentStatus || 'pending') === 'paid'
                              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                          id="pay-paid-btn"
                        >
                          Viaje Pagado ✓
                        </button>
                      </div>

                      {/* Passenger Acknowledgment Alert */}
                      {(activeRequest.paymentStatus || 'pending') === 'paid' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-emerald-100 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-emerald-950 text-xs font-bold mt-2"
                          id="passenger-payment-success-badge"
                        >
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                          <span>Viaje Pagado con éxito 🎉</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Completion and Rating Card */}
                    <div className="bg-amber-50/50 border border-amber-200/40 rounded-2xl p-4 space-y-3" id="completion-rating-card">
                      <div className="flex items-center gap-2">
                        <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-400" />
                        <h5 className="font-bold text-xs text-slate-850 uppercase tracking-wider">¿Llegaste a tu destino?</h5>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        Finaliza tu carrera aquí para valorar al taxista y registrar la calificación en su ficha de conductor de Guinea Ecuatorial.
                      </p>

                      {ratingSubmittingFor === activeRequest.id ? (
                        <div className="space-y-3 pt-1" id="rating-form-expanded">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-600 font-medium mr-1">Toca las estrellas:</span>
                            {[1, 2, 3, 4, 5].map((stars) => (
                              <button
                                key={stars}
                                type="button"
                                onClick={() => setRatingStars(stars)}
                                className="focus:outline-none transition-transform active:scale-125 hover:scale-110 p-0.5"
                                id={`star-select-btn-${stars}`}
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    stars <= ratingStars
                                      ? 'text-amber-500 fill-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-slate-600" htmlFor="rating-comment-input">
                              Comentario u opinión (opcional):
                            </label>
                            <input
                              type="text"
                              id="rating-comment-input"
                              value={ratingText}
                              onChange={(e) => setRatingText(e.target.value)}
                              placeholder="Ej. Excelente servicio, coche muy limpio..."
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => completeAndRateRequest(activeRequest.id, ratingStars, ratingText)}
                              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg text-xs transition-colors"
                              id="submit-rating-btn"
                            >
                              Enviar Calificación ⭐
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRatingSubmittingFor(null);
                              }}
                              className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-lg text-xs transition-colors"
                              id="cancel-rating-btn"
                            >
                              Atrás
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setRatingSubmittingFor(activeRequest.id);
                            setRatingStars(5);
                            setRatingText('');
                          }}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          id="trigger-rating-btn"
                        >
                          Completar y Calificar Carrera ⭐
                        </button>
                      )}
                    </div>

                    {showCancelConfirmFor === activeRequest.id ? (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3 w-full" id="cancel-confirmation-box-accepted">
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                          <div className="text-left">
                            <h5 className="font-bold text-slate-900 text-xs">¿Estás seguro de que deseas cancelar el viaje?</h5>
                            <p className="text-[11px] text-slate-600 leading-normal mt-0.5">
                              Esta acción cancelará tu viaje en curso y liberará al taxista asignado.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => cancelRequestByPassenger(activeRequest.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-xs"
                            id="confirm-cancel-yes-accepted"
                          >
                            Sí, cancelar viaje ❌
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCancelConfirmFor(null)}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-all hover:bg-slate-50"
                            id="confirm-cancel-no-accepted"
                          >
                            No, mantener viaje
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 w-full">
                        <a
                          href={`https://wa.me/${activeRequest.driverPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm text-center"
                        >
                          <Phone className="h-4 w-4" /> Hablar por WhatsApp
                        </a>
                        <button
                          type="button"
                          onClick={() => setShowCancelConfirmFor(activeRequest.id)}
                          className="px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-xl text-xs transition-colors"
                          title="Cancelar viaje"
                          id="cancel-request-accepted-btn"
                        >
                          Cancelar Viaje
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeRequest.status === 'cancelled_by_driver' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-red-50 p-2.5 rounded-2xl shrink-0">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-950 text-sm">El conductor canceló la solicitud</h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          Lamentamos que el taxi asignado no esté disponible. Por favor, crea una nueva solicitud para buscar otro conductor.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRequestId(null);
                        localStorage.removeItem('taxi_ge_active_request_id');
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                    >
                      Solicitar otro Taxi 🚖
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Main Form Card */}
            <div className={`${getCardStyleClass()} p-5 space-y-4 transition-all duration-300`} id="form-card">
              
              {/* City Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Selecciona la Ciudad</label>
                <div className="grid grid-cols-2 gap-3" id="city-selector-grid">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCity(c);
                        setPickup('');
                        setDestination('');
                      }}
                      className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold border-2 transition-all duration-200 ${city === c ? 'bg-emerald-50 border-emerald-600 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
                      id={`city-btn-${c.toLowerCase()}`}
                    >
                      <Compass className={`h-4 w-4 ${city === c ? 'text-emerald-600 animate-spin-slow' : 'text-slate-400'}`} />
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between" htmlFor="phone-input">
                  <span>Tu número de WhatsApp</span>
                  <span className="text-[10px] text-emerald-600 font-semibold lowercase bg-emerald-50 px-1.5 py-0.5 rounded">Para recibir confirmación</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    id="phone-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Tu número (Ej. 222111222)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-sm"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  * Nota: El número administrador oficial <strong className="text-slate-600 font-bold">222111222</strong> desbloquea el panel de control administrativo.
                </p>
              </div>

              {/* Grouped Location Fields with Side D3 Visualization */}
              <div className="flex gap-3 items-stretch" id="route-inputs-and-visualizer-row">
                <div className="flex-1 space-y-3 min-w-0" id="address-inputs-col">
                  {/* Pickup Location */}
                  <div className="space-y-1 relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between" htmlFor="pickup-input">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                        Punto de Recogida
                      </span>
                      <button 
                        type="button"
                        onClick={() => {
                          setPickup('Mi ubicación actual 📍');
                        }}
                        className="text-[11px] text-emerald-600 hover:underline font-semibold"
                      >
                        Usar Mi Ubicación
                      </button>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                      </div>
                      <input
                        type="text"
                        id="pickup-input"
                        value={pickup}
                        onChange={(e) => {
                          setPickup(e.target.value);
                          setShowPickupSuggestions(true);
                        }}
                        onFocus={() => setShowPickupSuggestions(true)}
                        placeholder="Origen..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-xs"
                        autoComplete="off"
                      />
                    </div>

                    {/* Pickup Suggestions dropdown */}
                    {showPickupSuggestions && NEIGHBORHOODS[city] && (
                      <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-52 overflow-y-auto divide-y divide-slate-100" id="pickup-suggestions">
                        <div className="p-2 bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 flex justify-between items-center">
                          <span>Barrios populares ({city})</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPickupSuggestions(false);
                            }}
                            className="hover:text-slate-600"
                          >
                            Cerrar
                          </button>
                        </div>
                        {NEIGHBORHOODS[city]
                          .filter(n => n.name.toLowerCase().includes(pickup.toLowerCase()) || pickup === '')
                          .map((n, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setPickup(n.name);
                                setShowPickupSuggestions(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors flex flex-col"
                            >
                              <span className="font-semibold text-slate-800">{n.name}</span>
                              <span className="text-[10px] text-slate-400">{n.description}</span>
                            </button>
                        ))}
                        {NEIGHBORHOODS[city].filter(n => n.name.toLowerCase().includes(pickup.toLowerCase())).length === 0 && (
                          <div className="p-2.5 text-xs text-slate-400 text-center">Escribe tu lugar libremente</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Destination Location */}
                  <div className="space-y-1 relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5" htmlFor="destination-input">
                      <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>
                      Punto de Destino
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="h-4 w-4 text-red-500" />
                      </div>
                      <input
                        type="text"
                        id="destination-input"
                        value={destination}
                        onChange={(e) => {
                          setDestination(e.target.value);
                          setShowDestSuggestions(true);
                        }}
                        onFocus={() => setShowDestSuggestions(true)}
                        placeholder="Destino..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-xs"
                        autoComplete="off"
                      />
                    </div>

                    {/* Destination Suggestions dropdown */}
                    {showDestSuggestions && NEIGHBORHOODS[city] && (
                      <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-52 overflow-y-auto divide-y divide-slate-100" id="destination-suggestions">
                        <div className="p-2 bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 flex justify-between items-center">
                          <span>Destinos populares ({city})</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDestSuggestions(false);
                            }}
                            className="hover:text-slate-600"
                          >
                            Cerrar
                          </button>
                        </div>
                        {NEIGHBORHOODS[city]
                          .filter(n => n.name.toLowerCase().includes(destination.toLowerCase()) || destination === '')
                          .map((n, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setDestination(n.name);
                                setShowDestSuggestions(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors flex flex-col"
                            >
                              <span className="font-semibold text-slate-800">{n.name}</span>
                              <span className="text-[10px] text-slate-400">{n.description}</span>
                            </button>
                        ))}
                        {NEIGHBORHOODS[city].filter(n => n.name.toLowerCase().includes(destination.toLowerCase())).length === 0 && (
                          <div className="p-2.5 text-xs text-slate-400 text-center">Escribe tu destino libremente</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* D3 Interactive Map Visualization Column */}
                <div className="flex justify-center items-center shrink-0 self-center" id="d3-visualizer-col">
                  <RouteVisualizer city={city} pickup={pickup} destination={destination} dataSaver={dataSaver} />
                </div>
              </div>

              {/* Distance and Duration Estimation Card with Real Route Validation */}
              {pickup && destination && (
                <div className="space-y-2.5" id="route-validation-and-estimation-container">
                  {/* Real Route Validation Panel */}
                  {(() => {
                    const isIdentical = pickup.trim().toLowerCase() === destination.trim().toLowerCase();
                    const isShort = pickup.trim().length < 3 || destination.trim().length < 3;
                    const officialPickups = NEIGHBORHOODS[city]?.map(n => n.name.toLowerCase().trim()) || [];
                    const isOfficialPickup = officialPickups.includes(pickup.toLowerCase().trim());
                    const isOfficialDestination = officialPickups.includes(destination.toLowerCase().trim());
                    const isFullyOfficial = isOfficialPickup && isOfficialDestination;

                    if (isIdentical) {
                      return (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-start gap-3 text-red-800 animate-pulse" id="route-validation-error">
                          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-xs uppercase tracking-wider">{t('routeValidation')} ❌</p>
                            <p className="text-xs font-semibold mt-0.5">El origen y el destino son idénticos.</p>
                            <p className="text-[10px] text-red-600 mt-1">Por favor, cambia una de las ubicaciones para calcular un trayecto real de taxi.</p>
                          </div>
                        </div>
                      );
                    }

                    if (isShort) {
                      return (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-amber-900" id="route-validation-short">
                          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-xs uppercase tracking-wider">{t('routeValidation')} ⚠️</p>
                            <p className="text-xs font-semibold mt-0.5">Direcciones demasiado cortas.</p>
                            <p className="text-[10px] text-amber-700 mt-1">Escribe al menos 3 caracteres para que los taxistas puedan localizar la dirección.</p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className={`border rounded-2xl p-3.5 flex items-start gap-3 ${isFullyOfficial ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-blue-50/70 border-blue-200 text-blue-900'}`} id="route-validation-success">
                        <CheckCircle2 className={`h-5 w-5 shrink-0 mt-0.5 ${isFullyOfficial ? 'text-emerald-600' : 'text-blue-600'}`} />
                        <div className="flex-1">
                          <p className="font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                            <span>{t('routeValidation')} ✓</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${isFullyOfficial ? 'bg-emerald-200 text-emerald-800' : 'bg-blue-200 text-blue-800'}`}>
                              {isFullyOfficial ? 'Ruta Oficial 📍' : 'Dirección Propia 🧭'}
                            </span>
                          </p>
                          <p className="text-xs font-semibold mt-0.5">
                            {isFullyOfficial 
                              ? `Ruta 100% auténtica de ${city}.` 
                              : `Ruta personalizada por coordenadas.`}
                          </p>
                          <p className={`text-[10px] mt-1 ${isFullyOfficial ? 'text-emerald-700' : 'text-blue-700'}`}>
                            {isFullyOfficial 
                              ? 'Barrios oficiales reconocidos por el sindicato de taxistas.' 
                              : 'Asegúrate de que el taxista conozca este punto de referencia o calle de Guinea Ecuatorial.'}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Distance and Duration Estimation Card */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs"
                    id="distance-duration-estimator"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-sky-100 text-sky-700 p-2.5 rounded-xl">
                        <Navigation className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cálculo de Distancia</span>
                        <p className="text-sm font-semibold text-slate-800">
                          Distancia Estimada: <span className="font-mono text-sky-700 font-bold">{calculateDistance(pickup, destination).km} km</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Duración</span>
                      <span className="font-mono font-bold text-slate-700 text-xs">~{calculateDistance(pickup, destination).min} min</span>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Passengers Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Número de Pasajeros</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPassengersCount(num)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all duration-150 ${passengersCount === num ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-102' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                      id={`passengers-${num}-btn`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency Level Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría de Urgencia del Cliente</label>
                <div className="grid grid-cols-2 gap-2" id="urgency-selector">
                  {(['normal', 'intermedio', 'urgente', 'muy_urgente'] as const).map(level => {
                    const levelMeta = {
                      normal: { label: 'Viaje Normal', desc: 'Sin prisa', color: 'border-slate-200 text-slate-700 bg-slate-50/50', activeColor: 'bg-emerald-600 text-white border-emerald-600' },
                      intermedio: { label: 'Viaje Intermedio', desc: 'Prisa moderada', color: 'border-slate-200 text-slate-700 bg-slate-50/50', activeColor: 'bg-amber-500 text-slate-950 border-amber-500' },
                      urgente: { label: 'Viaje Urgente', desc: 'Prioridad directa', color: 'border-slate-200 text-slate-700 bg-slate-50/50', activeColor: 'bg-orange-500 text-white border-orange-500' },
                      muy_urgente: { label: 'Muy Urgente', desc: 'Emergencia / Prisa máxima', color: 'border-slate-200 text-slate-700 bg-slate-50/50', activeColor: 'bg-red-600 text-white border-red-600' }
                    };
                    const meta = levelMeta[level];
                    const isSelected = urgencyLevel === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setUrgencyLevel(level)}
                        className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all duration-150 ${isSelected ? `${meta.activeColor} shadow-sm scale-102` : `${meta.color} hover:bg-slate-100/50`}`}
                        id={`urgency-${level}-btn`}
                      >
                        <div className="flex items-center gap-1.5">
                          {level === 'muy_urgente' ? <Flame className="h-3.5 w-3.5" /> : <div className={`h-2 w-2 rounded-full ${isSelected ? 'bg-white' : 'bg-current'}`} />}
                          <span className="text-xs font-bold">{meta.label}</span>
                        </div>
                        <span className="text-[10px] opacity-85 mt-0.5">{meta.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Clase de Servicio & Tarifa</label>
                <div className="space-y-2.5" id="service-selector">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setServiceClass(s.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${serviceClass === s.id ? 'bg-slate-50 border-emerald-600 text-slate-900 shadow-xs' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                      id={`service-btn-${s.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${serviceClass === s.id ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`} id={`service-icon-wrapper-${s.id}`}>
                          {getServiceIcon(s.id)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5 leading-tight">{s.description}</p>
                        </div>
                      </div>
                      <div className="text-right pl-2">
                        <p className="font-mono font-bold text-emerald-600 text-sm whitespace-nowrap">
                          {s.id === 'propuesta' 
                            ? `${customPrice.toLocaleString()} FCFA` 
                            : s.id === 'especial'
                              ? `${specialPrice.toLocaleString()} FCFA`
                              : s.id === 'aeropuerto'
                                ? `${aeropuertoPrice.toLocaleString()} FCFA`
                                : `${s.price.toLocaleString()} FCFA`}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">
                          {s.id === 'propuesta' 
                            ? 'Tú ofreces' 
                            : (s.id === 'especial' || s.id === 'aeropuerto')
                              ? 'Ajustable'
                              : 'Estimado'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Carrera Especial Adjustable Price Selector */}
              {serviceClass === 'especial' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 rounded-2xl p-4 border border-blue-100 space-y-3"
                  id="special-price-selector"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" /> Tarifa Especial (1000 - 5000 FCFA)
                      </h4>
                      <p className="text-[11px] text-blue-700">Selecciona o ajusta tu tarifa para esta carrera especial privada</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSpecialPrice(prev => Math.max(1000, prev - 500))}
                      className="bg-white hover:bg-blue-100 active:bg-blue-200 text-blue-800 border border-blue-200 h-11 w-11 rounded-xl font-bold flex items-center justify-center transition-colors text-lg shadow-sm"
                      id="special-price-minus-btn"
                    >
                      -
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={specialPrice || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                          setSpecialPrice(Math.min(5000, Math.max(1000, val)));
                        }}
                        placeholder="Ej. 2500"
                        className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-blue-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-lg shadow-inner"
                        id="special-price-input"
                      />
                      <span className="absolute right-3 top-3 text-[10px] font-bold text-blue-400 font-mono">FCFA</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSpecialPrice(prev => Math.min(5000, prev + 500))}
                      className="bg-white hover:bg-blue-100 active:bg-blue-200 text-blue-800 border border-blue-200 h-11 w-11 rounded-xl font-bold flex items-center justify-center transition-colors text-lg shadow-sm"
                      id="special-price-plus-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex justify-between text-[11px] text-blue-700 font-bold px-1">
                    <button type="button" onClick={() => setSpecialPrice(1000)} className={`px-2 py-1 rounded bg-white border border-blue-150 shadow-3xs hover:bg-blue-100 transition-all ${specialPrice === 1000 ? 'bg-blue-200 ring-2 ring-blue-500' : ''}`}>1.000</button>
                    <button type="button" onClick={() => setSpecialPrice(2000)} className={`px-2 py-1 rounded bg-white border border-blue-150 shadow-3xs hover:bg-blue-100 transition-all ${specialPrice === 2000 ? 'bg-blue-200 ring-2 ring-blue-500' : ''}`}>2.000</button>
                    <button type="button" onClick={() => setSpecialPrice(2500)} className={`px-2 py-1 rounded bg-white border border-blue-150 shadow-3xs hover:bg-blue-100 transition-all ${specialPrice === 2500 ? 'bg-blue-200 ring-2 ring-blue-500' : ''}`}>2.500 (Est)</button>
                    <button type="button" onClick={() => setSpecialPrice(3500)} className={`px-2 py-1 rounded bg-white border border-blue-150 shadow-3xs hover:bg-blue-100 transition-all ${specialPrice === 3500 ? 'bg-blue-200 ring-2 ring-blue-500' : ''}`}>3.500</button>
                    <button type="button" onClick={() => setSpecialPrice(5000)} className={`px-2 py-1 rounded bg-white border border-blue-150 shadow-3xs hover:bg-blue-100 transition-all ${specialPrice === 5000 ? 'bg-blue-200 ring-2 ring-blue-500' : ''}`}>5.000</button>
                  </div>
                </motion.div>
              )}

              {/* Servicio Aeropuerto Adjustable Price Selector */}
              {serviceClass === 'aeropuerto' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-sky-50 rounded-2xl p-4 border border-sky-100 space-y-3"
                  id="aeropuerto-price-selector"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-sky-600 animate-pulse" /> Tarifa Aeropuerto (1000 - 5000 FCFA)
                      </h4>
                      <p className="text-[11px] text-sky-700">Selecciona o ajusta tu tarifa para el trayecto al aeropuerto</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAeropuertoPrice(prev => Math.max(1000, prev - 500))}
                      className="bg-white hover:bg-sky-100 active:bg-sky-200 text-sky-800 border border-sky-200 h-11 w-11 rounded-xl font-bold flex items-center justify-center transition-colors text-lg shadow-sm"
                      id="aeropuerto-price-minus-btn"
                    >
                      -
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={aeropuertoPrice || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                          setAeropuertoPrice(Math.min(5000, Math.max(1000, val)));
                        }}
                        placeholder="Ej. 5000"
                        className="w-full bg-white border border-sky-200 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-sky-900 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all text-lg shadow-inner"
                        id="aeropuerto-price-input"
                      />
                      <span className="absolute right-3 top-3 text-[10px] font-bold text-sky-400 font-mono">FCFA</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAeropuertoPrice(prev => Math.min(5000, prev + 500))}
                      className="bg-white hover:bg-sky-100 active:bg-sky-200 text-sky-800 border border-sky-200 h-11 w-11 rounded-xl font-bold flex items-center justify-center transition-colors text-lg shadow-sm"
                      id="aeropuerto-price-plus-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex justify-between text-[11px] text-sky-700 font-bold px-1">
                    <button type="button" onClick={() => setAeropuertoPrice(1000)} className={`px-2 py-1 rounded bg-white border border-sky-150 shadow-3xs hover:bg-sky-100 transition-all ${aeropuertoPrice === 1000 ? 'bg-sky-200 ring-2 ring-sky-500' : ''}`}>1.000</button>
                    <button type="button" onClick={() => setAeropuertoPrice(2000)} className={`px-2 py-1 rounded bg-white border border-sky-150 shadow-3xs hover:bg-sky-100 transition-all ${aeropuertoPrice === 2000 ? 'bg-sky-200 ring-2 ring-sky-500' : ''}`}>2.000</button>
                    <button type="button" onClick={() => setAeropuertoPrice(3000)} className={`px-2 py-1 rounded bg-white border border-sky-150 shadow-3xs hover:bg-sky-100 transition-all ${aeropuertoPrice === 3000 ? 'bg-sky-200 ring-2 ring-sky-500' : ''}`}>3.000</button>
                    <button type="button" onClick={() => setAeropuertoPrice(4000)} className={`px-2 py-1 rounded bg-white border border-sky-150 shadow-3xs hover:bg-sky-100 transition-all ${aeropuertoPrice === 4000 ? 'bg-sky-200 ring-2 ring-sky-500' : ''}`}>4.000</button>
                    <button type="button" onClick={() => setAeropuertoPrice(5000)} className={`px-2 py-1 rounded bg-white border border-sky-150 shadow-3xs hover:bg-sky-100 transition-all ${aeropuertoPrice === 5000 ? 'bg-sky-200 ring-2 ring-sky-500' : ''}`}>5.000 (Est)</button>
                  </div>
                </motion.div>
              )}

              {/* Custom Price Propose Input */}
              {serviceClass === 'propuesta' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-50 rounded-2xl p-4 border border-purple-100 space-y-3"
                  id="custom-price-selector"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">Tu Propuesta de Tarifa</h4>
                      <p className="text-[11px] text-purple-700">Introduce la cantidad en Francos CFA (FCFA) que deseas ofrecer</p>
                    </div>
                    <Sparkles className="h-5 w-5 text-purple-600 shrink-0" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomPrice(prev => Math.max(500, prev - 500))}
                      className="bg-white hover:bg-purple-100 active:bg-purple-200 text-purple-800 border border-purple-200 h-11 w-11 rounded-xl font-bold flex items-center justify-center transition-colors text-lg shadow-sm"
                      id="price-minus-btn"
                    >
                      -
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={customPrice || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                          setCustomPrice(val);
                        }}
                        placeholder="Ej. 1500"
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-purple-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all text-lg shadow-inner"
                        id="custom-price-input"
                      />
                      <span className="absolute right-3 top-3 text-[10px] font-bold text-purple-400 font-mono">FCFA</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCustomPrice(prev => prev + 500)}
                      className="bg-white hover:bg-purple-100 active:bg-purple-200 text-purple-800 border border-purple-200 h-11 w-11 rounded-xl font-bold flex items-center justify-center transition-colors text-lg shadow-sm"
                      id="price-plus-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex justify-between text-[11px] text-purple-700 font-semibold px-1">
                    <button type="button" onClick={() => setCustomPrice(1000)} className="hover:underline">1,000 FCFA</button>
                    <button type="button" onClick={() => setCustomPrice(1500)} className="hover:underline">1,500 FCFA</button>
                    <button type="button" onClick={() => setCustomPrice(2000)} className="hover:underline">2,000 FCFA</button>
                    <button type="button" onClick={() => setCustomPrice(3000)} className="hover:underline">3,000 FCFA</button>
                  </div>
                </motion.div>
              )}

              {/* Price Estimate Summary Badge */}
              <div className="bg-emerald-50 rounded-2xl p-4 flex items-center justify-between border border-emerald-100" id="estimate-summary">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 text-white p-1 rounded-lg" id="sparkle-wrapper">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800">
                      {serviceClass === 'propuesta' 
                        ? 'Tarifa Propuesta por Ti' 
                        : (serviceClass === 'especial' || serviceClass === 'aeropuerto') 
                          ? 'Tarifa Seleccionada por Ti' 
                          : 'Tarifa Estimada de la Carrera'}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium">Pago en efectivo al conductor en Guinea Ecuatorial</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xl font-bold text-emerald-700">
                    {(serviceClass === 'propuesta' 
                      ? customPrice 
                      : serviceClass === 'especial' 
                        ? specialPrice 
                        : serviceClass === 'aeropuerto' 
                          ? aeropuertoPrice 
                          : currentService.price
                    ).toLocaleString()} <span className="text-xs font-semibold">FCFA</span>
                  </span>
                </div>
              </div>

              {/* Status Alert Area */}
              <div className={`p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-medium transition-all duration-200 ${
                statusType === 'error' ? 'bg-red-50 text-red-700 border border-red-100' :
                statusType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                'bg-slate-50 text-slate-600 border border-slate-100'
              }`} id="status-alert">
                {statusType === 'error' ? <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" /> : 
                 statusType === 'success' ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" /> : 
                 <Info className="h-4.5 w-4.5 text-slate-400 shrink-0" />}
                <div>
                  <p className="font-bold" id="status-title-label">Estado de la Solicitud:</p>
                  <p className="mt-0.5 leading-relaxed" id="status-msg-label">{status}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={requestRide}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-4 px-6 rounded-2xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer text-base"
                  id="request-taxi-main-btn"
                >
                  <Car className="h-5 w-5 animate-bounce-slow" />
                  Solicitar Taxi por WhatsApp
                </button>

                {/* Extra Utility Action: Copy message to clipboard */}
                {pickup && destination && phone && (
                  <div className="grid grid-cols-2 gap-2" id="utility-buttons-grid">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
                      title="Copiar mensaje de texto formateado"
                      id="copy-text-btn"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-600" />
                          ¡Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copiar Texto
                        </>
                      )}
                    </button>
                    <a
                      href={`https://wa.me/${customDriverPhone.replace(/\s+/g, '')}?text=${encodeURIComponent(generateMessage())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-semibold text-xs transition-colors text-center"
                      title="Abrir enlace directo"
                      id="direct-wa-link"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Enlace Directo
                    </a>
                  </div>
                )}
              </div>

            </div>

            {/* Real-time Message Preview Panel */}
            {pickup && destination && phone && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 text-slate-100 rounded-3xl p-5 border border-slate-800 shadow-inner space-y-3"
                id="message-preview-panel"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Mensaje que recibirá el conductor:</span>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] text-emerald-400 font-mono">Format listo</span>
                  </div>
                </div>
                <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-emerald-300 bg-slate-950 p-3.5 rounded-xl border border-slate-850 overflow-x-auto" id="message-text-preview">
                  {generateMessage()}
                </pre>
              </motion.div>
            )}

            {/* Main Screen Customize Style Widget */}
            <div className={`${getCardStyleClass()} p-5 space-y-4 transition-all duration-300`} id="style-customizer-card">
              <div className="flex items-center gap-2.5 border-b pb-3 border-slate-100 dark:border-slate-800">
                <Palette className={`h-5 w-5 ${getAccentTextClass('600')}`} />
                <div className="text-left">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Personalizar Pantalla</h4>
                  <h3 className={`font-display font-bold text-sm ${isDarkTheme() ? 'text-white' : 'text-slate-800'}`}>Estilo, Colores y Diseño</h3>
                </div>
              </div>

              {/* Wallpaper Selector */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">Fondo de Pantalla / Wallpaper</label>
                <div className="grid grid-cols-7 gap-1.5" id="wallpaper-selector">
                  {[
                    { id: 'solid-light', name: 'Gris', bg: 'bg-slate-250 border-slate-350' },
                    { id: 'solid-dark', name: 'Carbón', bg: 'bg-slate-800 border-slate-700' },
                    { id: 'gradient-emerald', name: 'Esmeralda', bg: 'bg-gradient-to-br from-emerald-200 to-teal-400 border-emerald-350' },
                    { id: 'gradient-sunset', name: 'Sunset', bg: 'bg-gradient-to-br from-orange-200 to-rose-400 border-orange-350' },
                    { id: 'gradient-ocean', name: 'Océano', bg: 'bg-gradient-to-br from-sky-200 to-indigo-400 border-sky-350' },
                    { id: 'gradient-midnight', name: 'Noche', bg: 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800' },
                    { id: 'retro-glass', name: 'Retro', bg: 'bg-radial-gradient from-slate-900 to-black border-slate-800' },
                  ].map((wp) => (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => {
                        setWallpaper(wp.id);
                        localStorage.setItem('taxi_ge_wallpaper', wp.id);
                      }}
                      className={`h-11 rounded-xl relative border flex flex-col items-center justify-center transition-all ${wp.bg} ${
                        wallpaper === wp.id 
                          ? 'ring-2 ring-amber-400 scale-105 shadow-md' 
                          : 'opacity-85 hover:opacity-100 hover:scale-102'
                      }`}
                      title={wp.name}
                      id={`wallpaper-btn-${wp.id}`}
                    >
                      {wallpaper === wp.id && (
                        <div className="absolute inset-0 bg-black/15 rounded-xl flex items-center justify-center">
                          <Check className="h-4.5 w-4.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)] stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[8px] text-slate-400 font-bold px-0.5 uppercase tracking-wider">
                  <span>Gris</span>
                  <span>Carbón</span>
                  <span>Esmeralda</span>
                  <span>Sunset</span>
                  <span>Océano</span>
                  <span>Noche</span>
                  <span>Retro</span>
                </div>
              </div>

              {/* Card Style Selector */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">Estilo de Tarjeta (Apariencia)</label>
                <div className="grid grid-cols-3 gap-1.5" id="card-style-selector">
                  {[
                    { id: 'glassmorphism', name: 'Vidrio ✨', desc: 'Esmerilado' },
                    { id: 'soft-shadows', name: 'Sombra ☁️', desc: 'Suave' },
                    { id: 'neobrutalism', name: 'Brutal 🎨', desc: 'Contornos' },
                    { id: 'minimalist', name: 'Minimal 📐', desc: 'Ultra plano' },
                    { id: 'retro-terminal', name: 'Retro 📟', desc: 'Terminal' },
                    { id: 'soft-clay', name: 'Clay ☁️', desc: 'Relieve' },
                  ].map((style) => {
                    const isActive = cardStyle === style.id;
                    const isDark = isDarkTheme();
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          setCardStyle(style.id);
                          localStorage.setItem('taxi_ge_card_style', style.id);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between h-15 ${
                          isActive
                            ? 'bg-amber-400/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-xs'
                            : isDark
                              ? 'bg-slate-800/50 border-slate-750 text-slate-300 hover:bg-slate-800'
                              : 'bg-slate-50/50 border-slate-150 text-slate-700 hover:bg-slate-100/50'
                        }`}
                        id={`cardstyle-btn-${style.id}`}
                      >
                        <span className="font-bold text-[11px] leading-tight block">{style.name}</span>
                        <span className="text-[8px] opacity-75 leading-none block">{style.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent & Spacing customizer controls inside the main screen widget */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">Tema de Color</label>
                  <select
                    value={accentColor}
                    onChange={(e) => {
                      setAccentColor(e.target.value);
                      localStorage.setItem('taxi_ge_accent_color', e.target.value);
                    }}
                    className={`w-full text-xs font-semibold rounded-xl border p-2 focus:outline-none ${
                      isDarkTheme() 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="emerald">💚 Verde Esmeralda</option>
                    <option value="indigo">💙 Azul Océano</option>
                    <option value="amber">💛 Oro Taxi</option>
                    <option value="rose">💖 Rosa Sunset</option>
                    <option value="violet">💜 Violeta Cyber</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">Densidad / Diseño</label>
                  <div className="grid grid-cols-2 gap-1 h-8">
                    {[
                      { id: 'spacious', name: 'Clásico' },
                      { id: 'compact', name: 'Compacto' }
                    ].map(density => (
                      <button
                        key={density.id}
                        type="button"
                        onClick={() => {
                          setLayoutDensity(density.id);
                          localStorage.setItem('taxi_ge_layout_density', density.id);
                        }}
                        className={`text-[10px] font-bold rounded-xl transition-all ${
                          layoutDensity === density.id 
                            ? 'bg-amber-400 text-slate-950 font-black' 
                            : isDarkTheme()
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {density.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* PWA Mobile Installation Section */}
            {showInstallBanner && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${getCardStyleClass()} p-5 border-2 border-amber-400/30 overflow-hidden relative transition-all duration-300 text-left`}
                id="pwa-install-panel"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowInstallBanner(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label="Cerrar banner"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-400/10 p-3 rounded-2xl shrink-0 text-amber-500">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div className="space-y-2 flex-1 pr-4">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight flex items-center gap-1.5">
                      Instalar Taxi GE en tu Móvil 📲
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Accede instantáneamente desde tu pantalla de inicio en Guinea Ecuatorial. Funciona más rápido, consume menos internet y te permite pedir taxis cómodamente sin abrir el navegador.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {deferredPrompt ? (
                        <button
                          type="button"
                          onClick={handleInstallPWA}
                          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" /> Instalar Aplicación ✓
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setInstallStepView(installStepView === 'android' ? 'none' : 'android')}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                              installStepView === 'android'
                                ? 'bg-amber-400/20 border-amber-400 text-amber-800 dark:text-amber-300'
                                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            Instalar en Android 🤖
                          </button>
                          <button
                            type="button"
                            onClick={() => setInstallStepView(installStepView === 'ios' ? 'none' : 'ios')}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                              installStepView === 'ios'
                                ? 'bg-amber-400/20 border-amber-400 text-amber-800 dark:text-amber-300'
                                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            Instalar en iPhone (iOS) 🍏
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Steps Details */}
                <AnimatePresence>
                  {installStepView === 'android' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-slate-150 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-350 space-y-2 leading-relaxed"
                    >
                      <p className="font-bold text-slate-800 dark:text-slate-200">Guía de instalación manual en Android:</p>
                      <ol className="list-decimal pl-4 space-y-1.5">
                        <li>Abre esta página en el navegador <strong className="text-amber-600 dark:text-amber-400">Google Chrome</strong> de tu teléfono.</li>
                        <li>Pulsa el botón de los <strong className="text-slate-800 dark:text-slate-200">tres puntos (⋮)</strong> en la esquina superior derecha de la pantalla.</li>
                        <li>Busca y selecciona la opción <strong className="text-amber-600 dark:text-amber-400">"Instalar aplicación"</strong> o <strong className="text-slate-800 dark:text-slate-200">"Añadir a la pantalla de inicio"</strong>.</li>
                        <li>Confirma pulsando en <strong className="text-slate-800 dark:text-slate-200">"Instalar"</strong>. ¡Listo! Se creará un acceso directo rápido en tu pantalla de inicio.</li>
                      </ol>
                    </motion.div>
                  )}

                  {installStepView === 'ios' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-slate-150 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-350 space-y-2 leading-relaxed"
                    >
                      <p className="font-bold text-slate-800 dark:text-slate-200">Guía de instalación en tu iPhone / iPad:</p>
                      <ol className="list-decimal pl-4 space-y-1.5">
                        <li>Abre esta web usando el navegador oficial de Apple <strong className="text-amber-600 dark:text-amber-400">Safari</strong>.</li>
                        <li>Pulsa el icono de <strong className="text-slate-800 dark:text-slate-200">Compartir (el cuadrado con la flecha hacia arriba)</strong> en la parte inferior de la pantalla.</li>
                        <li>Desplázate hacia abajo y selecciona la opción <strong className="text-amber-600 dark:text-amber-400">"Añadir a la pantalla de inicio"</strong>.</li>
                        <li>Pulsa <strong className="text-slate-800 dark:text-slate-200">"Añadir"</strong> en la esquina superior derecha. ¡Ya tendrás el icono oficial de Taxi GE en tu iPhone!</li>
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* How it Works Help Section */}
            <div className={`${getCardStyleClass()} overflow-hidden transition-all duration-300`} id="how-it-works-panel">
              <button 
                type="button"
                onClick={() => setShowHowItWorks(!showHowItWorks)}
                className={`w-full flex items-center justify-between p-4 transition-colors text-left ${
                  wallpaper === 'gradient-midnight' 
                    ? 'bg-slate-800/40 hover:bg-slate-800/85 text-slate-100 border-b border-slate-800' 
                    : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-b border-slate-100'
                }`}
                id="toggle-how-it-works-btn"
              >
                <div className="flex items-center gap-2.5">
                  <Info className="h-5 w-5 text-emerald-600" />
                  <span className={`font-bold text-sm ${wallpaper === 'gradient-midnight' ? 'text-white' : 'text-slate-800'}`}>{TRANSLATIONS[language].howItWorksTitle}</span>
                </div>
                {showHowItWorks ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
              </button>

              <AnimatePresence>
                {showHowItWorks && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`p-5 transition-all duration-300 ${
                      wallpaper === 'gradient-midnight' ? 'bg-slate-900 text-slate-350' : 'bg-white text-slate-600'
                    }`}
                    id="how-it-works-body"
                  >
                    <ol className="space-y-4 text-sm list-decimal pl-4 leading-relaxed">
                      <li>
                        <strong className={wallpaper === 'gradient-midnight' ? 'text-white font-extrabold' : 'text-slate-800 font-bold'}>Introduce tus datos:</strong> Rellena tu número de teléfono, selecciona si estás en Malabo o Bata, e introduce el punto de origen y destino de tu viaje.
                      </li>
                      <li>
                        <strong className={wallpaper === 'gradient-midnight' ? 'text-white font-extrabold' : 'text-slate-800 font-bold'}>Selecciona el servicio:</strong> Elige entre carrera compartida (500 FCFA), carrera especial privada o servicio directo al aeropuerto.
                      </li>
                      <li>
                        <strong className={wallpaper === 'gradient-midnight' ? 'text-white font-extrabold' : 'text-slate-800 font-bold'}>Envío por WhatsApp:</strong> Al pulsar "Solicitar Taxi", la app empaqueta los datos en un mensaje limpio y abre WhatsApp de forma automática conectado a la central de despacho del conductor.
                      </li>
                      <li>
                        <strong className={wallpaper === 'gradient-midnight' ? 'text-white font-extrabold' : 'text-slate-800 font-bold'}>Confirmación instantánea:</strong> El conductor recibe tu solicitud directamente con tu número y origen, y te responderá confirmándote el coche y la recogida.
                      </li>
                    </ol>
                    <div className={`mt-4 pt-4 border-t p-3 rounded-2xl flex items-start gap-2 text-xs leading-normal ${
                      wallpaper === 'gradient-midnight' ? 'border-slate-800 bg-slate-950/50 text-slate-400' : 'border-slate-150 bg-slate-50/50 text-slate-500'
                    }`} id="help-disclaimer">
                      <Clock className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Las tarifas indicadas son estimaciones oficiales promedio de Guinea Ecuatorial. El cobro final se realiza directamente al conductor en efectivo (FCFA).</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

        {/* Tab 2: History log */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fade-in" id="history-tab-content">
            <div className="flex items-center justify-between" id="history-header">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <History className="h-5 w-5 text-slate-500" /> Historial de Solicitudes
              </h2>
              {requestHistory.length > 0 && (
                <button
                  onClick={clearAllHistory}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1"
                  id="clear-all-history-btn"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Vaciar todo
                </button>
              )}
            </div>

            {requestHistory.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center space-y-3 shadow-xs" id="empty-history-card">
                <div className="mx-auto bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center text-slate-400" id="empty-history-icon-bg">
                  <Clock className="h-8 w-8" />
                </div>
                <div className="max-w-xs mx-auto">
                  <p className="font-bold text-slate-900 text-sm">Aún no hay solicitudes de viaje</p>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">Tus solicitudes de taxi enviadas por WhatsApp se registrarán aquí para que puedas volver a solicitarlas rápidamente en el futuro.</p>
                </div>
                <button
                  onClick={() => setActiveTab('request')}
                  className="mt-4 inline-flex items-center justify-center gap-1 px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
                  id="start-first-request-btn"
                >
                  Solicitar mi primer Taxi
                </button>
              </div>
            ) : (
              <div className="space-y-3" id="history-items-list">
                <AnimatePresence>
                  {requestHistory.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => reSendRequest(item)}
                      className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group"
                      title="Haz clic para volver a rellenar esta solicitud"
                      id={`history-item-${item.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-emerald-50 transition-colors" id={`history-item-icon-${item.id}`}>
                            {getServiceIcon(item.serviceClass)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900">
                                {SERVICES.find(s => s.id === item.serviceClass)?.name || item.serviceClass}
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
                                {item.city}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" />
                              {new Date(item.timestamp).toLocaleString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            {item.estimatedPrice.toLocaleString()} FCFA
                          </span>
                          <button
                            onClick={(e) => deleteHistoryItem(item.id, e)}
                            className="text-slate-350 hover:text-red-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Eliminar del historial"
                            id={`delete-history-btn-${item.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Route specs */}
                      <div className="mt-3 grid grid-cols-5 items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50 text-xs" id={`history-item-route-${item.id}`}>
                        <div className="col-span-2 truncate">
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Origen</p>
                          <p className="font-medium text-slate-800 truncate" title={item.pickup}>{item.pickup}</p>
                        </div>
                        <div className="col-span-1 flex justify-center text-slate-300">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                        <div className="col-span-2 truncate">
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Destino</p>
                          <p className="font-medium text-slate-800 truncate" title={item.destination}>{item.destination}</p>
                        </div>
                      </div>

                      {/* State and Rating Info inside History item */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        {/* Status Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          item.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'accepted' ? 'bg-sky-100 text-sky-800' :
                          item.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {item.status === 'completed' ? 'Completado' :
                           item.status === 'accepted' ? 'Aceptado' :
                           item.status === 'pending' ? 'Esperando' :
                           'Cancelado'}
                        </span>

                        {/* Rating displaying or interactive rating trigger */}
                        {item.status === 'completed' && item.rating !== undefined ? (
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/40">
                            <span className="text-[10px] text-amber-800 font-bold">{item.rating}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`h-2.5 w-2.5 ${
                                    s <= (item.rating || 0)
                                      ? 'text-amber-500 fill-amber-400'
                                      : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (item.status === 'completed' || item.status === 'accepted') ? (
                          <div className="flex flex-col items-end gap-1">
                            {ratingSubmittingFor === item.id ? (
                              <div className="flex flex-col items-end gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200 mt-1 w-full max-w-[200px]" id={`rating-inline-form-${item.id}`}>
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] text-slate-500 font-medium">Estrellas:</span>
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => setRatingStars(s)}
                                      className="p-0.5 focus:outline-none"
                                    >
                                      <Star
                                        className={`h-4 w-4 ${
                                          s <= ratingStars
                                            ? 'text-amber-500 fill-amber-400'
                                            : 'text-slate-300'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                                <input
                                  type="text"
                                  value={ratingText}
                                  onChange={(e) => setRatingText(e.target.value)}
                                  placeholder="Opinión..."
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] text-slate-800 focus:outline-none"
                                />
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => completeAndRateRequest(item.id, ratingStars, ratingText)}
                                    className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[9px]"
                                  >
                                    Guardar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setRatingSubmittingFor(null)}
                                    className="bg-slate-200 text-slate-600 font-medium px-2 py-0.5 rounded text-[9px]"
                                  >
                                    Atrás
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setRatingSubmittingFor(item.id);
                                  setRatingStars(5);
                                  setRatingText('');
                                }}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-black px-2 py-0.5 rounded-lg text-[10px] transition-colors flex items-center gap-0.5 cursor-pointer"
                              >
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                Calificar
                              </button>
                            )}
                          </div>
                        ) : null}
                      </div>

                      {/* Optional display for comment in history */}
                      {item.status === 'completed' && item.ratingComment && (
                        <div className="mt-1.5 bg-slate-50/50 border border-slate-150 p-2 rounded-lg italic text-[10.5px] text-slate-500" onClick={(e) => e.stopPropagation()}>
                          "{item.ratingComment}"
                        </div>
                      )}

                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2" id={`history-item-actions-${item.id}`}>
                        <span className="font-mono">Tel: +{item.phone}</span>
                        <span className="text-emerald-600 font-bold group-hover:underline flex items-center gap-1">
                          Volver a solicitar <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
          </>
        ) : appRole === 'driver' ? (
          /* Driver Mode Panel */
          <div className="space-y-5 animate-fade-in" id="driver-mode-panel">
            {/* Account Status / Warning Alerts / Suspension banner */}
            {(() => {
              const myPlate = driverPlate || 'M-4892-A';
              const myCommissions = commissions.filter(c => c.driverPlate === myPlate);
              const myPendingCommissions = myCommissions.filter(c => c.status === 'pending');
              const myOverdueCommissions = myPendingCommissions.filter(c => {
                const hours = (new Date().getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60);
                return hours > 48;
              });
              const isSuspended = suspendedDriverPlates.includes(myPlate) || myOverdueCommissions.length > 0;

              // Force update availability if suspended
              if (isSuspended && driverAvailable) {
                setTimeout(() => setDriverAvailable(false), 50);
              }

              if (isSuspended) {
                return (
                  <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-5 space-y-4 shadow-lg text-left" id="driver-suspended-card">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-600 text-white p-2.5 rounded-2xl shrink-0 animate-pulse">
                        <ShieldAlert className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-red-600 text-sm">🔴 CUENTA SUSPENDIDA</h3>
                        <p className="text-[9px] text-red-500 font-bold uppercase tracking-wider">Límite de Pago de Comisión Excedido (48h)</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                      <p>
                        Su cuenta de taxista ha sido <strong>suspendida y bloqueada temporalmente</strong> para recibir solicitudes de viaje en Malabo y Bata.
                      </p>
                      <p>
                        Es obligatorio abonar la comisión fija de <strong>50 XAF</strong> por cada viaje realizado utilizando acuses de pago en menos de 48 horas.
                      </p>
                    </div>

                    {/* Outstanding Debt Ledger */}
                    <div className="bg-white rounded-2xl p-4 border border-red-100 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Detalle de Deuda</span>
                        <span className="text-xs font-black text-red-600">{myPendingCommissions.length * 50} XAF Pendientes</span>
                      </div>
                      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                        {myPendingCommissions.map(c => {
                          const hours = Math.floor((new Date().getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60));
                          return (
                            <div key={c.id} className="flex justify-between items-center text-[11px] bg-red-50/50 p-2 rounded-xl">
                              <div>
                                <p className="font-mono font-bold text-slate-800">{c.id} • {c.pickup}</p>
                                <p className="text-[9.5px] text-red-600 font-semibold">Hace {hours} horas ({hours > 48 ? 'Excedió 48h 🚨' : 'Pendiente' })</p>
                              </div>
                              <span className="font-bold text-red-700">50 XAF</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={payAllMyPendingCommissions}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 cursor-pointer uppercase tracking-wider"
                        id="pay-all-debt-btn"
                      >
                        <DollarSign className="h-4 w-4" /> Saldar Deudas con Muni Dinero
                      </button>
                      <p className="text-[9px] text-slate-400 text-center leading-relaxed">
                        El abono se enviará de forma automática al número oficial de la aplicación <strong>00240555312102</strong> con servicio Muni Dinero. Al saldar la deuda su cuenta se reactivará de inmediato.
                      </p>
                    </div>
                  </div>
                );
              }

              // Overdue grace warning banner (grace/warning alert)
              if (myPendingCommissions.length > 0) {
                return (
                  <div className="bg-amber-50 border-2 border-amber-500 rounded-3xl p-4 text-left space-y-3 shadow-md" id="driver-warning-card">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-500 text-slate-950 p-1.5 rounded-xl shrink-0 mt-0.5">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-amber-800 text-xs">⚠️ AVISO DE CANCELACIÓN DE CUENTA</h4>
                        <p className="text-[11px] text-amber-950 leading-relaxed">
                          Tiene <strong>{myPendingCommissions.length}</strong> comisiones de 50 XAF pendientes de abono. Recuerde que si algún pago excede las <strong>48 horas</strong>, su cuenta se suspenderá automáticamente.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white border border-amber-200/60 p-2.5 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-700">Comisiones Pendientes: <span className="text-amber-600">{myPendingCommissions.length * 50} XAF</span></span>
                      <button
                        type="button"
                        onClick={payAllMyPendingCommissions}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10.5px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        id="pay-grace-debt-btn"
                      >
                        Pagar Todo ✓
                      </button>
                    </div>
                  </div>
                );
              }

              return null;
            })()}

            {/* Upper Driver Brand Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-amber-500 text-slate-950 p-2 rounded-xl shadow-md">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">Portal del Taxista GE</h3>
                    <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                      {driverExperience === 'novato' ? 'Novato 🔰' :
                       driverExperience === 'ocasional' ? 'Ocasional 🚗' :
                       driverExperience === 'profesional' ? 'Profesional 🚖' : 'Experimentado 👑'}
                    </p>
                  </div>
                </div>
                <span className={`border text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                  driverAvailable 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-slate-850 text-slate-400 border-slate-800'
                }`} id="driver-availability-badge">
                  {driverAvailable ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Disponible
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                      Ocupado
                    </>
                  )}
                </span>
              </div>

              {/* Interactive Availability Switch */}
              <div className="flex items-center justify-between bg-slate-850 border border-slate-800/60 p-3.5 rounded-2xl" id="driver-availability-row">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${driverAvailable ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-850 text-slate-500'}`}>
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Estado de Disponibilidad</span>
                    <span className={`text-xs font-bold ${driverAvailable ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {driverAvailable ? 'Disponible (Recibiendo Viajes)' : 'Ocupado / Desconectado'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !driverAvailable;
                    setDriverAvailable(nextVal);
                    setStatus(`Disponibilidad de conductor: ${nextVal ? 'Disponible' : 'Ocupado/Desconectado'}`);
                    setStatusType('info');
                    playNotificationSound(nextVal ? 'success' : 'alert');
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    driverAvailable ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                  id="driver-available-switch"
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    driverAvailable ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Quick Profile Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Taxista</span>
                  <span className="font-semibold text-slate-200 mt-1 block truncate">{driverName} {driverLastName}</span>
                </div>
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Vehículo / Matrícula</span>
                  <span className="font-semibold text-amber-400 mt-1 block truncate">{driverVehicle} ({driverPlate})</span>
                </div>
              </div>
            </div>

            {/* Sub-Navigation Tabs for Driver */}
            <div className="flex bg-slate-200/80 p-1 rounded-2xl" id="driver-sub-tabs">
              <button
                type="button"
                onClick={() => setActiveDriverTab('requests')}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${activeDriverTab === 'requests' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
              >
                <Clock className="h-4 w-4" />
                <span>Viajes</span>
                {requestHistory.filter(r => r.status === 'pending').length > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1">
                    {requestHistory.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveDriverTab('profile')}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${activeDriverTab === 'profile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
              >
                <User className="h-4 w-4" />
                <span>Mi Ficha</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDriverTab('heatmap')}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${activeDriverTab === 'heatmap' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
              >
                <Map className="h-4 w-4" />
                <span>Mapa GPS</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDriverTab('reports')}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${activeDriverTab === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
              >
                <Settings className="h-4 w-4" />
                <span>Herram.</span>
              </button>
            </div>

            {/* TAB CONTENT: REQUESTS */}
            {activeDriverTab === 'requests' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between" id="driver-requests-header">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    Solicitudes de Pasajeros Recientes
                  </h4>
                  <span className="text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                    Canal Despacho Activo ({city})
                  </span>
                </div>

                {requestHistory.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center space-y-3 shadow-xs">
                    <div className="mx-auto bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center text-slate-400">
                      <History className="h-8 w-8 animate-pulse text-slate-350" />
                    </div>
                    <div className="max-w-xs mx-auto">
                      <p className="font-bold text-slate-900 text-sm">No hay solicitudes aún</p>
                      <p className="text-xs text-slate-400 mt-1 leading-normal">
                        Cuando un pasajero envíe una solicitud de taxi en Guinea Ecuatorial, aparecerá en esta lista para que puedas confirmarla o rechazarla en tiempo real.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDriverTab('heatmap');
                          setStatus('Usa el Mapa de Calor para generar solicitudes simuladas de clientes.');
                          setStatusType('info');
                        }}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-850 font-bold px-4 py-2.5 rounded-xl text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Map className="h-3.5 w-3.5" /> Ir al Mapa para simular clientes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3" id="driver-requests-list">
                    <AnimatePresence>
                      {requestHistory.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 transition-all ${
                            item.status === 'accepted' ? 'border-emerald-200 bg-emerald-50/10 shadow-sm' :
                            item.status === 'cancelled_by_passenger' || item.status === 'cancelled_by_driver' ? 'border-slate-100 opacity-60' :
                            'border-slate-250 hover:border-amber-400 hover:shadow-xs'
                          }`}
                          id={`driver-item-${item.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="bg-slate-100 p-2 rounded-xl text-slate-600">
                                {getServiceIcon(item.serviceClass)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-slate-900">
                                    {SERVICES.find(s => s.id === item.serviceClass)?.name || item.serviceClass}
                                  </span>
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
                                    {item.city}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                  <Clock className="h-3 w-3" />
                                  {new Date(item.timestamp).toLocaleString('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg block">
                                {item.estimatedPrice.toLocaleString()} FCFA
                              </span>
                              <span className={`text-[9px] font-bold uppercase tracking-wider mt-1 inline-block ${
                                item.status === 'pending' ? 'text-amber-600' :
                                item.status === 'accepted' ? 'text-emerald-600' :
                                'text-slate-400'
                              }`}>
                                {item.status === 'pending' ? 'Pendiente ⌛' :
                                 item.status === 'accepted' ? 'Aceptado ✅' :
                                 item.status === 'cancelled_by_passenger' ? 'Canc. Pasajero 👤' :
                                 'Canc. Conductor 🚖'}
                              </span>
                            </div>
                          </div>

                          {/* Route specs */}
                          <div className="grid grid-cols-5 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                            <div className="col-span-2 truncate">
                              <p className="text-[9px] text-slate-400 uppercase font-semibold">Origen</p>
                              <p className="font-medium text-slate-800 truncate" title={item.pickup}>{item.pickup}</p>
                            </div>
                            <div className="col-span-1 flex justify-center text-slate-300">
                              <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                            <div className="col-span-2 truncate">
                              <p className="text-[9px] text-slate-400 uppercase font-semibold">Destino</p>
                              <p className="font-medium text-slate-800 truncate" title={item.destination}>{item.destination}</p>
                            </div>
                          </div>

                          {/* Ride attributes */}
                          <div className="grid grid-cols-3 gap-2 py-1 border-t border-b border-slate-100 text-[11px] text-slate-600">
                            <div>
                              <span className="text-slate-400 text-[9px] block uppercase">Pasajeros</span>
                              <span className="font-semibold flex items-center gap-1">
                                <Users className="h-3 w-3" /> {item.passengers || 1} {item.passengers === 1 ? 'persona' : 'personas'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[9px] block uppercase">Urgencia</span>
                              <span className="font-bold text-amber-700 flex items-center gap-1">
                                <Flame className="h-3 w-3 text-amber-500" />
                                {item.urgency === 'muy_urgente' ? 'Muy Urg.' :
                                 item.urgency === 'urgente' ? 'Urgente' :
                                 item.urgency === 'intermedio' ? 'Intermedio' : 'Normal'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[9px] block uppercase">Distancia</span>
                              <span className="font-semibold text-sky-700 font-mono">
                                {item.distanceKm || 0} km (~{item.durationMin || 0} min)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            <span className="font-mono">Pasajero: +{item.phone}</span>
                          </div>

                          {/* Sección de Confirmación de Pago para el Taxista */}
                          <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-2.5 flex flex-col gap-1 text-xs text-left" id={`driver-payment-section-${item.id}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 font-semibold text-[10px] uppercase">Estado de Pago del Pasajero</span>
                              <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                (item.paymentStatus || 'pending') === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/50'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200/50'
                              }`}>
                                {(item.paymentStatus || 'pending') === 'paid' ? 'Viaje Pagado ✓' : 'Factura Pendiente ⏳'}
                              </span>
                            </div>
                            
                            {(item.paymentStatus || 'pending') === 'paid' ? (
                              <div className="bg-emerald-100/60 border border-emerald-200 text-emerald-950 text-[11px] font-bold p-2 rounded-lg flex items-center gap-1.5 mt-1 animate-fade-in" id={`driver-payment-success-badge-${item.id}`}>
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 animate-pulse" />
                                <span>Acuse: Pago Recibido con éxito 💰</span>
                              </div>
                            ) : (
                              <p className="text-[10px] text-slate-400 italic leading-relaxed">
                                El pasajero aún no ha confirmado el pago de esta carrera.
                              </p>
                            )}
                          </div>

                          {/* GPS Navigation for Driver */}
                          {item.status === 'accepted' && (
                            <div className="pt-2 border-t border-slate-150">
                              {showGpsNavigatorFor === item.id ? (
                                <GpsNavigator
                                  city={item.city}
                                  pickup={item.pickup}
                                  destination={item.destination}
                                  onClose={() => setShowGpsNavigatorFor(null)}
                                  isDriver={true}
                                />
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowGpsNavigatorFor(item.id);
                                    setStatus('GPS de navegación iniciado para el taxista.');
                                    setStatusType('success');
                                  }}
                                  className="w-full bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 font-bold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                  id={`driver-open-gps-btn-${item.id}`}
                                >
                                  <Navigation className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
                                  Iniciar Navegación GPS del Viaje 🧭
                                </button>
                              )}
                            </div>
                          )}

                          {/* Interactive Acceptance / Cancellation Buttons */}
                          <div className="flex flex-col gap-2 pt-1 w-full">
                            {item.status === 'pending' && (
                              <div className="space-y-3 w-full">
                                {suggestingPriceForTripId === item.id ? (
                                  <div 
                                    className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-2.5 text-left w-full"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sugerir tarifa de viaje</span>
                                      <span className="text-[10px] font-mono text-slate-400">Original: {item.estimatedPrice} FCFA</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                      <input
                                        type="number"
                                        value={suggestedPriceInput}
                                        onChange={(e) => setSuggestedPriceInput(e.target.value)}
                                        placeholder="Ej. 2000"
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                                      />
                                      <span className="text-xs font-bold text-slate-500 self-center">FCFA</span>
                                    </div>
                                    
                                    {/* Quick suggestion packages */}
                                    <div className="flex flex-wrap gap-1.5">
                                      {[500, 1000, 1500, 2000].map((extra) => {
                                        const totalOpt = item.estimatedPrice + extra;
                                        return (
                                          <button
                                            key={extra}
                                            type="button"
                                            onClick={() => setSuggestedPriceInput(String(totalOpt))}
                                            className="text-[9px] font-bold px-2 py-1 bg-white hover:bg-amber-50 border border-slate-250 rounded-lg text-slate-600 hover:text-amber-900 transition-colors cursor-pointer"
                                          >
                                            +{extra} ({totalOpt})
                                          </button>
                                        );
                                      })}
                                    </div>

                                    <div className="flex gap-1.5 pt-1">
                                      <button
                                        type="button"
                                        onClick={() => suggestPriceForRequest(item.id, Number(suggestedPriceInput))}
                                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1.5 rounded-xl text-[10.5px] transition-all cursor-pointer"
                                      >
                                        Enviar Propuesta 📨
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSuggestingPriceForTripId(null);
                                          setSuggestedPriceInput('');
                                        }}
                                        className="px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-1.5 rounded-xl text-[10.5px] transition-all cursor-pointer"
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-1.5 w-full">
                                    <button
                                      type="button"
                                      onClick={() => acceptRequest(item.id)}
                                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                                    >
                                      <Check className="h-3.5 w-3.5" /> Aceptar Tarifa
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSuggestingPriceForTripId(item.id);
                                        setSuggestedPriceInput(String(item.estimatedPrice + 500));
                                      }}
                                      className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      Sugerir Tarifa 💰
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => cancelRequestByDriver(item.id)}
                                      className="px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                                    >
                                      Rechazar
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {item.status === 'accepted' && (
                              <>
                                <a
                                  href={`https://wa.me/${item.phone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 text-center"
                                >
                                  <Phone className="h-3.5 w-3.5" /> Contactar por WhatsApp
                                </a>
                                <button
                                  type="button"
                                  onClick={() => cancelRequestByDriver(item.id)}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PROFILE */}
            {activeDriverTab === 'profile' && (
              <div className="space-y-4 animate-fade-in">
                {/* Physical Credential Card */}
                <div className="bg-gradient-to-tr from-slate-900 via-slate-950 to-amber-950 rounded-3xl p-5 border border-amber-500/30 text-white shadow-xl relative overflow-hidden" id="driver-id-badge">
                  {/* Decorative flag accent in the badge background */}
                  <div className="absolute right-0 top-0 h-full w-2 flex flex-col opacity-20">
                    <div className="bg-emerald-600 flex-1"></div>
                    <div className="bg-white flex-1"></div>
                    <div className="bg-red-600 flex-1"></div>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                      Guinea Ecuatorial • Credencial de Transportista
                    </span>
                    <Shield className="h-4 w-4 text-amber-500" />
                  </div>

                  <div className="flex items-start gap-4">
                    <DriverAvatar 
                      avatar={driverAvatar} 
                      customUrl={driverAvatarUrl} 
                      name={driverName || 'S'} 
                      className="w-16 h-16 rounded-2xl ring-2 ring-amber-400/30 shadow-md shrink-0 object-cover" 
                    />
                    <div className="space-y-2.5 flex-1 min-w-0">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Conductor Registrado</p>
                        <h4 className="font-bold text-base truncate">{driverName} {driverLastName}</h4>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <p className="text-slate-400 font-semibold text-[9px] uppercase">DIP / ID Oficial</p>
                          <p className="font-mono text-slate-200 font-bold truncate">{driverIdNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold text-[9px] uppercase">Rango de Exp.</p>
                          <span className="text-amber-400 font-bold uppercase text-[9.5px]">
                            {driverExperience === 'novato' ? 'Novato (0-2a)' :
                             driverExperience === 'ocasional' ? 'Ocasional (2-5a)' :
                             driverExperience === 'profesional' ? 'Profesional (5-10a)' : 'Experto (10a+)'}
                          </span>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold text-[9px] uppercase">Punt. Media</p>
                          <span className="text-amber-400 font-bold text-xs flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0 animate-pulse" />
                            {averageRating ? `${averageRating}/5` : 'S/V'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-slate-300">
                    <div className="col-span-2 flex items-center gap-1.5 text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="truncate" title={driverAddress}>{driverAddress || 'No especificada'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="font-mono">+{driverAltPhone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 truncate">
                      <Mail className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{driverEmail || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* ADVANCE COMMISSION PREPAYMENT WIDGET */}
                <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-sm space-y-4 text-left" id="driver-prepayment-widget">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-100 text-amber-800 p-2 rounded-xl">
                        <Coins className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">Comisiones por Adelantado</h4>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Abonos Prepago para Viajes</p>
                      </div>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Muni Dinero
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/50 p-3.5 rounded-2xl text-left">
                      <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest block">Mi Saldo Prepago</span>
                      <span className="text-xl font-black text-amber-600 tracking-tight mt-1 block">
                        {driverPrepaidBalance.toLocaleString()} XAF
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/50 p-3.5 rounded-2xl text-left flex flex-col justify-between">
                      <div>
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest block">Viajes Cubiertos</span>
                        <span className="text-base font-extrabold text-slate-700 tracking-tight mt-1 block">
                          {Math.floor(driverPrepaidBalance / 50)} Carreras
                        </span>
                      </div>
                      <span className="text-[8.5px] text-slate-400 italic block leading-tight mt-1">Sujeto a 50 XAF fijas por viaje</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    ¡Prepagando tus comisiones evitas suspensiones imprevistas! Las comisiones de 50 XAF de tus próximos viajes se descontarán automáticamente de este saldo.
                  </p>

                  {/* Prepayment Quick Action Packages */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cargar saldo por adelantado (Muni Dinero):</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { amount: 500, label: '10 Viajes', desc: 'Básico' },
                        { amount: 1500, label: '30 Viajes', desc: 'Popular 🔥' },
                        { amount: 3000, label: '60 Viajes', desc: 'Ahorro' }
                      ].map(pkg => (
                        <button
                          key={pkg.amount}
                          type="button"
                          onClick={() => {
                            setPrepayAmount(pkg.amount);
                            setCustomPrepayInput('');
                            setShowPrepayModal(true);
                            playNotificationSound('new');
                          }}
                          className="p-2.5 bg-slate-50 hover:bg-amber-50 hover:border-amber-400 rounded-xl border border-slate-250 text-left transition-all duration-200 flex flex-col justify-between h-16 cursor-pointer group"
                        >
                          <span className="text-xs font-black text-slate-800 tracking-tight group-hover:text-amber-900">{pkg.amount} XAF</span>
                          <div className="leading-tight">
                            <span className="text-[9px] font-bold text-amber-700 block leading-none">{pkg.label}</span>
                            <span className="text-[8px] text-slate-400 block leading-none mt-0.5">{pkg.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setPrepayAmount(500);
                          setCustomPrepayInput('');
                          setShowPrepayModal(true);
                          playNotificationSound('new');
                        }}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Coins className="h-3.5 w-3.5" /> Abonar Saldo por Adelantado
                      </button>
                    </div>
                  </div>

                  {/* Prepaid History dropdown/accordion */}
                  {driverPrepaidTransactions.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Historial de Recargas Realizadas:</span>
                      <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                        {driverPrepaidTransactions.map((tx: any) => (
                          <div key={tx.id} className="bg-slate-50 border border-slate-150/40 p-2 rounded-lg flex items-center justify-between text-[11px] text-left">
                            <div>
                              <span className="font-mono font-bold text-slate-700">{tx.id}</span>
                              <span className="text-[9px] text-slate-400 block">{new Date(tx.timestamp).toLocaleString('es-ES')}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-slate-900 block">+{tx.amount} XAF</span>
                              <span className="text-[8.5px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-full">{tx.tripsCount} Carreras</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile update form */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Edit3 className="h-4 w-4 text-slate-500" /> Rellenar Datos Personales
                  </h4>

                  {/* Profile Photo or Avatar Selection */}
                  <div className="bg-slate-50 border border-slate-150/40 p-4 rounded-2xl space-y-3">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Foto de Perfil / Avatar del Conductor</span>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Avatar preview */}
                      <DriverAvatar 
                        avatar={driverAvatar} 
                        customUrl={driverAvatarUrl} 
                        name={driverName || 'S'} 
                        className="h-16 w-16 rounded-2xl ring-4 ring-amber-400/20 shadow-md shrink-0 object-cover" 
                      />

                      <div className="flex-1 space-y-3 w-full">
                        {/* Selector for pre-defined avatars */}
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Seleccionar Avatar Predefinido:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { id: 'avatar-1', label: 'Santiago (Amber)' },
                              { id: 'avatar-2', label: 'Nguema (Emerald)' },
                              { id: 'avatar-3', label: 'Ebenezer (Sky)' },
                              { id: 'avatar-4', label: 'Demetrio (Purple)' },
                              { id: 'avatar-5', label: 'Bohorquez (Rose)' },
                              { id: 'avatar-6', label: 'Admin (Slate)' }
                            ].map((av) => (
                              <button
                                key={av.id}
                                type="button"
                                onClick={() => {
                                  setDriverAvatar(av.id);
                                  localStorage.setItem('taxi_ge_driver_avatar', av.id);
                                }}
                                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all duration-150 cursor-pointer ${
                                  driverAvatar === av.id
                                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                {av.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* URL input for custom profile photo */}
                        <div className="space-y-1">
                          <label className="block text-[10px] text-slate-400 font-bold uppercase">O poner enlace URL a tu foto de perfil:</label>
                          <input
                            type="url"
                            value={driverAvatarUrl}
                            onChange={(e) => {
                              setDriverAvatarUrl(e.target.value);
                              localStorage.setItem('taxi_ge_driver_avatar_url', e.target.value);
                            }}
                            placeholder="https://ejemplo.com/mi-foto.jpg"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Nombre</label>
                      <input
                        type="text"
                        value={driverName}
                        onChange={(e) => {
                          setDriverName(e.target.value);
                          localStorage.setItem('taxi_ge_driver_name', e.target.value);
                        }}
                        placeholder="Santiago"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Apellidos</label>
                      <input
                        type="text"
                        value={driverLastName}
                        onChange={(e) => {
                          setDriverLastName(e.target.value);
                          localStorage.setItem('taxi_ge_driver_lastname', e.target.value);
                        }}
                        placeholder="Nguema"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Número de ID (DIP / Pasaporte / Licencia)</label>
                    <input
                      type="text"
                      value={driverIdNumber}
                      onChange={(e) => {
                        setDriverIdNumber(e.target.value);
                        localStorage.setItem('taxi_ge_driver_id_number', e.target.value);
                      }}
                      placeholder="Ej. DIP-9402941"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Dirección de Residencia o Parada</label>
                    <input
                      type="text"
                      value={driverAddress}
                      onChange={(e) => {
                        setDriverAddress(e.target.value);
                        localStorage.setItem('taxi_ge_driver_address', e.target.value);
                      }}
                      placeholder="Calle de la Independencia, Malabo"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Teléfono Alternativo</label>
                      <input
                        type="tel"
                        value={driverAltPhone}
                        onChange={(e) => {
                          setDriverAltPhone(e.target.value);
                          localStorage.setItem('taxi_ge_driver_alt_phone', e.target.value);
                        }}
                        placeholder="222111222"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                      />
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        * Use <strong className="text-slate-500">222111222</strong> para modo Admin.
                      </p>
                      {driverAltPhone && (
                        <div className="mt-0.5">
                          {validateGEPhone(driverAltPhone).isValid ? (
                            <span className="text-[9.5px] font-bold text-emerald-600 flex items-center gap-0.5">
                              <span className="h-1 w-1 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                              ✓ Celular GE Válido
                            </span>
                          ) : (
                            <span className="text-[9.5px] font-bold text-rose-500">⚠ Formato Guinea Ec.</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Correo Electrónico</label>
                      <input
                        type="email"
                        value={driverEmail}
                        onChange={(e) => {
                          setDriverEmail(e.target.value);
                          localStorage.setItem('taxi_ge_driver_email', e.target.value);
                        }}
                        placeholder="ejemplo@taxi.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Vehicle configuration embedded within Profile */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-left">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Vehículo (Marca / Modelo)</label>
                      <input
                        type="text"
                        value={driverVehicle}
                        onChange={(e) => {
                          setDriverVehicle(e.target.value);
                          localStorage.setItem('taxi_ge_driver_vehicle', e.target.value);
                        }}
                        placeholder="Ej. Toyota Corolla"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                        id="driver-profile-vehicle-input"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Color del Vehículo</label>
                      <input
                        type="text"
                        value={driverVehicleColor}
                        onChange={(e) => {
                          setDriverVehicleColor(e.target.value);
                          localStorage.setItem('taxi_ge_driver_vehicle_color', e.target.value);
                        }}
                        placeholder="Ej. Blanco y Amarillo"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                        id="driver-profile-color-input"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Matrícula (Placa Oficial)</label>
                      <input
                        type="text"
                        value={driverPlate}
                        onChange={(e) => {
                          setDriverPlate(e.target.value);
                          localStorage.setItem('taxi_ge_driver_plate', e.target.value);
                        }}
                        placeholder="Ej. M-4892-A"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                        id="driver-profile-plate-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-slate-100 pt-3 text-left">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Años de Experiencia</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { val: 'novato', label: 'Novato (0-2 años)' },
                        { val: 'ocasional', label: 'Ocasional (2-5 años)' },
                        { val: 'profesional', label: 'Profesional (5-10 años)' },
                        { val: 'experimentado', label: 'Experimentado (10+ años)' }
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => {
                            setDriverExperience(item.val as ExperienceLevel);
                            localStorage.setItem('taxi_ge_driver_experience', item.val);
                          }}
                          className={`py-2 px-3 rounded-xl border text-left font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            driverExperience === item.val
                              ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                              : 'bg-slate-50 border-slate-250 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span>{item.label}</span>
                          {driverExperience === item.val && <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0 ml-1" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contract/Terms Acceptance Badge */}
                  <div className={`p-3 rounded-2xl flex items-center justify-between border ${
                    driverTermsAccepted 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`} id="driver-profile-terms-badge">
                    <div className="flex items-center gap-2.5 text-xs text-left">
                      <Shield className={`h-4.5 w-4.5 shrink-0 ${driverTermsAccepted ? 'text-emerald-600' : 'text-amber-600 animate-pulse'}`} />
                      <div>
                        <p className="font-bold">Contrato de Conductor:</p>
                        <p className="text-[10px] text-slate-500">
                          {driverTermsAccepted 
                            ? '✓ Aceptado y Firmado Digitalmente' 
                            : '⏳ Firma Pendiente Obligatoria'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className={`font-bold px-3 py-1.5 rounded-xl text-[10.5px] transition-all cursor-pointer ${
                        driverTermsAccepted 
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200' 
                          : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                      }`}
                      id="view-contract-btn"
                    >
                      {driverTermsAccepted ? 'Revisar' : 'Ver Contrato'}
                    </button>
                  </div>
                  
                  <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-150 flex items-start gap-2 text-[11px] text-amber-850 leading-relaxed text-left">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>Esta información se asocia de forma dinámica a las carreras que aceptes para que los pasajeros vean tu experiencia, vehículo y documento de control de Guinea Ecuatorial.</span>
                  </div>

                  {/* Save Data Button Section */}
                  {(() => {
                    const isDriverDataComplete = 
                      driverName.trim().length > 0 && 
                      driverLastName.trim().length > 0 && 
                      driverIdNumber.trim().length > 0 && 
                      driverAddress.trim().length > 0 && 
                      driverAltPhone.trim().length > 0 && 
                      driverVehicle.trim().length > 0 && 
                      driverPlate.trim().length > 0;

                    return isDriverDataComplete ? (
                      <button
                        type="button"
                        onClick={() => {
                          setShowTermsModal(true);
                          playNotificationSound('new');
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black py-3 px-6 rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider font-semibold"
                        id="save-driver-data-btn"
                      >
                        <Save className="h-4 w-4" />
                        Guardar Datos 📋
                      </button>
                    ) : (
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500 text-left space-y-1" id="incomplete-driver-warning">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px] uppercase">
                          <AlertCircle className="h-4 w-4 text-slate-400" />
                          <span>Campos Obligatorios Incompletos</span>
                        </div>
                        <p className="text-[10.5px] leading-relaxed">
                          Por favor, rellene todos los campos (Nombre, Apellidos, ID, Dirección, Teléfono, Vehículo y Matrícula) para que aparezca la opción de <strong>Guardar Datos</strong>.
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* Muni Dinero Automatic Commission Ledger */}
                {driverCommissionContractAccepted && (
                  <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4 animate-fade-in" id="driver-muni-commission-ledger">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-left">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                        <span>Comisiones Muni Dinero</span>
                      </h4>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        00240555312102
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
                      <div className="text-left space-y-0.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Aportado Automático</span>
                        <p className="text-xl font-black text-slate-900">
                          {muniTransfers.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} XAF
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="bg-emerald-600 text-white text-[9.5px] font-bold px-2 py-1 rounded-lg">
                          Muni Dinero Activo ✓
                        </span>
                      </div>
                    </div>

                    <p className="text-[10.5px] text-slate-500 text-left leading-relaxed">
                      La app simula automáticamente la deducción de <strong>50 XAF por cada 500 XAF</strong> ganados y los transfiere al número estándar de la plataforma ante cada acuse de pago.
                    </p>

                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {muniTransfers.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-2 text-center">No hay transferencias automáticas registradas aún.</p>
                      ) : (
                        muniTransfers.map((item) => (
                          <div key={item.id} className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-2.5 flex justify-between items-center text-xs text-left">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black text-slate-800 text-[11px]">{item.id}</span>
                                <span className="text-[9px] text-slate-400">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{item.referenceTrip}</p>
                            </div>
                            <div className="text-right space-y-0.5">
                              <span className="font-mono font-black text-emerald-800 block">-{item.amount} XAF</span>
                              <span className="text-[8.5px] font-bold text-emerald-600 uppercase bg-emerald-100 px-1.5 py-0.5 rounded-full">Enviado ✓</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Driver Document Verification System */}
                <div id="driver-document-verification-system" className="animate-fade-in">
                  <DocumentValidator />
                </div>

                {/* Driver Ratings History List */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4" id="driver-ratings-history-box">
                  <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-400" /> Historial de Calificaciones
                  </h4>

                  {driverRatedTrips.length === 0 ? (
                    <div className="p-6 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-100" id="ratings-empty-state">
                      <div className="mx-auto text-slate-300 w-10 h-10 flex items-center justify-center">
                        <Star className="h-6 w-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">Sin calificaciones aún</p>
                      <p className="text-[11px] text-slate-400 leading-normal max-w-xs mx-auto">
                        Completa carreras solicitadas por clientes en Guinea Ecuatorial. Cuando finalicen el viaje, podrán valorarte de 1 a 5 estrellas.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1" id="ratings-list">
                      {driverRatedTrips.map((req) => (
                        <div key={req.id} className="bg-slate-50/70 p-3 rounded-2xl border border-slate-150/50 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-700 text-[11px]">Cliente: +{req.phone}</span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`h-3 w-3 ${
                                    s <= (req.rating || 0)
                                      ? 'text-amber-500 fill-amber-400'
                                      : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-[10px] text-slate-400 flex items-center gap-2">
                            <span>{req.pickup} → {req.destination}</span>
                            <span>•</span>
                            <span>{new Date(req.completedAt || req.timestamp).toLocaleDateString('es-ES')}</span>
                          </div>

                          {req.ratingComment && (
                            <p className="text-[11px] text-slate-600 bg-white border border-slate-100 rounded-lg p-2 italic leading-relaxed">
                              "{req.ratingComment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: HEATMAP */}
            {activeDriverTab === 'heatmap' && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Map className="h-4 w-4 text-sky-500 animate-pulse" /> GPS de Demanda y Tráfico
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Zonas de Guinea Ecuatorial con mayor densidad de pasajeros en tiempo real</p>
                    </div>
                    {/* Active City indicator */}
                    <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold">
                      {city}
                    </span>
                  </div>

                  {/* Interactive SVG / Vector-Style Heatmap Card */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 relative overflow-hidden flex flex-col items-center justify-center min-h-64 shadow-inner" id="heatmap-container">
                    {/* GPS Grid map background lines (horizontal and vertical roads) */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none" id="gps-vector-roads">
                      {/* Vertical streets */}
                      <div className="absolute left-[20%] top-0 bottom-0 border-l border-sky-400 border-dashed" />
                      <div className="absolute left-[40%] top-0 bottom-0 border-l border-sky-400" />
                      <div className="absolute left-[60%] top-0 bottom-0 border-l border-sky-400 border-dashed" />
                      <div className="absolute left-[80%] top-0 bottom-0 border-l border-sky-400" />
                      {/* Horizontal streets */}
                      <div className="absolute top-[25%] left-0 right-0 border-t border-sky-400" />
                      <div className="absolute top-[50%] left-0 right-0 border-t border-sky-400 border-dashed" />
                      <div className="absolute top-[75%] left-0 right-0 border-t border-sky-400" />
                      {/* Diagonal highway */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-500/50 rotate-12 transform origin-center" />
                    </div>
                    
                    {/* Rendered Heat Map Nodes for selected city */}
                    <div className="relative w-full h-48 flex items-center justify-center" id="heatmap-vector-nodes">
                      {heatmapData[city].map((node, index) => {
                        // Spread nodes geometrically using polar coordinates style
                        const angle = (index * (360 / heatmapData[city].length) * Math.PI) / 180;
                        const radius = index % 2 === 0 ? 55 : 30; // alter distances
                        const x = Math.round(Math.sin(angle) * radius);
                        const y = Math.round(Math.cos(angle) * radius);
                        
                        const isSelected = selectedRegionId === node.id;
                        
                        return (
                          <button
                            key={node.id}
                            type="button"
                            onClick={() => setSelectedRegionId(isSelected ? null : node.id)}
                            className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                            style={{ 
                              left: `calc(50% + ${x}px)`, 
                              top: `calc(50% + ${y}px)` 
                            }}
                          >
                            {/* Demand Glowing Ring Backdrop */}
                            <span className={`absolute inset-0 rounded-full scale-150 blur-md transition-all duration-300 ${
                              node.demand === 'alta' ? 'bg-rose-500/50 group-hover:bg-rose-500/70' :
                              node.demand === 'media' ? 'bg-amber-500/40 group-hover:bg-amber-500/60' :
                              'bg-sky-500/30'
                            } ${isSelected ? 'scale-[2.5] opacity-100' : 'opacity-60'}`} />
                            
                            {/* Inner Dot */}
                            <div className={`relative h-3 w-3 rounded-full border border-white/20 shadow-sm flex items-center justify-center transition-transform ${
                              node.demand === 'alta' ? 'bg-red-500' :
                              node.demand === 'media' ? 'bg-amber-500' :
                              'bg-sky-400'
                            } ${isSelected ? 'scale-125' : ''}`}>
                              <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            </div>

                            {/* Floating text name tag */}
                            <span className={`absolute left-4 -top-2 px-1.5 py-0.5 rounded text-[9.5px] font-bold text-slate-100 bg-slate-900/90 whitespace-nowrap border ${isSelected ? 'border-amber-400 font-extrabold text-amber-400 text-[10px]' : 'border-slate-800'}`}>
                              {node.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] text-slate-400 font-medium bg-slate-900/60 px-2.5 py-1.5 rounded-xl border border-slate-850/50 backdrop-blur-xs">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 inline-block" /> Muy Alta (90%+)</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> Alta (75%+)</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-400 inline-block" /> Estable (50%+)</span>
                    </div>
                  </div>

                  {/* Selected region detail statistics & interactive simulation trigger */}
                  <AnimatePresence mode="wait">
                    {selectedRegionId ? (
                      (() => {
                        const node = heatmapData[city].find(n => n.id === selectedRegionId);
                        if (!node) return null;
                        return (
                          <motion.div
                            key={node.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3.5"
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Estadísticas: Barrio {node.name}</h5>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                node.demand === 'alta' ? 'bg-red-50 text-red-700 border border-red-100' :
                                node.demand === 'media' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                'bg-sky-50 text-sky-700 border border-sky-100'
                              }`}>
                                Demanda: {node.demand.toUpperCase()}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                              <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                                <span className="text-[9px] text-slate-400 block uppercase font-semibold">Tasa de Solicitud</span>
                                <span className="font-bold text-slate-800 font-mono text-sm">{node.count} viajes/hora</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                                <span className="text-[9px] text-slate-400 block uppercase font-semibold">Multiplicador</span>
                                <span className="font-bold text-emerald-600 font-mono text-sm">{node.factor.toFixed(1)}x</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                                <span className="text-[9px] text-slate-400 block uppercase font-semibold">Horario Pico</span>
                                <span className="font-bold text-indigo-600 text-[10.5px] truncate block">{node.time}</span>
                              </div>
                            </div>

                            {/* Client Request Simulator trigger button */}
                            <button
                              type="button"
                              onClick={() => simulateRequestFromRegion(node.name)}
                              disabled={!driverAvailable}
                              className={`w-full font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                                driverAvailable
                                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                                  : 'bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed opacity-60'
                              }`}
                            >
                              <Flame className="h-3.5 w-3.5 animate-pulse" /> {driverAvailable ? `Simular Cliente Solicitando en ${node.name}` : `Habilita tu Disponibilidad para simular`}
                            </button>
                          </motion.div>
                        );
                      })()
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-500 leading-relaxed">
                        💡 <strong>Haz clic en cualquier nodo del mapa táctil</strong> anterior para inspeccionar las estadísticas del barrio y simular un viaje entrante para el despacho.
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* TAB CONTENT: TOOLS & REPORTS */}
            {activeDriverTab === 'reports' && (
              <div className="space-y-4 animate-fade-in">
                {/* Sounds & Audio controls */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      {soundsEnabled ? (
                        <Volume2 className="h-4 w-4 text-emerald-600 animate-bounce" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-slate-400" />
                      )}
                      Notificaciones Sonoras Sintetizadas
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newMode = !soundsEnabled;
                        setSoundsEnabled(newMode);
                        localStorage.setItem('taxi_ge_sounds_enabled', String(newMode));
                        setStatus(`Efectos de sonido: ${newMode ? 'activados' : 'desactivados'}`);
                        setStatusType('info');
                        if (newMode) setTimeout(() => playNotificationSound('success'), 100);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        soundsEnabled ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        soundsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sintonizador de alertas integradas por síntesis de frecuencias. Emitirá sonidos en tiempo real al ingresar viajes, confirmar viajes o cancelarlos, sin consumir datos de red.
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Probar timbres de Guinea Ecuatorial:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => playNotificationSound('new')}
                        className="py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition-all flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <span>La Central 🔔</span>
                        <span className="text-[9px] text-slate-400 font-normal">Double Beep</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => playNotificationSound('success')}
                        className="py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition-all flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <span>🎉 Confirmado</span>
                        <span className="text-[9px] text-slate-400 font-normal">Arpeggio</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => playNotificationSound('alert')}
                        className="py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition-all flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <span>⚠ Cancelado</span>
                        <span className="text-[9px] text-slate-400 font-normal">Sweep Alarm</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Exporter control */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Descargar Reportes de Gestión
                  </h4>
                  <p className="text-xs text-slate-500 leading-normal">
                    Generador de planilla CSV local oficial. Puedes abrir el archivo generado de forma directa en Microsoft Excel o Google Sheets para gestionar tus ingresos y recorridos diarios.
                  </p>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs mb-1">
                    <div className="space-y-0.5">
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Registros en memoria</span>
                      <span className="font-bold text-slate-800">{requestHistory.length} carreras registradas</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                      Formato CSV (.csv)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={exportHistoryReport}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Download className="h-4 w-4" /> Exportar Reporte de Viajes (CSV)
                  </button>
                </div>

                {/* Simulation controls for Testing */}
                <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md space-y-3" id="driver-simulation-card">
                  <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Simulaciones Técnicas (Pruebas)
                  </h4>
                  <p className="text-[11.5px] text-slate-300 leading-normal">
                    ¿Deseas probar el sistema de aviso de suspensión por comisiones de 50 XAF impagadas en 48 horas? Pulsa el botón de abajo para simular una comisión vencida.
                  </p>
                  <button
                    type="button"
                    onClick={simulateOverdueCommissionForDriver}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    id="simulate-overdue-commission-btn"
                  >
                    <Clock className="h-4 w-4" /> Simular Comisión Vencida (&gt;48 Horas)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Admin Mode Panel */
          <div className="space-y-5 animate-fade-in" id="admin-mode-panel">
            {renderAdminDashboard()}
          </div>
        )}

      </main>

      <footer className="bg-white border-t border-slate-100 py-4 text-center mt-8 text-xs text-slate-400" id="app-footer">
        <div className="max-w-md mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-500">TaxiChat EG v2.0 • Guinea Ecuatorial</p>
          <p className="leading-relaxed text-[11px]">Diseñado para facilitar la movilidad y conectar con transportistas locales.</p>
          <p className="text-[10px] text-slate-300">No tenemos afiliación oficial con WhatsApp ni servicios gubernamentales de transporte.</p>
        </div>
      </footer>

      {/* Terms and Conditions Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            id="terms-conditions-modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden flex flex-col my-8"
              id="terms-conditions-modal-content"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 text-white flex items-center justify-between border-b border-slate-850">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-amber-500 shrink-0" />
                  <div className="text-left">
                    <h3 className="font-extrabold text-sm tracking-tight uppercase">
                      {termsModalStep === 'rules' ? 'Términos y Condiciones de Contrato' : 'Contrato de Contratación de Servicio'}
                    </h3>
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                      TaxiChat EG • Guinea Ecuatorial
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  id="close-terms-modal-btn"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Tabs Indicator */}
              <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50 text-center font-bold text-[11px] uppercase tracking-wider text-slate-500">
                <div className={`py-3 flex items-center justify-center gap-1.5 border-r border-slate-100 ${termsModalStep === 'rules' ? 'text-amber-600 bg-white border-b-2 border-b-amber-500' : 'opacity-60'}`}>
                  <span>1. Normas de Servicio</span>
                  {driverTermsAccepted && <span className="text-emerald-500">✓</span>}
                </div>
                <div className={`py-3 flex items-center justify-center gap-1.5 ${termsModalStep === 'commission' ? 'text-amber-600 bg-white border-b-2 border-b-amber-500' : 'opacity-60'}`}>
                  <span>2. Comisión de Pago (Muni)</span>
                  {driverCommissionContractAccepted && <span className="text-emerald-500">✓</span>}
                </div>
              </div>

              {/* Body Content */}
              {termsModalStep === 'rules' ? (
                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4 text-xs text-slate-600 leading-relaxed text-left">
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-amber-900 font-medium">
                    <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Este documento constituye un <strong>Contrato de Concesión y Términos de Servicio</strong> vinculante entre el transportista y la plataforma de movilidad <strong>TaxiChat EG</strong> en la República de Guinea Ecuatorial.
                    </span>
                  </div>

                  <p className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-1">
                    DECLARACIÓN DE COMPROMISO DEL CONDUCTOR:
                  </p>

                  <p>
                    Yo, <strong className="text-slate-900">{driverName || 'Santiago'} {driverLastName || 'Nguema'}</strong>, titular del documento de identidad oficial <strong className="text-slate-950">{driverIdNumber || 'DIP-9402941'}</strong> y operador registrado del vehículo <strong className="text-slate-950">{driverVehicle || 'Toyota Corolla'}</strong> con matrícula <strong className="text-slate-950">{driverPlate || 'M-4892-A'}</strong>, me comprometo formalmente a acatar, cumplir y respetar con absoluto rigor las siguientes normas del contrato de servicio:
                  </p>

                  <div className="space-y-3.5 pl-1">
                    {/* Respect */}
                    <div className="flex gap-2.5">
                      <span className="font-black text-slate-900 text-sm shrink-0">1.</span>
                      <div>
                        <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wide">Respeto Absoluto</strong>
                        <span>Ofrecer un trato cortés, educado, respetuoso e impecable a todos los pasajeros sin distinción alguna, absteniéndose de conductas ofensivas, lenguaje inapropiado o comentarios indebidos.</span>
                      </div>
                    </div>

                    {/* Security */}
                    <div className="flex gap-2.5">
                      <span className="font-black text-slate-900 text-sm shrink-0">2.</span>
                      <div>
                        <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wide">Seguridad Vial y de Pasajeros</strong>
                        <span>Garantizar la integridad física de los usuarios, conduciendo con precaución extrema, respetando rigurosamente los límites de velocidad oficiales vigentes en las carreteras de Guinea Ecuatorial.</span>
                      </div>
                    </div>

                    {/* Privacy */}
                    <div className="flex gap-2.5">
                      <span className="font-black text-slate-900 text-sm shrink-0">3.</span>
                      <div>
                        <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wide">Privacidad y Confidencialidad</strong>
                        <span>Proteger celosamente los datos de contacto del pasajero, su privacidad y la confidencialidad absoluta sobre cualquier conversación o trayecto efectuado en el vehículo.</span>
                      </div>
                    </div>

                    {/* Cautious driving */}
                    <div className="flex gap-2.5">
                      <span className="font-black text-slate-900 text-sm shrink-0">4.</span>
                      <div>
                        <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wide">Conducción Precauta</strong>
                        <span>Mantener en todo momento los cinco sentidos en la conducción. Queda terminantemente prohibido el uso del teléfono celular al conducir, maniobras temerarias o manejar bajo los efectos del cansancio o alcohol.</span>
                      </div>
                    </div>

                    {/* Vehicle condition */}
                    <div className="flex gap-2.5">
                      <span className="font-black text-slate-900 text-sm shrink-0">5.</span>
                      <div>
                        <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wide">Buen Estado del Vehículo</strong>
                        <span>Mantener el coche limpio, con un correcto funcionamiento mecánico y de seguridad (frenos funcionales, faros, amortiguación y cinturones utilizables).</span>
                      </div>
                    </div>

                    {/* No detour */}
                    <div className="flex gap-2.5">
                      <span className="font-black text-slate-900 text-sm shrink-0">6.</span>
                      <div>
                        <strong className="text-slate-900 block font-bold text-xs uppercase tracking-wide">No Desviar de la Dirección</strong>
                        <span>Cumplir de forma estricta con la dirección y destino solicitados por el pasajero en el trayecto. Queda prohibido desviar de ruta sin justificación de fuerza mayor o subir a otras personas ajenas al viaje contratado.</span>
                      </div>
                    </div>
                  </div>

                  {/* Penalties and Legal action clause */}
                  <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-red-950 font-medium space-y-2 text-left" id="legal-warning-box">
                    <div className="flex items-center gap-2 text-red-700 font-bold">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                      <span className="uppercase tracking-wider text-xs">Cláusula de Penalización y Denuncia</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      El incumplimiento de cualquiera de las normas enumeradas en este contrato de servicio resultará en la <strong>cancelación inmediata e irrevocable de su acceso</strong> como taxista en la plataforma TaxiChat EG.
                    </p>
                    <p className="text-[11px] leading-relaxed font-bold">
                      En casos graves de negligencia, robo, agresión o cualquier acto que atente contra las leyes de la República de Guinea Ecuatorial, usted será denunciado y entregado de forma directa a las autoridades y agentes judiciales del país: la <strong className="underline">Policía Nacional</strong> y la <strong className="underline">Gendarmería Nacional</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                /* STEP 2: COMMISSION CONTRACT ("CONTRATACIÓN") */
                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4 text-xs text-slate-600 leading-relaxed text-left" id="commission-contract-step-view">
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-emerald-900 font-medium">
                    <FileText className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[11px] uppercase tracking-wide text-emerald-800 mb-0.5">CONTRATO DE CONTRATACIÓN Y COMISIONES</span>
                      <span>
                        Firma del acuerdo de liquidación de aportaciones del transportista para el sostenimiento de la plataforma digital <strong>TaxiChat EG</strong>.
                      </span>
                    </div>
                  </div>

                  <p className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-1 uppercase tracking-wider">
                    CLÁUSULA DE COMISIONAMIENTO (MUNI DINERO):
                  </p>

                  <p>
                    El conductor abajo firmante declara y afirma formalmente comprometerse a transferir de manera obligatoria al número de teléfono estándar de la aplicación la cantidad de:
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      50 XAF <span className="text-slate-400 text-xs font-normal">por cada</span> 500 XAF
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      (Tasa de servicio del 10% por carrera efectuada)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                      <p className="text-[11.5px] text-slate-700 leading-relaxed">
                        La comisión se devengará inmediatamente una vez que el conductor reciba en la plataforma el acuse oficial de <strong className="text-emerald-700">"Pago Recibido con éxito ✓"</strong> por parte del pasajero o del despachador de la carrera.
                      </p>
                    </div>

                    <div className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                      <div className="text-[11.5px] text-slate-700 leading-relaxed space-y-1">
                        <p>El envío de fondos se realizará exclusivamente al número de teléfono oficial estándar de la plataforma:</p>
                        <p className="font-mono font-black text-slate-950 text-xs bg-amber-100/80 px-2 py-1 rounded-md inline-block">
                          00240555312102
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                          Servicio Autorizado: Muni Dinero
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                      <p className="text-[11.5px] text-slate-700 leading-relaxed">
                        Al pulsar <strong>"Estoy de Acuerdo"</strong>, usted autoriza a que la aplicación realice e imite de forma <strong>automatizada e instantánea</strong> la simulación del traspaso de los 50 XAF por cada 500 XAF correspondientes de la tarifa de la carrera directo al teléfono estandar oficial por cada acuse de pago recibido.
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-250 p-3.5 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
                    <strong>Aviso Técnico:</strong> El incumplimiento o saldo negativo en las aportaciones de Muni Dinero suspenderá automáticamente la asignación de nuevas solicitudes en Malabo y Bata, y la cuenta entrará en estado de morosidad administrativa.
                  </div>
                </div>
              )}

              {/* Actions / Buttons */}
              {termsModalStep === 'rules' ? (
                /* Buttons for Step 1 */
                <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3" id="terms-step1-buttons">
                  <button
                    type="button"
                    onClick={() => {
                      // Disagree cancels the registration completely!
                      setDriverName('');
                      setDriverLastName('');
                      setDriverIdNumber('');
                      setDriverAddress('');
                      setDriverAltPhone('');
                      setDriverVehicle('');
                      setDriverPlate('');
                      setDriverTermsAccepted(false);
                      setDriverCommissionContractAccepted(false);
                      setDriverAvailable(false);

                      localStorage.removeItem('taxi_ge_driver_name');
                      localStorage.removeItem('taxi_ge_driver_lastname');
                      localStorage.removeItem('taxi_ge_driver_id_number');
                      localStorage.removeItem('taxi_ge_driver_address');
                      localStorage.removeItem('taxi_ge_driver_alt_phone');
                      localStorage.removeItem('taxi_ge_driver_vehicle');
                      localStorage.removeItem('taxi_ge_driver_plate');
                      localStorage.removeItem('taxi_ge_driver_terms_accepted');
                      localStorage.removeItem('taxi_ge_driver_commission_accepted');
                      localStorage.removeItem('taxi_ge_driver_available');

                      setShowTermsModal(false);
                      setStatus('Registro cancelado completamente por desacuerdo con los términos generales. Los datos han sido borrados de la memoria.');
                      setStatusType('error');
                      playNotificationSound('alert');
                    }}
                    className="py-3 px-4 bg-white border border-slate-250 hover:bg-slate-100 text-red-600 font-bold rounded-2xl text-xs transition-colors cursor-pointer text-center"
                    id="disagree-terms-btn-step1"
                  >
                    No estoy de acuerdo ❌
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDriverTermsAccepted(true);
                      localStorage.setItem('taxi_ge_driver_terms_accepted', 'true');
                      // Open step 2: commission contract!
                      setTermsModalStep('commission');
                      playNotificationSound('new');
                    }}
                    className="py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl text-xs transition-colors cursor-pointer text-center shadow-md shadow-amber-500/10"
                    id="agree-terms-btn-step1"
                  >
                    Estoy de Acuerdo ✓ (Siguiente)
                  </button>
                </div>
              ) : (
                /* Buttons for Step 2 */
                <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3" id="terms-step2-buttons">
                  <button
                    type="button"
                    onClick={() => {
                      setDriverCommissionContractAccepted(false);
                      localStorage.setItem('taxi_ge_driver_commission_accepted', 'false');
                      setShowTermsModal(false);
                      setDriverAvailable(false); // disable availability since registration is incomplete
                      setStatus('Proceso de registro no completado. Es obligatorio aceptar el contrato de aportación Muni Dinero para activar su cuenta.');
                      setStatusType('error');
                      playNotificationSound('alert');
                    }}
                    className="py-3 px-4 bg-white border border-slate-250 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl text-xs transition-colors cursor-pointer text-center"
                    id="disagree-terms-btn-step2"
                  >
                    No estoy de acuerdo ❌
                  </button>
                   <button
                    type="button"
                    onClick={() => {
                      setDriverCommissionContractAccepted(true);
                      localStorage.setItem('taxi_ge_driver_commission_accepted', 'true');
                      setDriverTermsAccepted(true);
                      localStorage.setItem('taxi_ge_driver_terms_accepted', 'true');
                      setShowTermsModal(false);
                      setDriverAvailable(true); // make driver active & available!
                      localStorage.setItem('taxi_ge_driver_available', 'true');

                      // Add/Sync to registered drivers list
                      setRegisteredDrivers(prev => {
                        const plate = driverPlate || 'M-4892-A';
                        const existingIdx = prev.findIndex(d => d.vehiclePlate === plate || d.phone === phone);
                        if (existingIdx !== -1) {
                          const updated = [...prev];
                          updated[existingIdx] = {
                            ...updated[existingIdx],
                            name: driverName || 'Santiago',
                            lastName: driverLastName || 'Nguema',
                            phone: phone || '240555123456',
                            vehicleType: driverVehicle || 'Toyota Corolla (Taxi)',
                            vehiclePlate: plate,
                            city: city
                          };
                          return updated;
                        } else {
                          const newDriver: RegisteredDriver = {
                            id: `DRV-${Math.floor(106 + Math.random() * 800)}`,
                            name: driverName || 'Santiago',
                            lastName: driverLastName || 'Nguema',
                            phone: phone || '240555123456',
                            city: city,
                            vehiclePlate: plate,
                            vehicleType: driverVehicle || 'Toyota Corolla (Taxi)',
                            registeredAt: new Date().toISOString(),
                            status: 'activo'
                          };
                          return [newDriver, ...prev];
                        }
                      });

                      setStatus('¡Registro y Contrato completados con éxito! Ahora puede estar disponible para recibir solicitudes.');
                      setStatusType('success');
                      playNotificationSound('success');
                    }}
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer text-center shadow-md shadow-emerald-600/10"
                    id="agree-terms-btn-step2"
                  >
                    Estoy de acuerdo ✓ (Firmar Contrato)
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Driver Commission Prepayment Simulation Modal */}
      <AnimatePresence>
        {showPrepayModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            id="prepay-commission-modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full shadow-2xl overflow-hidden flex flex-col my-8 text-slate-800 text-left"
              id="prepay-commission-modal-content"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 text-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-slate-950 animate-bounce" />
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight uppercase">Abonar Comisiones</h3>
                    <p className="text-[10px] font-bold text-slate-950/80 leading-tight">Muni Dinero • Guinea Ecuatorial</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => !isPrepayProcessing && setShowPrepayModal(false)}
                  className="text-slate-900 hover:text-black p-1 bg-white/20 hover:bg-white/30 rounded-full transition-all cursor-pointer"
                  id="close-prepay-modal-btn"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Teléfono Oficial de Abono (Muni)</span>
                  <p className="font-mono font-black text-slate-950 text-sm flex items-center justify-between font-mono">
                    <span>00240 555 312 102</span>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full">TaxiChat EG ✓</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Seleccionar Importe de Abono:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1500, 3000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setPrepayAmount(val);
                          setCustomPrepayInput('');
                          playNotificationSound('new');
                        }}
                        className={`py-2 text-center rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                          prepayAmount === val && !customPrepayInput
                            ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {val} XAF
                      </button>
                    ))}
                  </div>

                  {/* Custom Input */}
                  <div className="space-y-1">
                    <label className="block text-[9.5px] font-bold text-slate-400 uppercase">O ingresar monto personalizado (Mín. 50 XAF):</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Monto libre. Ejemplo: 1000"
                        value={customPrepayInput}
                        onChange={(e) => {
                          setCustomPrepayInput(e.target.value);
                          const parsed = Number(e.target.value);
                          if (parsed > 0) setPrepayAmount(parsed);
                        }}
                        disabled={isPrepayProcessing}
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl pl-3 pr-12 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 font-mono">XAF</span>
                    </div>
                  </div>
                </div>

                {/* Cover metrics card */}
                <div className="bg-slate-900 text-white rounded-2xl p-3.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 block">Total a Prepagar</span>
                    <span className="font-mono font-black text-amber-400 text-base">{prepayAmount} XAF</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 block">Carreras Cubiertas</span>
                    <span className="font-extrabold text-white text-xs block">{Math.floor(prepayAmount / 50)} viajes futuros</span>
                  </div>
                </div>

                <p className="text-[10.5px] text-slate-500 leading-normal">
                  Este abono simula un traspaso de Mobile Money mediante la plataforma oficial del operador nacional de Guinea Ecuatorial.
                </p>
              </div>

              {/* Actions */}
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                {isPrepayProcessing ? (
                  <div className="py-3 px-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider animate-pulse">Esperando Red Muni Dinero...</span>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleConfirmPrepay(prepayAmount)}
                      disabled={prepayAmount < 50}
                      className={`w-full font-black py-3 px-4 rounded-2xl text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md ${
                        prepayAmount >= 50
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/10'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <DollarSign className="h-3.5 w-3.5" /> Confirmar Recarga Prepago
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPrepayModal(false)}
                      className="w-full bg-white border border-slate-250 hover:bg-slate-100 text-slate-600 font-bold py-2.5 rounded-2xl text-[11px] transition-colors cursor-pointer text-center"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Security PIN Login Modal */}
      <AnimatePresence>
        {showAdminLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            id="admin-login-modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full border border-slate-100 text-slate-800"
            >
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-6 relative">
                <button
                  onClick={() => setShowAdminLoginModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  id="close-admin-login-btn"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500 text-slate-950 p-2.5 rounded-2xl">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-base text-slate-100">Acceso Creador</h3>
                    <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Administrador de la App</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  // Check password
                  if (adminPinInput === '2026' || adminPinInput === 'admin') {
                    setIsAdminLoggedIn(true);
                    localStorage.setItem('taxi_ge_admin_logged_in', 'true');
                    setShowAdminLoginModal(false);
                    setAppRole('admin');
                    setAdminPinInput('');
                    setAdminPinError('');
                    setStatus('¡Acceso concedido como Administrador y Creador! 👑');
                    setStatusType('success');
                    playNotificationSound('success');
                  } else {
                    setAdminPinError('Código de administrador incorrecto. Intente con "2026".');
                    playNotificationSound('alert');
                  }
                }}
                className="p-6 space-y-4 text-left"
              >
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    Ingresar Código PIN de Seguridad
                  </label>
                  <input
                    type="password"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    placeholder="••••"
                    maxLength={10}
                    className="w-full text-center text-xl tracking-widest py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 font-bold text-slate-900"
                    id="admin-pin-field"
                    autoFocus
                  />
                  {adminPinError && (
                    <p className="text-red-600 font-medium text-xs flex items-center gap-1.5 mt-1" id="admin-pin-error">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {adminPinError}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-1">
                    *Para fines de pruebas, use el código de creador <strong className="text-slate-600">2026</strong> o <strong className="text-slate-600">admin</strong> para entrar.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-slate-950/10 cursor-pointer"
                    id="submit-admin-pin-btn"
                  >
                    <Lock className="h-4 w-4" /> Validar y Entrar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Support Chat Widget */}
      <SupportChat />

    </div>
  );
}
