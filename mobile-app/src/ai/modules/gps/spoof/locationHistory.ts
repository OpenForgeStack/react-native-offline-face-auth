import type { LocationResult } from '../types/gps.types';

class LocationHistory {
  private history: LocationResult[] = [];
  private maxEntries = 10;

  push(location: LocationResult): void {
    this.history.push(location);
    if (this.history.length > this.maxEntries) {
      this.history.shift();
    }
  }

  getLast(): LocationResult | undefined {
    return this.history[this.history.length - 1];
  }

  getAll(): LocationResult[] {
    return [...this.history];
  }

  clear(): void {
    this.history = [];
  }
}

export const locationHistory = new LocationHistory();
