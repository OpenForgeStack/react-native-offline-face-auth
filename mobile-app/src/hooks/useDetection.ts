import { useState, useCallback, useRef } from 'react';

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectionState {
  faceDetected: boolean;
  boundingBox: FaceBox | null;
  landmarks: { x: number; y: number }[] | null;
  ear: number;
  mar: number;
  livenessScore: number;
  recognitionScore: number;
  fps: number;
  faceCount: number;
  error: string | null;
}

const initialState: DetectionState = {
  faceDetected: false,
  boundingBox: null,
  landmarks: null,
  ear: 0,
  mar: 0,
  livenessScore: 0,
  recognitionScore: 0,
  fps: 0,
  faceCount: 0,
  error: null,
};

export function useDetection() {
  const [state, setState] = useState<DetectionState>(initialState);
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(Date.now());
  const fpsRef = useRef(0);

  const updateFps = useCallback(() => {
    frameCountRef.current += 1;
    const now = Date.now();
    const elapsed = now - lastFpsTimeRef.current;
    if (elapsed >= 1000) {
      fpsRef.current = Math.round((frameCountRef.current * 1000) / elapsed);
      frameCountRef.current = 0;
      lastFpsTimeRef.current = now;
    }
  }, []);

  const processFrame = useCallback(
    async (
      _pixels: Float32Array,
      _width: number,
      _height: number,
    ): Promise<void> => {
      updateFps();
      setState((prev) => ({
        ...prev,
        fps: fpsRef.current,
        error: null,
      }));
    },
    [updateFps],
  );

  const setError = useCallback((message: string) => {
    setState((prev) => ({ ...prev, error: message }));
  }, []);

  return { state, setState, processFrame, updateFps, setError };
}
