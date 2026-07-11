import React, { useState, useEffect, useRef } from 'react';
import { Compass, Navigation, MapPin, Volume2, VolumeX, X, Play, Square, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import { City } from '../types';

interface GpsNavigatorProps {
  city: City;
  pickup: string;
  destination: string;
  onClose: () => void;
  isDriver?: boolean;
}

// Custom Spanish navigation instructions based on the location details
const getSimulatedSteps = (pickup: string, destination: string, city: string) => {
  return [
    { text: `Inicia la ruta desde ${pickup}`, dist: '0 m' },
    { text: `Gira a la derecha en la intersección de la Avenida de la Independencia`, dist: '250 m' },
    { text: `Sigue recto por la calzada principal de ${city === 'Malabo' ? 'Avenida Hassan II' : 'Calle de Ngolo'}`, dist: '1.2 km' },
    { text: `En la rotonda, toma la segunda salida hacia la zona comercial`, dist: '600 m' },
    { text: `Gira a la izquierda con precaución`, dist: '150 m' },
    { text: `Destino alcanzado: ${destination} está a tu derecha 🏁`, dist: '0 m' }
  ];
};

export const GpsNavigator: React.FC<GpsNavigatorProps> = ({
  city,
  pickup,
  destination,
  onClose,
  isDriver = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(45);
  const [etaMinutes, setEtaMinutes] = useState<number>(8);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps = getSimulatedSteps(pickup, destination, city);

  // Text to speech synthesiser for GPS voice directions
  const speakStep = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed', e);
    }
  };

  // Play instruction sound or synthesize voice when step changes
  useEffect(() => {
    if (isPlaying && steps[currentStepIndex]) {
      speakStep(steps[currentStepIndex].text);
    }
  }, [currentStepIndex, isPlaying]);

  // Handle live progress simulation
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            return 100;
          }
          const nextProgress = prev + 1.5;
          
          // Determine current step index based on progress percentage
          const stepIndex = Math.min(
            Math.floor((nextProgress / 100) * steps.length),
            steps.length - 1
          );
          if (stepIndex !== currentStepIndex) {
            setCurrentStepIndex(stepIndex);
          }

          // Simulate fluctuating speeds and updating ETA minutes
          setSpeed(Math.floor(35 + Math.random() * 25));
          setEtaMinutes(Math.max(1, Math.round(8 * (1 - nextProgress / 100))));

          return nextProgress;
        });
      }, 500);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, currentStepIndex]);

  const handleRestart = () => {
    setProgress(0);
    setCurrentStepIndex(0);
    setEtaMinutes(8);
    setIsPlaying(true);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 border border-slate-800 shadow-2xl relative overflow-hidden space-y-4" id="gps-navigator-widget">
      {/* Upper ambient color accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500" />
      
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3" id="gps-header">
        <div className="flex items-center gap-2">
          <div className="bg-sky-500/15 p-1.5 rounded-xl text-sky-400 animate-spin-slow">
            <Compass className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-sky-400">GPS NAVEGACIÓN ACTIVA</h4>
            <p className="text-[10px] text-slate-400 font-medium">Despacho Guinea Ecuatorial ({city})</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              const nextVal = !voiceEnabled;
              setVoiceEnabled(nextVal);
              if (nextVal && steps[currentStepIndex]) {
                speakStep("Navegación por voz activada");
              }
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              voiceEnabled ? 'bg-sky-500/20 border-sky-500 text-sky-400' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Tornar Voz de Navegación"
            id="gps-toggle-voice"
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-colors border border-slate-700"
            id="gps-close-btn"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main HUD: Instructions */}
      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 space-y-3 relative overflow-hidden" id="gps-hud">
        {/* Signal indicator */}
        <div className="absolute top-2.5 right-3 flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded-md">
          <span className="h-1 w-1 rounded-full bg-emerald-400 inline-block animate-ping" />
          GPS COBERTURA OK
        </div>

        {/* Current Instruction Detail */}
        <div className="flex items-start gap-3">
          <div className="bg-sky-500 text-slate-950 p-2.5 rounded-2xl shrink-0 mt-0.5 shadow-lg shadow-sky-500/20">
            <Navigation className="h-5 w-5 transform rotate-45 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">Próxima Instrucción</span>
            <p className="font-extrabold text-sm text-slate-100 leading-snug">
              {steps[currentStepIndex]?.text || 'Cargando indicaciones...'}
            </p>
            <p className="text-xs text-slate-400 font-bold">
              Distancia estimada: <span className="text-slate-200">{steps[currentStepIndex]?.dist}</span>
            </p>
          </div>
        </div>

        {/* Real-time parameters row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-900 text-center">
          <div className="bg-slate-900/50 p-2 rounded-xl">
            <span className="text-[8px] text-slate-400 block uppercase font-bold">Llegada (ETA)</span>
            <span className="font-black text-slate-100 font-mono text-sm">{etaMinutes} min</span>
          </div>
          <div className="bg-slate-900/50 p-2 rounded-xl">
            <span className="text-[8px] text-slate-400 block uppercase font-bold">Velocidad</span>
            <span className="font-black text-amber-400 font-mono text-sm">{isPlaying ? speed : 0} km/h</span>
          </div>
          <div className="bg-slate-900/50 p-2 rounded-xl">
            <span className="text-[8px] text-slate-400 block uppercase font-bold">Progreso</span>
            <span className="font-black text-emerald-400 font-mono text-sm">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Visual Progress Bar on Route */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold font-mono">
            <span className="truncate max-w-[120px]">📍 {pickup}</span>
            <span className="truncate max-w-[120px]">🏁 {destination}</span>
          </div>
          <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300 rounded-full" 
              style={{ width: `${progress}%` }} 
            />
            {/* Pulsing Dot representing the Taxi */}
            <div 
              className="absolute h-3 w-3 rounded-full bg-white border border-sky-500 shadow-md -top-[1.5px] -ml-1.5 transition-all duration-300"
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Safety Alert Banner */}
      {isDriver && (
        <div className="bg-amber-950/30 border border-amber-900/40 p-2.5 rounded-xl flex items-start gap-2 text-[10.5px] text-amber-300 leading-normal">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5 animate-pulse" />
          <span>
            <strong>Recordatorio de Seguridad:</strong> No manipules el teléfono móvil mientras conduces tu taxi por las calles de Guinea Ecuatorial.
          </span>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex gap-2" id="gps-controls">
        {isPlaying ? (
          <button
            type="button"
            onClick={() => setIsPlaying(false)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Square className="h-3.5 w-3.5" /> Pausar Simulación
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (progress >= 100) {
                handleRestart();
              } else {
                setIsPlaying(true);
              }
            }}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-slate-950 font-extrabold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" /> {progress >= 100 ? 'Iniciar de Nuevo 🔄' : 'Reanudar GPS'}
          </button>
        )}
        <button
          type="button"
          onClick={handleRestart}
          className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
        >
          Reiniciar
        </button>
      </div>

      {/* Turn-by-Turn step indicators */}
      <div className="space-y-1.5" id="gps-step-indicator-list">
        <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Itinerario de Ruta</h5>
        <div className="space-y-1 max-h-24 overflow-y-auto pr-1 text-[11px] divide-y divide-slate-850">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div 
                key={idx} 
                className={`py-1.5 flex items-center justify-between gap-2 transition-all ${
                  isCurrent ? 'text-sky-400 font-extrabold' : 
                  isCompleted ? 'text-slate-500 line-through opacity-60' : 'text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {isCompleted ? (
                    <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <span className="h-2 w-2 rounded-full bg-sky-400 inline-block animate-ping shrink-0" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
                  )}
                  <span className="truncate">{step.text}</span>
                </div>
                <span className="text-[10px] font-mono shrink-0">{step.dist}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
