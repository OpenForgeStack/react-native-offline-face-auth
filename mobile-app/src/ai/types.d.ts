declare module 'react-native-vision-camera' {
  export interface Frame {
    readonly isValid: boolean;
    readonly width: number;
    readonly height: number;
    readonly bytesPerRow: number;
    readonly planesCount: number;
    readonly isMirrored: boolean;
    readonly timestamp: number;
    readonly orientation: string;
    readonly pixelFormat: string;
    toArrayBuffer(): ArrayBuffer;
    toString(): string;
    getNativeBuffer(): { pointer: bigint; delete(): void };
  }

  export interface CameraDevice {
    position: 'front' | 'back' | 'external';
    name: string;
    hasFlash: boolean;
    hasTorch: boolean;
    minZoom: number;
    maxZoom: number;
    supportsDepthCapture: boolean;
    supportsFocus: boolean;
    hardwareLevel: string;
    sensors: Array<{ physicalSize: number; pixelSize: number }>;
  }

  export interface PhotoFile {
    path: string;
    width: number;
    height: number;
    isMirrored?: boolean;
  }

  export interface TakePhotoOptions {
    flash?: 'off' | 'on' | 'auto';
    enableAutoRedEyeReduction?: boolean;
  }

  export interface TakeSnapshotOptions {
    quality?: number;
  }

  export type CameraPermissionStatus = 'granted' | 'not-determined' | 'denied' | 'restricted';
  export type CameraPermissionRequestResult = 'granted' | 'denied';

  export interface CameraProps {
    style?: unknown;
    device: CameraDevice;
    isActive: boolean;
    frameProcessor?: (frame: Frame) => void;
    pixelFormat?: 'rgb' | 'yuv' | 'native';
    photo?: boolean;
    video?: boolean;
    audio?: boolean;
    enableZoomGesture?: boolean;
    torch?: 'off' | 'on';
    onInitialized?: () => void;
    onError?: (error: Error) => void;
  }

  export class Camera extends React.PureComponent<CameraProps> {
    takePhoto(options?: TakePhotoOptions): Promise<PhotoFile>;
    takeSnapshot(options?: TakeSnapshotOptions): Promise<PhotoFile>;
    focus(point: { x: number; y: number }): Promise<void>;
    static getCameraPermissionStatus(): CameraPermissionStatus;
    static requestCameraPermission(): Promise<CameraPermissionRequestResult>;
    static getMicrophonePermissionStatus(): CameraPermissionStatus;
    static requestMicrophonePermission(): Promise<CameraPermissionRequestResult>;
  }

  export function useCameraDevice(
    position: 'front' | 'back',
    options?: { physicalDevices?: string[] },
  ): CameraDevice | undefined;

  export function useCameraPermission(): {
    hasPermission: boolean;
    requestPermission: () => Promise<CameraPermissionRequestResult>;
  }

  export function useFrameProcessor(
    frameProcessor: (frame: Frame) => void,
    dependencies: unknown[],
  ): (frame: Frame) => void;

  export function runAsync(frame: Frame, func: () => void): void;
  export function runAtTargetFps(fps: number, func: () => void): void;
}

declare module 'react-native-fast-tflite' {
  export function loadTensorflowModel(
    source: number | { url: string },
    delegate?: string,
  ): Promise<{
    run: (input: Float32Array) => Float32Array;
    close: () => void;
    readonly name: string;
  }>;

  export function useTensorflowModel(
    source: number | { url: string },
    delegate?: string,
  ): {
    model?: { run: (input: Float32Array) => Float32Array; close: () => void };
    state: 'loading' | 'loaded' | 'error';
    error?: Error;
  };
}

declare module 'react-native-worklets-core' {
  export function runOnJS<T extends (...args: unknown[]) => unknown>(
    func: T,
  ): (...args: Parameters<T>) => void;
}

declare function runOnJS<T extends (...args: unknown[]) => unknown>(
  func: T,
): (...args: Parameters<T>) => void;

declare module 'react-native-sqlite-storage' {}
declare module 'react-native-geolocation-service' {}
declare module '@react-native-community/netinfo' {}
declare module 'react-native-reanimated' {}

declare const __DEV__: boolean;

declare function setImmediate(callback: (...args: unknown[]) => void, ...args: unknown[]): void;

declare var performance: {
  now(): number;
};

interface ImportMeta {
  url: string;
}

type RequireFunction = (module: string) => unknown;
declare var require: RequireFunction;

interface Process {
  memoryUsage?: () => { heapUsed: number };
}
declare var process: Process;

interface Console {
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  table: (...args: unknown[]) => void;
}
declare var console: Console;
