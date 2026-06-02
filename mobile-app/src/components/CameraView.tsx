import React, { useCallback, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { runOnJS } from 'react-native-worklets-core';
import type { Frame } from 'react-native-vision-camera';
import { colors } from '../theme/colors';
import { DetectionOverlay } from './DetectionOverlay';
import { StatusPanel } from './StatusPanel';
import type { DetectionState } from '../hooks/useDetection';

interface CameraViewProps {
  detectionState: DetectionState;
  onFrame: (pixels: Float32Array, width: number, height: number) => void;
  cameraSide?: 'front' | 'back';
}

export function CameraView({ detectionState, onFrame, cameraSide = 'front' }: CameraViewProps) {
  const cameraRef = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(cameraSide, {
    physicalDevices: ['wide-angle-camera'],
  });

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleFrame = useCallback(
    (pixels: Float32Array, width: number, height: number) => {
      onFrame(pixels, width, height);
    },
    [onFrame],
  );

  const frameProcessor = useFrameProcessor(
    (frame: Frame) => {
      'worklet';
      const buffer = frame.toArrayBuffer();
      const uint8 = new Uint8Array(buffer);
      const float32 = new Float32Array(uint8.length);
      for (let i = 0; i < uint8.length; i++) {
        float32[i] = uint8[i]! / 255;
      }
      runOnJS(handleFrame as unknown as (...args: unknown[]) => unknown)(
        float32,
        frame.width,
        frame.height,
      );
    },
    [handleFrame],
  );

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        pixelFormat="rgb"
        photo={false}
        video={false}
        audio={false}
      />
      <DetectionOverlay
        boundingBox={detectionState.boundingBox}
        landmarks={detectionState.landmarks}
        faceDetected={detectionState.faceDetected}
      />
      <StatusPanel detectionState={detectionState} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  permissionText: {
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: 12,
  },
});
