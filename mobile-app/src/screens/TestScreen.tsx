import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView } from '../components/CameraView';
import { useDetection } from '../hooks/useDetection';
import { colors } from '../theme/colors';

type CameraSide = 'front' | 'back';

export function TestScreen() {
  const [cameraSide, setCameraSide] = useState<CameraSide>('front');
  const [engineReady, setEngineReady] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const { state, processFrame, setError } = useDetection();

  const handleInitEngine = async () => {
    setInitializing(true);
    try {
      const { FaceAuthSDK: FaceAuthSDKClass } = require('../ai/sdk/FaceAuthSDK') as typeof import('../ai/sdk/FaceAuthSDK');
      const sdk = new FaceAuthSDKClass();
      await sdk.initialize({
        modelBasePath: 'src/ai/models/',
        embeddingDimension: 128,
        livenessTimeout: 10000,
        authThreshold: 0.6,
        enableBenchmarking: false,
      });
      setEngineReady(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setInitializing(false);
    }
  };

  const handleFrame = (pixels: Float32Array, width: number, height: number) => {
    processFrame(pixels, width, height);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Face Auth SDK Test</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[
              styles.engineBtn,
              engineReady ? styles.engineReady : styles.engineInit,
            ]}
            onPress={handleInitEngine}
            disabled={initializing || engineReady}
          >
            <Text style={styles.engineBtnText}>
              {initializing ? '...' : engineReady ? 'READY' : 'INIT'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView detectionState={state} onFrame={handleFrame} cameraSide={cameraSide} />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.flipBtn}
          onPress={() => setCameraSide((s) => (s === 'front' ? 'back' : 'front'))}
        >
          <Text style={styles.flipBtnText}>
            Switch to {cameraSide === 'front' ? 'Back' : 'Front'} Camera
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  engineBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  engineInit: {
    backgroundColor: colors.warning,
  },
  engineReady: {
    backgroundColor: colors.primaryDim,
  },
  engineBtnText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  cameraContainer: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingBottom: 16,
    backgroundColor: colors.surface,
  },
  flipBtn: {
    backgroundColor: colors.primaryDim,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  flipBtnText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
});
