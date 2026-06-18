import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as faceapi from 'face-api.js';
import { useFaceApi } from '../hooks/useFaceApi';

function HeadSilhouette() {
  return (
    <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="50" cy="45" rx="32" ry="38" stroke="rgba(184,202,118,0.9)" strokeWidth="2" fill="rgba(184,202,118,0.08)" />
      <circle cx="35" cy="38" r="4" fill="rgba(184,202,118,0.6)" />
      <circle cx="65" cy="38" r="4" fill="rgba(184,202,118,0.6)" />
      <path d="M38 55 Q50 62 62 55" stroke="rgba(184,202,118,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="90" rx="20" ry="25" stroke="rgba(184,202,118,0.4)" strokeWidth="1.5" fill="rgba(184,202,118,0.05)" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="40" cy="40" r="36" stroke="rgba(184,202,118,0.7)" strokeWidth="2" fill="rgba(184,202,118,0.05)" />
      <path d="M50 20 L25 40 L50 60" stroke="rgba(184,202,118,0.9)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="30" cy="40" r="3" fill="rgba(184,202,118,0.9)" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="40" cy="40" r="36" stroke="rgba(184,202,118,0.7)" strokeWidth="2" fill="rgba(184,202,118,0.05)" />
      <path d="M30 20 L55 40 L30 60" stroke="rgba(184,202,118,0.9)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="50" cy="40" r="3" fill="rgba(184,202,118,0.9)" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="40" cy="40" r="36" stroke="#22c55e" strokeWidth="2" fill="rgba(34,197,94,0.1)" />
      <path d="M22 42 L35 55 L58 28" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function BorderProgress({ progress }) {
  const clamped = Math.max(0, Math.min(1, progress));
  const seg = (start) => Math.max(0, Math.min(1, (clamped - start) / 0.25)) * 100;

  const topWidth = seg(0);
  const rightHeight = seg(0.25);
  const bottomWidth = seg(0.5);
  const leftHeight = seg(0.75);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl overflow-hidden">
      <div
        className="absolute top-0 left-0 h-1 bg-medi-400 transition-all duration-300"
        style={{ width: `${topWidth}%` }}
      />
      <div
        className="absolute top-0 right-0 w-1 bg-medi-400 transition-all duration-300"
        style={{ height: `${rightHeight}%` }}
      />
      <div
        className="absolute bottom-0 right-0 h-1 bg-medi-400 transition-all duration-300"
        style={{ width: `${bottomWidth}%` }}
      />
      <div
        className="absolute bottom-0 left-0 w-1 bg-medi-400 transition-all duration-300"
        style={{ height: `${leftHeight}%` }}
      />
    </div>
  );
}

export const FaceCapture = forwardRef(function FaceCapture(
  { onDetection, onLivenessPass, onStepDescriptor, disabledLiveness },
  ref
) {
  const videoRef = useRef(null);
  const livenessRef = useRef({
    running: false,
    step: 0,
    stableCount: 0,
    timer: null,
    stepTimer: null,
  });
  const [cameraOn, setCameraOn] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [starting, setStarting] = useState(false);
  const [livenessStep, setLivenessStep] = useState(0);
  const [livenessStableCount, setLivenessStableCount] = useState(0);

  const { loading: modelsLoading, error: modelError, startCamera, stopCamera } = useFaceApi();

  useImperativeHandle(ref, () => ({
    getVideo: () => videoRef.current,
    cameraOn,
    livenessPassed,
    captureNow: async () => {
      if (!videoRef.current) return null;
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.85 })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();
      return detection?.descriptor || null;
    },
  }));

  const detectFace = async () => {
    if (!videoRef.current) return null;
    return faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceExpressions();
  };

  const stopLiveness = () => {
    livenessRef.current.running = false;
    if (livenessRef.current.timer) clearTimeout(livenessRef.current.timer);
    if (livenessRef.current.stepTimer) clearTimeout(livenessRef.current.stepTimer);
  };

  const getHeadDirection = (noseX) => {
    if (!videoRef.current) return 'FRENTE';
    const center = videoRef.current.videoWidth / 2;
    const offset = noseX - center;
    if (offset > 60) return 'IZQUIERDA';
    if (offset < -60) return 'DERECHA';
    return 'FRENTE';
  };

  const captureStepDescriptor = async () => {
    if (!videoRef.current) return null;
    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detection?.descriptor || null;
  };

  const livenessTick = async () => {
    if (!livenessRef.current.running) {
      return;
    }

    const detection = await detectFace();

    if (!detection) {
      setPhase('no-face');
      setFaceDetected(false);
      livenessRef.current.timer = setTimeout(livenessTick, 300);
      return;
    }

    setFaceDetected(true);

    const nose = detection.landmarks.getNose()[3];
    const direction = getHeadDirection(nose.x);
    const s = livenessRef.current;
    const runStateMachine = !disabledLiveness;

    if (runStateMachine) {
      if (s.step === 0) {
        setPhase('liveness-front');
        setLivenessStep(0);
        if (direction === 'FRENTE') {
          s.stableCount++;
          setLivenessStableCount(s.stableCount);
        } else {
          s.stableCount = 0;
          setLivenessStableCount(0);
        }
        if (s.stableCount >= 5) {
          s.stableCount = 0;
          setLivenessStableCount(0);
          setPhase('step-done');
          const descriptor = await captureStepDescriptor();
          if (descriptor && onStepDescriptor) {
            onStepDescriptor({ descriptor, direction: 'FRENTE' });
          }
          s.stepTimer = setTimeout(() => {
            s.step = 1;
            setLivenessStep(1);
            livenessRef.current.timer = setTimeout(livenessTick, 300);
          }, 600);
          return;
        }
      } else if (s.step === 1) {
        setPhase('liveness-left');
        setLivenessStep(1);
        if (direction === 'IZQUIERDA') {
          s.stableCount++;
          setLivenessStableCount(s.stableCount);
        } else {
          s.stableCount = 0;
          setLivenessStableCount(0);
        }
        if (s.stableCount >= 5) {
          s.stableCount = 0;
          setLivenessStableCount(0);
          setPhase('step-done');
          const descriptor = await captureStepDescriptor();
          if (descriptor && onStepDescriptor) {
            onStepDescriptor({ descriptor, direction: 'IZQUIERDA' });
          }
          s.stepTimer = setTimeout(() => {
            s.step = 2;
            setLivenessStep(2);
            livenessRef.current.timer = setTimeout(livenessTick, 300);
          }, 600);
          return;
        }
      } else if (s.step === 2) {
        setPhase('liveness-right');
        setLivenessStep(2);
        if (direction === 'DERECHA') {
          s.stableCount++;
          setLivenessStableCount(s.stableCount);
        } else {
          s.stableCount = 0;
          setLivenessStableCount(0);
        }
        if (s.stableCount >= 5) {
          s.stableCount = 0;
          setLivenessStableCount(0);
          setPhase('step-done');
          const descriptor = await captureStepDescriptor();
          if (descriptor && onStepDescriptor) {
            onStepDescriptor({ descriptor, direction: 'DERECHA' });
          }
          s.stepTimer = setTimeout(() => {
            s.running = false;
            setLivenessPassed(true);
            setPhase('idle');
            setLivenessStep(0);
            if (onLivenessPass) onLivenessPass();
          }, 600);
          return;
        }
      }
    }

    if (onDetection) {
      onDetection({ detection, direction, blinkDetected: false });
    }

    livenessRef.current.timer = setTimeout(livenessTick, 300);
  };

  const handleStartCamera = async () => {
    setCameraError(null);
    setStarting(true);
      try {
        await startCamera(videoRef.current);
        setCameraOn(true);
        livenessRef.current = { running: true, step: 0, stableCount: 0, timer: null, stepTimer: null };
        livenessRef.current.timer = setTimeout(livenessTick, 300);
      } catch (err) {
      let msg;
      switch (err.name) {
        case 'NotAllowedError':
          msg = 'Permiso de cámara denegado.\n\nAbre la configuración del navegador y permite el acceso a la cámara para este sitio.';
          break;
        case 'NotFoundError':
          msg = 'No se detectó ninguna cámara.\n\nConecta una cámara y recarga la página.';
          break;
        case 'NotReadableError':
          msg = 'La cámara está siendo usada por otra aplicación.\n\nCierra otras apps (Zoom, Teams, etc.) e intenta de nuevo.';
          break;
        default:
          msg = `Error inesperado: ${err.message || 'desconocido'}\n\nRecarga la página e intenta de nuevo.`;
      }
      setCameraError(msg);
    } finally {
      setStarting(false);
    }
  };

  const handleStopCamera = () => {
    stopLiveness();
    stopCamera(videoRef.current);
    setCameraOn(false);
    setPhase('idle');
    setLivenessPassed(false);
    setLivenessStep(0);
    setLivenessStableCount(0);
  };

  const handleStartLiveness = () => {
    if (!cameraOn) return;

    if (disabledLiveness) {
      setLivenessPassed(true);
      if (onLivenessPass) onLivenessPass();
      return;
    }

    livenessRef.current.step = 0;
    livenessRef.current.stableCount = 0;
    setLivenessStep(0);
    setLivenessStableCount(0);
    setPhase('liveness-front');
  };

  const renderOverlay = () => {
    if (!cameraOn) return null;

    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        {phase === 'no-face' && (
          <>
            <div className="w-[120px] h-[160px] animate-pulse opacity-80">
              <HeadSilhouette />
            </div>
            <span className="mt-4 px-5 py-2 rounded-full bg-black/60 text-white text-sm font-bold backdrop-blur-sm">
              Enfoca tu rostro
            </span>
          </>
        )}

        {phase === 'liveness-front' && (
          <>
            <div className="w-[120px] h-[160px] animate-pulse opacity-90">
              <HeadSilhouette />
            </div>
            <span className="mt-4 px-5 py-2 rounded-full bg-black/60 text-medi-300 text-sm font-bold backdrop-blur-sm">
              Mirar al frente
            </span>
          </>
        )}

        {phase === 'liveness-left' && (
          <>
            <div className="w-[120px] h-[160px] animate-pulse opacity-90">
              <ArrowLeft />
            </div>
            <span className="mt-4 px-5 py-2 rounded-full bg-black/60 text-medi-300 text-sm font-bold backdrop-blur-sm">
              Gira a la izquierda
            </span>
          </>
        )}

        {phase === 'liveness-right' && (
          <>
            <div className="w-[120px] h-[160px] animate-pulse opacity-90">
              <ArrowRight />
            </div>
            <span className="mt-4 px-5 py-2 rounded-full bg-black/60 text-medi-300 text-sm font-bold backdrop-blur-sm">
              Gira a la derecha
            </span>
          </>
        )}

        {phase === 'step-done' && (
          <div className="w-[120px] h-[160px]">
            <CheckIcon />
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const stream = videoRef.current?.srcObject;
    return () => {
      stopLiveness();
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  if (modelsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-900 rounded-2xl">
        <div className="w-10 h-10 border-3 border-medi-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-400 text-sm font-medium">Cargando modelos faciales...</p>
      </div>
    );
  }

  if (modelError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
        <p className="text-red-400 text-sm font-medium text-center whitespace-pre-line">{modelError}</p>
      </div>
    );
  }

  const borderColor =
    phase === 'no-face'
      ? 'border-red-400'
      : livenessPassed
      ? 'border-emerald-400'
      : 'border-gray-600';

  const statusDot =
    phase === 'no-face'
      ? 'bg-red-400'
      : livenessPassed
      ? 'bg-emerald-400'
      : cameraOn
      ? 'bg-medi-400'
      : 'bg-gray-500';

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border-3 ${borderColor} transition-colors duration-300 bg-black`}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width={640}
          height={480}
          className={`absolute inset-0 w-full h-full object-cover mirror ${!cameraOn ? 'hidden' : ''}`}
        />

        {renderOverlay()}

        {cameraOn && phase === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`w-3/5 h-4/5 rounded-[50%] border-2 transition-colors duration-300 ${
                faceDetected
                  ? 'border-medi-400/60 shadow-[0_0_30px_rgba(184,202,118,0.3)]'
                  : 'border-white/20'
              }`}
            />
          </div>
        )}

        {cameraOn && phase.startsWith('liveness') && (
          <BorderProgress progress={livenessStableCount / 5} />
        )}

        {!cameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
              />
            </svg>
            {cameraError ? (
              <>
                <p className="text-red-400 text-sm font-medium text-center whitespace-pre-line px-4">
                  {cameraError}
                </p>
                <button
                  onClick={handleStartCamera}
                  disabled={starting}
                  className="px-6 py-2.5 rounded-xl bg-medi-500 hover:bg-medi-600 text-white font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {starting ? 'Iniciando...' : 'Reintentar'}
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-sm font-medium">
                  Activa la cámara para continuar
                </p>
                <button
                  onClick={handleStartCamera}
                  disabled={starting}
                  className="px-6 py-2.5 rounded-xl bg-medi-500 hover:bg-medi-600 text-white font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {starting ? 'Iniciando...' : 'Iniciar cámara'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {cameraOn && !livenessPassed && !disabledLiveness && (
        <div className="flex items-center gap-2 w-full max-w-sm">
          {['Frontal', 'Izquierda', 'Derecha'].map((label, idx) => {
            const isCurrent = livenessStep === idx && phase.startsWith('liveness');
            const isDone = idx < livenessStep || livenessPassed;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full h-1.5 rounded-full transition-all ${
                    isDone
                      ? 'bg-emerald-400'
                      : isCurrent
                      ? 'bg-medi-400 animate-pulse'
                      : 'bg-white/10'
                  }`}
                />
                <span className={`text-[10px] font-medium ${
                  isDone
                    ? 'text-emerald-400'
                    : isCurrent
                    ? 'text-medi-300'
                    : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${statusDot}`} />
            <span className="text-gray-400">
              {cameraOn
                ? phase === 'no-face'
                  ? 'Enfoca tu rostro'
                  : phase === 'liveness-front'
                  ? 'Mirar al frente'
                  : phase === 'liveness-left'
                  ? 'Gira a la izquierda'
                  : phase === 'liveness-right'
                  ? 'Gira a la derecha'
                  : phase === 'step-done'
                  ? 'Validado ✓'
                  : livenessPassed
                  ? 'Identidad validada'
                  : 'Rostro detectado'
                : 'Cámara apagada'}
            </span>
          </div>
        </div>
      </div>

      {cameraOn && (
        <div className="flex gap-2">
          <button
            onClick={handleStopCamera}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm transition-colors"
          >
            Detener
          </button>
          <button
            onClick={handleStartLiveness}
            disabled={livenessPassed || phase.startsWith('liveness')}
            className="px-4 py-2 rounded-xl bg-medi-500 hover:bg-medi-600 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Validar identidad
          </button>
        </div>
      )}
    </div>
  );
});

export default FaceCapture;
