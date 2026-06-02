import { tensorPool } from './tensorPooling';
import { cacheCleaner } from './cacheCleaner';
import { garbageCollection } from './garbageCollection';

class MemoryManager {
  async release(): Promise<void> {
    tensorPool.returnAll();
    cacheCleaner.run();
    garbageCollection.hint();
  }
}

export const memoryManager = new MemoryManager();
