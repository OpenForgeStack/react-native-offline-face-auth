interface DeviceProfile {
  platform: 'android' | 'ios';
  ramGB: number;
  cpuCores: number;
}

class DeviceProfiler {
  async profile(): Promise<DeviceProfile> {
    return {
      platform: 'android',
      ramGB: 4,
      cpuCores: 8,
    };
  }
}

export const deviceProfiler = new DeviceProfiler();
