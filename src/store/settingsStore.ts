import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Define the item type for our settings
export interface SettingsItem {
  id: string
  name: string
  url: string
}

interface SettingsState {
  items: SettingsItem[]
  addItem: (item: Omit<SettingsItem, 'id'>) => void
  updateItem: (id: string, item: Omit<SettingsItem, 'id'>) => void
  deleteItem: (id: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      items: [
        { id: '1', name: 'OpenAI', url: 'https://api.openai.com' },
        { id: '2', name: 'Anthropic', url: 'https://api.anthropic.com' },
        { id: '3', name: 'Cohere', url: 'https://api.cohere.ai' },
      ],
      
      addItem: (item) => set((state) => ({
        items: [...state.items, { ...item, id: Date.now().toString() }]
      })),
      
      updateItem: (id, updatedItem) => set((state) => ({
        items: state.items.map((item) => 
          item.id === id ? { ...item, ...updatedItem } : item
        )
      })),
      
      deleteItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
    }),
    {
      name: 'api-settings-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the items
      partialize: (state) => ({ items: state.items }),
    }
  )
)
