import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Define the provider type for our settings
export interface Provider {
  id: string
  name: string
  url: string
}

interface SettingsState {
  providers: Array<Provider>
  addProvider: (provider: Omit<Provider, 'id'>) => void
  updateProvider: (id: string, provider: Omit<Provider, 'id'>) => void
  deleteProvider: (id: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      providers: [
        { id: '1', name: 'OpenAI', url: 'https://api.openai.com' },
        { id: '2', name: 'Anthropic', url: 'https://api.anthropic.com' },
        { id: '3', name: 'Cohere', url: 'https://api.cohere.ai' },
      ],

      addProvider: (provider: Omit<Provider, 'id'>) =>
        set((state) => ({
          providers: [
            ...state.providers,
            { ...provider, id: Date.now().toString() },
          ],
        })),

      updateProvider: (id: string, updatedProvider: Omit<Provider, 'id'>) =>
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
      name: 'api-settings-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the providers
      partialize: (state) => ({ providers: state.providers }),
    },
  ),
)
