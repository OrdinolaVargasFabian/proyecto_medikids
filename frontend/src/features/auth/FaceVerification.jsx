import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';
import { FaceCapture } from '../../components/FaceCapture';
import { verifyFace } from '../../services/api';

const REQUIRED_DESCRIPTORS = 3;

export function FaceVerification({ email, preAuthToken, onCancel }) {
  const navigate = useNavigate();
  const [capturedDescriptors, setCapturedDescriptors] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const verifyingRef = useRef(false);
  const hasTriggeredRef = useRef(false);

  const averageDescriptors = (descriptors) => {
    if (descriptors.length === 0) return null;
    const avg = new Array(128).fill(0);
    for (const desc of descriptors) {
      for (let i = 0; i < 128; i++) {
        avg[i] += desc[i] / descriptors.length;
      }
    }
    return avg;
  };

  const handleStepDescriptor = useCallback(({ descriptor }) => {
    if (!descriptor) return;
    const descArr = Array.from(descriptor);
    setCapturedDescriptors((prev) => {
      if (prev.length >= REQUIRED_DESCRIPTORS) return prev;
      return [...prev, descArr];
    });
  }, []);

  const handleLivenessPass = useCallback(() => {
    setStatus('liveness_done');
  }, []);

  useEffect(() => {
    if (status !== 'liveness_done') return;
    if (capturedDescriptors.length < REQUIRED_DESCRIPTORS) return;
    if (verifyingRef.current) return;
    if (hasTriggeredRef.current) return;

    hasTriggeredRef.current = true;
    verifyingRef.current = true;
    setStatus('verifying');

    const averaged = averageDescriptors(capturedDescriptors);

    (async () => {
      try {
        const res = await verifyFace({
          email,
          descriptor: averaged,
          preAuthToken,
        });

        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        setStatus('success');
        setTimeout(() => navigate('/admin/dashboard'), 800);
      } catch (err) {
        setStatus('error');
        setError(err.response?.data?.error || 'Verificación facial fallida. Intenta de nuevo.');
        verifyingRef.current = false;
        hasTriggeredRef.current = false;
        setCapturedDescriptors([]);
      }
    })();
  }, [status, capturedDescriptors, email, preAuthToken, navigate]);

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Shield className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">Identidad verificada</h3>
        <p className="text-gray-400 text-sm">Accediendo al panel...</p>
      </div>
    );
  }

  if (status === 'verifying') {
    return (
      <div className="text-center py-8">
        <div className="w-10 h-10 mx-auto mb-4 border-3 border-medi-400 border-t-transparent rounded-full animate-spin" />
        <h3 className="text-lg font-bold text-white mb-1">Verificando...</h3>
        <p className="text-gray-400 text-sm">Comparando con datos biométricos</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-medi-400 to-medi-600 flex items-center justify-center shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white">Verificación Biométrica</h3>
        <p className="text-gray-400 text-xs mt-1">
          Sigue las instrucciones de la cámara
        </p>
        <p className="text-medi-400 text-xs mt-2 font-medium">
          Captura {capturedDescriptors.length} de {REQUIRED_DESCRIPTORS}
        </p>
      </div>

      <FaceCapture
        onStepDescriptor={handleStepDescriptor}
        onLivenessPass={handleLivenessPass}
      />

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={status === 'verifying'}
          className="flex-1 py-2.5 rounded-xl bg-white/10 text-gray-300 text-sm font-bold hover:bg-white/20 disabled:opacity-40 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default FaceVerification;
