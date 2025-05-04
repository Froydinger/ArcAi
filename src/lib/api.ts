/**
 * Manages API keys stored locally.
 * NOTE: As of recent changes, only non-OpenAI keys might be managed here if needed in the future.
 * OpenAI key is hardcoded in `openai.ts`.
 * Google Search key/CSE ID are hardcoded in `googleSearch.ts`.
 */

interface ApiKeys {
  // openai?: string; // Removed - Hardcoded in openai.ts
  // googleSearch?: string; // Removed - Hardcoded in googleSearch.ts
  // Add other potential API keys here if needed in the future
  [key: string]: string | undefined; // Allow for future keys
}

class ApiKeyManager {
  private keys: ApiKeys = {};
  private listeners: Set<() => void> = new Set();
  private isInitialized: boolean = false;

  constructor() {
    // Initialization logic could potentially load other keys if added later
    // For now, it does nothing as OpenAI/Google keys are hardcoded elsewhere
    this.isInitialized = true;
  }

  // Method to explicitly set keys (e.g., if other keys are added later)
  setKeys(newKeys: Partial<ApiKeys>, initialLoad = false): void {
    let changed = false;
    for (const key in newKeys) {
      if (this.keys[key] !== newKeys[key]) {
        this.keys[key] = newKeys[key];
        changed = true;
      }
    }

    // Persist keys if needed (currently no keys are managed here)
    // if (changed && !initialLoad) {
    //   this.saveKeys();
    // }

    if (changed && !initialLoad) {
      this.notifyListeners();
    }
    if (!this.isInitialized) {
      this.isInitialized = true;
    }
  }

  getKeys(): Readonly<ApiKeys> {
    return this.keys;
  }

  // Specific key checks removed as they are hardcoded elsewhere
  // hasOpenAIKey(): boolean {
  //   return !!this.keys.openai;
  // }
  // hasGoogleSearchKey(): boolean {
  //   return !!this.keys.googleSearch;
  // }

  // Method to clear managed keys (currently does nothing unless other keys are added)
  clearKeys(): void {
    const changed = Object.keys(this.keys).length > 0;
    this.keys = {};
    // this.saveKeys(); // Persist the cleared state if needed
    if (changed) {
      this.notifyListeners();
    }
  }

  // --- Listener pattern for components that might need to react to key changes ---
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  // --- Persistence (Example - Adapt if keys managed here need saving) ---
  // private saveKeys(): void {
  //   try {
  //     // Example: Save only specific, managed keys to localStorage
  //     const keysToSave: Partial<ApiKeys> = { ...this.keys };
  //     // delete keysToSave.openai; // Don't save hardcoded keys
  //     // delete keysToSave.googleSearch;
  //     localStorage.setItem('api_keys', JSON.stringify(keysToSave));
  //   } catch (error) {
  //     console.error("Failed to save API keys:", error);
  //   }
  // }

  // private loadKeys(): void {
  //   try {
  //     const storedKeys = localStorage.getItem('api_keys');
  //     if (storedKeys) {
  //       const loaded = JSON.parse(storedKeys);
  //       // Only load keys that are meant to be managed here
  //       this.keys = { ...loaded }; // Adjust based on actual managed keys
  //     }
  //   } catch (error) {
  //     console.error("Failed to load API keys:", error);
  //   }
  // }
}

// Singleton instance
export const apiKeyManager = new ApiKeyManager();
