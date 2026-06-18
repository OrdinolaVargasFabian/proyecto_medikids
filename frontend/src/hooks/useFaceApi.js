import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';

export function useFaceApi() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const streamRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadModels() {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

        if (!cancelled) {
          setModelsLoaded(true);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Error al cargar modelos faciales: ' + err.message);
          setLoading(false);
        }
      }
    }

    loadModels();
    return () => { cancelled = true; };
  }, []);

  const startCamera = useCallback(async (videoElement) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      streamRef.current = stream;
      setCameraOn(true);
    } catch (err) {
      if (err.name === 'OverconstrainedError' || err.name === 'NotFoundError') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        streamRef.current = stream;
        setCameraOn(true);
      } else {
        throw err;
      }
    }
  }, []);

  const stopCamera = useCallback((videoElement) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoElement) {
      videoElement.srcObject = null;
    }
    setCameraOn(false);
  }, []);

  return {
    modelsLoaded,
    loading,
    error,
    cameraOn,
    startCamera,
    stopCamera,
  };
}
