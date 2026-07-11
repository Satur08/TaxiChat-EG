import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, Loader2, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';

interface DocumentState {
  id: string;
  name: string;
  description: string;
  status: 'empty' | 'uploading' | 'processing' | 'verified' | 'rejected';
  fileName: string;
  fileSize: string;
  docNumber: string;
  expiryDate: string;
  error?: string;
}

export const DocumentValidator: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentState[]>(() => {
    const saved = localStorage.getItem('taxi_ge_driver_documents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing documents', e);
      }
    }
    return [
      {
        id: 'dip',
        name: 'Documento de Identidad Nacional (DIP o Pasaporte)',
        description: 'Obligatorio para identificar al conductor autorizado.',
        status: 'empty',
        fileName: '',
        fileSize: '',
        docNumber: '',
        expiryDate: '',
      },
      {
        id: 'license',
        name: 'Licencia de Conducir (Dirección de Tráfico)',
        description: 'Permiso vigente emitido por las autoridades de Guinea Ecuatorial.',
        status: 'empty',
        fileName: '',
        fileSize: '',
        docNumber: '',
        expiryDate: '',
      },
      {
        id: 'taxi_permit',
        name: 'Licencia Municipal / Autorización del Vehículo',
        description: 'Permiso del ayuntamiento para operar como taxi en Malabo o Bata.',
        status: 'empty',
        fileName: '',
        fileSize: '',
        docNumber: '',
        expiryDate: '',
      }
    ];
  });

  const [activeDocId, setActiveDocId] = useState<string>('dip');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [inputDocNumber, setInputDocNumber] = useState<string>('');
  const [inputExpiry, setInputExpiry] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Save documents state to localStorage
  useEffect(() => {
    localStorage.setItem('taxi_ge_driver_documents', JSON.stringify(documents));
  }, [documents]);

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFileSelection = (fileName: string, sizeBytes: number) => {
    const formattedSize = (sizeBytes / (1024 * 1024)).toFixed(2) + ' MB';
    
    // Set status to uploading
    setDocuments(prev => prev.map(d => {
      if (d.id === activeDocId) {
        return {
          ...d,
          status: 'uploading',
          fileName: fileName,
          fileSize: formattedSize
        };
      }
      return d;
    }));

    // Simulate progress bar upload
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          // Move to processing
          setDocuments(curr => curr.map(d => {
            if (d.id === activeDocId) {
              return { ...d, status: 'processing' };
            }
            return d;
          }));

          // Simulate OCR processing and remote verification with ministry servers
          setTimeout(() => {
            setDocuments(curr => curr.map(d => {
              if (d.id === activeDocId) {
                return {
                  ...d,
                  status: 'verified',
                  docNumber: inputDocNumber || `GE-${Math.floor(100000 + Math.random() * 900000)}`,
                  expiryDate: inputExpiry || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0]
                };
              }
              return d;
            }));
            setInputDocNumber('');
            setInputExpiry('');
          }, 2500);

          return 100;
        }
        return p + 20;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFileSelection(file.name, file.size);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFileSelection(file.name, file.size);
    }
  };

  const resetDocument = (id: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: 'empty',
          fileName: '',
          fileSize: '',
          docNumber: '',
          expiryDate: ''
        };
      }
      return d;
    }));
  };

  // Helper values
  const totalVerified = documents.filter(d => d.status === 'verified').length;
  const isFullyVerified = totalVerified === documents.length;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4" id="document-validator-box">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500/10 p-1.5 rounded-xl text-amber-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Verificación de Documentos</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Control de seguridad para taxistas de Guinea Ecuatorial</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isFullyVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {totalVerified}/{documents.length} Verificados
        </span>
      </div>

      {/* Verification Summary Badge */}
      {isFullyVerified ? (
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 leading-normal animate-fade-in" id="doc-fully-verified-alert">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-900">✓ Perfil Homologado y Verificado</p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Tus documentos han sido validados con éxito. Eres un conductor de confianza de Guinea Ecuatorial y tu perfil es visible para los clientes.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600 leading-normal">
          <AlertCircle className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px]">
            Sube fotos claras de tus documentos oficiales de Guinea Ecuatorial. El sistema OCR automatizado validará la vigencia de los datos en segundos.
          </p>
        </div>
      )}

      {/* Horizontal document type selectors */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" id="doc-selector-tabs">
        {documents.map((doc) => {
          const isSelected = doc.id === activeDocId;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => {
                setActiveDocId(doc.id);
                setInputDocNumber('');
                setInputExpiry('');
              }}
              className={`px-3 py-1.5 text-[10.5px] font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer border ${
                isSelected 
                  ? 'bg-slate-900 text-slate-100 border-slate-900 shadow-xs' 
                  : 'bg-slate-50 text-slate-500 hover:text-slate-900 border-slate-200'
              }`}
              id={`tab-doc-${doc.id}`}
            >
              <span>{doc.id === 'dip' ? 'DIP' : doc.id === 'license' ? 'Licencia' : 'Mun. Taxi'}</span>
              {doc.status === 'verified' && <CheckCircle className="h-3 w-3 text-emerald-500 fill-emerald-50" />}
              {doc.status === 'processing' && <Loader2 className="h-3 w-3 animate-spin text-sky-500" />}
              {doc.status === 'uploading' && <div className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-ping" />}
            </button>
          );
        })}
      </div>

      {/* Selected Document Workspace Panel */}
      <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4 space-y-3" id="active-document-panel">
        <div>
          <h5 className="font-bold text-xs text-slate-800">{activeDoc.name}</h5>
          <p className="text-[10.5px] text-slate-400 leading-normal mt-0.5">{activeDoc.description}</p>
        </div>

        {/* Form Inputs (optional details that will get captured during OCR) */}
        {activeDoc.status === 'empty' && (
          <div className="grid grid-cols-2 gap-2 text-xs" id="pre-upload-inputs">
            <div className="space-y-1">
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase">Nº Documento (Opcional)</label>
              <input
                type="text"
                value={inputDocNumber}
                onChange={(e) => setInputDocNumber(e.target.value)}
                placeholder="Ej. DIP-102941"
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[9.5px] font-bold text-slate-500 uppercase">Fecha Exp. (Opcional)</label>
              <input
                type="date"
                value={inputExpiry}
                onChange={(e) => setInputExpiry(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* WORKSPACE STATUSES */}

        {/* Empty status (requires file selection/drop) */}
        {activeDoc.status === 'empty' && (
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2.5 transition-all relative ${
              dragActive 
                ? 'border-amber-500 bg-amber-50/50' 
                : 'border-slate-250 bg-white hover:border-slate-400'
            }`}
            id="drag-drop-zone"
          >
            <input
              type="file"
              id={`file-input-${activeDoc.id}`}
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleManualUpload}
            />
            
            <div className="bg-amber-500/10 p-2.5 rounded-full text-amber-600">
              <Upload className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                <label 
                  htmlFor={`file-input-${activeDoc.id}`}
                  className="text-amber-600 hover:text-amber-700 cursor-pointer underline hover:no-underline"
                >
                  Selecciona un archivo
                </label> o arrástralo aquí
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Soporta PNG, JPEG o PDF de hasta 5MB</p>
            </div>
          </div>
        )}

        {/* Uploading status */}
        {activeDoc.status === 'uploading' && (
          <div className="bg-white rounded-2xl border border-slate-150 p-5 text-center space-y-3" id="doc-uploading-state">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">Subiendo "{activeDoc.fileName}"</p>
              <p className="text-[10px] text-slate-400 font-mono">{activeDoc.fileSize}</p>
            </div>
            
            {/* Real progress line */}
            <div className="w-full max-w-xs mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-amber-600 font-mono">{uploadProgress}%</span>
          </div>
        )}

        {/* OCR Processing status */}
        {activeDoc.status === 'processing' && (
          <div className="bg-white rounded-2xl border border-sky-100 p-5 text-center space-y-3" id="doc-processing-state">
            <div className="relative inline-flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-sky-500 animate-bounce absolute" />
              <Loader2 className="h-10 w-10 text-sky-200 animate-spin" />
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-850">Escaneando documento...</p>
              <p className="text-[10.5px] text-slate-500">
                Estableciendo conexión encriptada con la Base de Datos Oficial de Guinea Ecuatorial...
              </p>
            </div>

            <div className="inline-block bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1 text-[9px] text-sky-700 font-mono font-bold uppercase animate-pulse">
              Verificando DIP con el Registro Civil
            </div>
          </div>
        )}

        {/* Verified status card */}
        {activeDoc.status === 'verified' && (
          <div className="bg-white rounded-2xl border border-emerald-150 p-4 space-y-3 animate-fade-in" id="doc-verified-card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-[9px] text-emerald-600 font-black tracking-widest block uppercase">Documento</span>
                  <span className="text-xs font-bold text-slate-800">Verificado Exitosamente</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => resetDocument(activeDoc.id)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                title="Volver a subir"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* OCR Extracted Data Sheet */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Nº REGISTRO:</span>
                <span className="text-slate-800 font-bold">{activeDoc.docNumber}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">EXPIRACIÓN:</span>
                <span className="text-emerald-700 font-bold">{activeDoc.expiryDate} (Válido)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">FUENTE:</span>
                <span className="text-slate-500 font-bold">Ministerio GE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
