import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { TestScreen } from './src/screens/TestScreen';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <TestScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
