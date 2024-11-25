import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useLocationStore = create(
  persist(
    (set, get) => ({
      locations: [],

      addLocation: (location) => {
        const newLocation = {
          id: Math.max(0, ...get().locations.map(l => l.id), 0) + 1,
          ...location,
          createdAt: new Date().toISOString()
        }
        set(state => ({ 
          locations: [...state.locations, newLocation]
        }))
        return newLocation
      },

      updateLocation: (id, updatedLocation) => {
        set(state => ({
          locations: state.locations.map(location => 
            location.id === id 
              ? { ...location, ...updatedLocation }
              : location
          )
        }))
      },

      deleteLocation: (id) => {
        set(state => ({
          locations: state.locations.filter(location => location.id !== id)
        }))
      },

      getLocation: (id) => get().locations.find(location => location.id === id),
      getAllLocations: () => get().locations,
    }),
    {
      name: 'location-storage',
      version: 1,
    }
  )
)

export default useLocationStore
