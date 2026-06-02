import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface DetectionOverlayProps {
  boundingBox: { x: number; y: number; width: number; height: number } | null;
  landmarks: { x: number; y: number }[] | null;
  faceDetected: boolean;
}

export function DetectionOverlay({
  boundingBox,
  landmarks,
  faceDetected,
}: DetectionOverlayProps) {
  if (!faceDetected) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="none">
      {boundingBox && (
        <View
          style={[
            styles.boundingBox,
            {
              left: boundingBox.x,
              top: boundingBox.y,
              width: boundingBox.width,
              height: boundingBox.height,
            },
          ]}
        />
      )}
      {landmarks?.map((point, index) => (
        <View
          key={index}
          style={[
            styles.landmark,
            {
              left: point.x - 3,
              top: point.y - 3,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.boundingBox,
    borderRadius: 4,
  },
  landmark: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.landmark,
  },
});
