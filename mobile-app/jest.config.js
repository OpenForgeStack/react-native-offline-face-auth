module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/ai/tests/unit'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    'react-native-fast-tflite': '<rootDir>/src/ai/tests/unit/__mocks__/mockModels.ts',
    'react-native-vision-camera': '<rootDir>/src/ai/tests/unit/__mocks__/mockFrame.ts',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        target: 'es2020',
        module: 'commonjs',
        lib: ['es2020', 'dom'],
        types: ['jest'],
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        noUncheckedIndexedAccess: false,
        exactOptionalPropertyTypes: false,
      },
    }],
  },
};
