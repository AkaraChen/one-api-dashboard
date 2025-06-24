import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { nanoid } from 'nanoid'

// Define the provider type for our settings
export interface Provider {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  userId: string; // 必填的用户ID
  unit?: string; // 可选的货币单位，默认为 USD
}

interface SettingsState {
  providers: Array<Provider>;
  addProvider: (provider: Omit<Provider, "id">) => void;
  updateProvider: (id: string, provider: Omit<Provider, "id">) => void;
  deleteProvider: (id: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      providers: [],

      addProvider: (provider: Omit<Provider, "id">) =>
        set((state) => {
          // Generate a unique ID using timestamp + random string to avoid collisions
          const uniqueId = nanoid()
          
          return {
            providers: [
              ...state.providers,
              {
                ...provider,
                id: uniqueId,
                unit: provider.unit || "USD", // 如果没有提供 unit，默认设置为 USD
              },
            ],
          };
        }),

      updateProvider: (id: string, updatedProvider: Omit<Provider, "id">) =>
        set((state) => ({
          providers: state.providers.map((provider) =>
            provider.id === id ? { ...provider, ...updatedProvider } : provider,
          ),
        })),

      deleteProvider: (id: string) =>
        set((state) => ({
          providers: state.providers.filter((provider) => provider.id !== id),
        })),
    }),
    {
      name: "api-settings-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist the providers
      partialize: (state) => ({ providers: state.providers }),
    },
  ),
);
