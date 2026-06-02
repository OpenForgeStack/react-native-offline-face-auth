import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import type { DetectionState } from '../hooks/useDetection';

interface StatusPanelProps {
  detectionState: DetectionState;
}

function scoreColor(value: number): string {
  if (value >= 0.7) return colors.statusOk;
  if (value >= 0.4) return colors.statusWarn;
  return colors.statusFail;
}

export function StatusPanel({ detectionState }: StatusPanelProps) {
  const {
    faceDetected,
    ear,
    mar,
    livenessScore,
    recognitionScore,
    fps,
    faceCount,
    error,
  } = detectionState;

  return (
    <View style={styles.panel}>
      <View style={styles.row}>
        <StatusBadge label="FPS" value={String(fps)} color={colors.textPrimary} />
        <StatusBadge
          label="FACE"
          value={faceDetected ? `${faceCount} DETECTED` : 'NONE'}
          color={faceDetected ? colors.statusOk : colors.statusWarn}
        />
        <StatusBadge
          label="EAR"
          value={ear.toFixed(3)}
          color={scoreColor(ear > 0.21 ? 1 : 0)}
        />
        <StatusBadge
          label="MAR"
          value={mar.toFixed(3)}
          color={scoreColor(mar > 0.6 ? 1 : 0)}
        />
      </View>
      <View style={styles.row}>
        <StatusBadge
          label="LIVENESS"
          value={`${(livenessScore * 100).toFixed(0)}%`}
          color={scoreColor(livenessScore)}
        />
        <StatusBadge
          label="MATCH"
          value={`${(recognitionScore * 100).toFixed(0)}%`}
          color={scoreColor(recognitionScore)}
        />
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

function StatusBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={[styles.badgeValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 2,
  },
  badge: {
    alignItems: 'center',
    minWidth: 60,
  },
  badgeLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  badgeValue: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
