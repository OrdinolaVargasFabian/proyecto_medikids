import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import { FaceCapture } from '../../../components/FaceCapture';
import { enrollFace, crearAdmin } from '../../../services/api';

const REQUIRED_DESCRIPTORS = 3;

export const FaceRegistration = () => {
  const { usuarioId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData || null;
  const [capturedDescriptors, setCapturedDescriptors] = useState([]);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [createdUserId, setCreatedUserId] = useState(usuarioId ? Number(usuarioId) : null);
  const faceCaptureRef = useRef(null);

  const isComplete = capturedDescriptors.length >= REQUIRED_DESCRIPTORS;

  const handleStepDescriptor = useCallback(({ descriptor }) => {
    if (!descriptor) return;
    const descArr = Array.from(descriptor);
    setCapturedDescriptors((prev) => [...prev, descArr]);
    setToast({ message: '', type: '' });
  }, []);

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

  const handleSend = async () => {
    if (capturedDescriptors.length < REQUIRED_DESCRIPTORS) return;
    setSending(true);
    setToast({ message: '', type: '' });
    try {
      let idUsuario = createdUserId;

      if (!idUsuario && formData) {
        const result = await crearAdmin(formData);
        idUsuario = result.id_usuario;
        setCreatedUserId(idUsuario);
      }

      if (!idUsuario) {
        setToast({ message: 'Error: no se encontró el usuario', type: 'error' });
        setSending(false);
        return;
      }

      const averaged = averageDescriptors(capturedDescriptors);
      await enrollFace({
        idUsuario,
        descriptors: [{ tipo: 'PROMEDIO', descriptor: averaged }],
      });
      setToast({ message: formData ? 'Admin creado y biometría registrada correctamente' : 'Biometría registrada correctamente', type: 'success' });
      setTimeout(() => navigate('/admin/usuarios'), 1500);
    } catch (err) {
      setToast({
        message: err.response?.data?.error || err.response?.data?.message || 'Error al registrar',
        type: 'error',
      });
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setCapturedDescriptors([]);
    setToast({ message: '', type: '' });
  };

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/usuarios')}
            className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registrar Biometría Facial</h1>
            <p className="text-gray-500 text-sm font-medium">{formData ? 'Nuevo administrador' : `Usuario #${usuarioId}`}</p>
          </div>
        </div>

        {toast.message && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold ${
              toast.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-medi-50 text-medi-700 border border-medi-200'
            }`}
          >
            {toast.message}
          </div>
        )}

        {isComplete ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Captura completada</h2>
            <p className="text-gray-500 text-sm mb-6">
              Se capturaron {capturedDescriptors.length} descriptores faciales
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Repetir
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="px-5 py-2.5 rounded-xl bg-medi-500 text-white text-sm font-bold hover:bg-medi-600 disabled:opacity-50 transition-colors"
              >
                {sending ? 'Guardando...' : formData ? 'Crear y Guardar' : 'Guardar Biometría'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Validación de identidad</h3>
              <p className="text-gray-500 text-sm mt-1">
                Sigue las instrucciones de la cámara. El descriptor facial se captura automáticamente
                al completar cada acción de liveness.
              </p>
              <p className="text-medi-600 text-xs mt-2 font-medium">
                Captura {capturedDescriptors.length} de {REQUIRED_DESCRIPTORS}
              </p>
            </div>

            <FaceCapture
              ref={faceCaptureRef}
              onStepDescriptor={handleStepDescriptor}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FaceRegistration;
