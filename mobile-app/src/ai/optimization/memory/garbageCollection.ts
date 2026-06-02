class GarbageCollection {
  private hintCount = 0;

  hint(): void {
    this.hintCount++;
  }

  reset(): void {
    this.hintCount = 0;
  }
}

export const garbageCollection = new GarbageCollection();
