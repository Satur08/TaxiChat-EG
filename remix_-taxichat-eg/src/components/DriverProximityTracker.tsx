import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Compass, PhoneCall, MessageCircle, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { TaxiRequest } from '../types';

interface DriverProximityTrackerProps {
  request: TaxiRequest;
  onArrived?: () => void;
}

export const DriverProximityTracker: React.FC<DriverProximityTrackerProps> = ({
  request,
  onArrived
}) => {
  const [distanceMeters, setDistanceMeters] = useState<number>(1150);
  const [minutesRemaining, setMinutesRemaining] = useState<number>(5);
  const [currentStatusText, setCurrentStatusText] = useState<string>('Saliendo de la parada de taxi...');
  const [driverMessages, setDriverMessages] = useState<Array<{ sender: 'driver' | 'user'; text: string; time: string }>>([
    { sender: 'driver', text: `¡Hola! He aceptado tu carrera desde ${request.pickup}. Voy de camino.`, time: 'Hace 1 min' }
  ]);
  const [quickInput, setQuickInput] = useState<string>('');
  const [carPositionPercent, setCarPositionPercent] = useState<number>(0);

  // Proximity simulator loop
  useEffect(() => {
    const timer = setInterval(() => {
      setDistanceMeters((prev) => {
        if (prev <= 15) {
          clearInterval(timer);
          setMinutesRemaining(0);
          setCurrentStatusText('¡El taxista ha llegado a tu ubicación! 🏁');
          if (onArrived) onArrived();
          return 0;
        }

        // Decrease distance
        const decreaseAmount = Math.floor(25 + Math.random() * 20);
        const newDistance = Math.max(0, prev - decreaseAmount);

        // Calculate progress percentage
        const totalDistance = 1150;
        const progress = ((totalDistance - newDistance) / totalDistance) * 100;
        setCarPositionPercent(progress);

        // Update ETA minutes
        setMinutesRemaining(Math.max(1, Math.ceil(newDistance / 240)));

        // Update driver statuses based on distance milestones
        if (newDistance < 900 && newDistance >= 600) {
          setCurrentStatusText('Conduciendo por la avenida principal...');
        } else if (newDistance < 600 && newDistance >= 300) {
          setCurrentStatusText('Pasando por la rotonda cercana...');
        } else if (newDistance < 300 && newDistance >= 100) {
          setCurrentStatusText('A solo dos calles de distancia...');
        } else if (newDistance < 100 && newDistance > 0) {
          setCurrentStatusText('¡Buscando tu portal / esquina en este momento!');
        }

        return newDistance;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Simulate taxi driver messages at milestones
  useEffect(() => {
    let messageTimer: NodeJS.Timeout;

    if (distanceMeters < 800 && distanceMeters > 700) {
      messageTimer = setTimeout(() => {
        setDriverMessages(prev => [
          ...prev,
          { sender: 'driver', text: 'Hay un poco de tráfico, pero no tardo en llegar.', time: 'Ahora mismo' }
        ]);
      }, 1000);
    } else if (distanceMeters < 250 && distanceMeters > 150) {
      messageTimer = setTimeout(() => {
        setDriverMessages(prev => [
          ...prev,
          { sender: 'driver', text: 'Ya estoy girando en tu calle. Espérame afuera.', time: 'Ahora mismo' }
        ]);
      }, 1000);
    }

    return () => clearTimeout(messageTimer);
  }, [distanceMeters]);

  const sendQuickText = (text: string) => {
    if (!text.trim()) return;
    setDriverMessages(prev => [
      ...prev,
      { sender: 'user', text: text, time: 'Ahora mismo' }
    ]);
    setQuickInput('');

    // Simulate quick acknowledgements
    setTimeout(() => {
      setDriverMessages(prev => [
        ...prev,
        { sender: 'driver', text: '¡Entendido, de acuerdo! 👍', time: 'Ahora mismo' }
      ]);
    }, 1200);
  };

  const quickTexts = [
    'Ya estoy en la esquina esperando',
    'Llevo equipaje/bolsas',
    'Voy de color azul',
    'Llámame cuando llegues'
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4" id="driver-proximity-tracker">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="bg-sky-100 text-sky-800 p-1.5 rounded-xl animate-pulse">
            <Navigation className="h-4.5 w-4.5 text-sky-600" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Localización del Conductor</h5>
            <p className="text-[10.5px] text-slate-400 mt-0.5">Seguimiento por GPS en tiempo real</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Llegada Estimada</span>
          <span className="font-black text-xs text-emerald-600 font-mono">
            {distanceMeters === 0 ? '¡Ha llegado! 🏁' : `${minutesRemaining} min (${distanceMeters}m)`}
          </span>
        </div>
      </div>

      {/* Animated Route Proximity Vector HUD */}
      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-900 relative overflow-hidden" id="proximity-hud">
        {/* Sky-blue grid background accent */}
        <div className="absolute inset-0 bg-radial-at-t from-sky-950/20 via-slate-950 to-slate-950 opacity-60 pointer-events-none" />
        
        {/* Status ticker */}
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-sky-400 mb-4 bg-sky-950/40 border border-sky-900/30 px-3 py-1.5 rounded-xl">
          <span className="h-2 w-2 rounded-full bg-sky-400 inline-block animate-ping shrink-0" />
          <span>ESTADO: {currentStatusText}</span>
        </div>

        {/* Proximity Track Line */}
        <div className="relative pt-6 pb-2 px-1">
          {/* Street line */}
          <div className="h-2.5 bg-slate-800 rounded-full w-full relative border border-slate-700">
            {/* Filled traversed path */}
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full transition-all duration-500"
              style={{ width: `${carPositionPercent}%` }}
            />
          </div>

          {/* Start Point (Taxi Stop / Current position) */}
          <div className="absolute left-0 top-0.5 flex flex-col items-center">
            <span className="text-[8px] font-mono text-slate-500 font-bold uppercase tracking-wider">TAXI</span>
            <div className="h-2 w-2 bg-slate-600 rounded-full mt-0.5" />
          </div>

          {/* End Point (Passenger / Target Pin) */}
          <div className="absolute right-0 top-0.5 flex flex-col items-center">
            <span className="text-[8px] font-mono text-emerald-400 font-extrabold uppercase tracking-wider">TU</span>
            <MapPin className="h-4.5 w-4.5 text-emerald-500 animate-bounce -mt-0.5 shrink-0" />
          </div>

          {/* Moving Taxi Car Indicator */}
          <div 
            className="absolute top-1.5 -ml-3.5 transition-all duration-500 flex flex-col items-center"
            style={{ left: `${Math.min(95, carPositionPercent)}%` }}
          >
            <div className="bg-amber-500 text-slate-950 rounded-lg p-1 shadow-lg border border-amber-400 animate-pulse">
              🚖
            </div>
            {/* Beam of headlamps */}
            <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-8 border-r-amber-300/30 rotate-180 transform mt-0.5" />
          </div>
        </div>

        {/* Driver Metadata Display */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-900 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1 rounded-lg">
              👨‍✈️
            </div>
            <div>
              <span className="text-slate-200 font-bold block leading-none">{request.driverName || 'Santiago'}</span>
              <span className="text-[10px] text-slate-500 font-medium font-mono">{request.vehiclePlate || 'M-4892-A'}</span>
            </div>
          </div>
          
          <span className="text-[10.5px] bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-lg font-mono">
            {request.vehicleType || 'Toyota Corolla'}
          </span>
        </div>
      </div>

      {/* Driver Coordinates Chat Drawer */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3" id="driver-chat-box">
        <h6 className="font-bold text-[11px] text-slate-600 uppercase tracking-wider flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5 text-slate-400" /> Conversación con el Conductor
        </h6>

        {/* Live chat thread */}
        <div className="space-y-2 max-h-32 overflow-y-auto pr-1 text-xs" id="proximity-chat-messages">
          {driverMessages.map((msg, idx) => {
            const isDriver = msg.sender === 'driver';
            return (
              <div key={idx} className={`flex ${isDriver ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-2.5 rounded-xl leading-normal max-w-[85%] ${
                  isDriver 
                    ? 'bg-white text-slate-800 border border-slate-200/60 shadow-2xs' 
                    : 'bg-emerald-600 text-white shadow-2xs font-medium'
                }`}>
                  <p>{msg.text}</p>
                  <span className="text-[8.5px] text-slate-400 block text-right mt-0.5">{msg.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Text Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 whitespace-nowrap scrollbar-none" id="proximity-quick-texts">
          {quickTexts.map((text, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendQuickText(text)}
              className="inline-block bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-lg border border-slate-250 transition-colors cursor-pointer"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
