import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useShiftStore = create(
  persist(
    (set, get) => ({
      shifts: [],
      loading: false,
      error: null,

      addShift: (shift) => set((state) => ({ 
        shifts: [...state.shifts, { 
          ...shift, 
          id: Date.now(),
          status: 'pending',
          confirmed: false,
          delay: null
        }] 
      })),

      updateShift: (id, updatedShift) => set((state) => ({
        shifts: state.shifts.map(shift => 
          shift.id === id ? { ...shift, ...updatedShift } : shift
        )
      })),

      deleteShift: (id) => set((state) => ({
        shifts: state.shifts.filter(shift => shift.id !== id)
      })),

      duplicateShift: (shift, newDate) => {
        const { id, status, confirmed, ...shiftData } = shift
        return get().addShift({
          ...shiftData,
          date: newDate || shift.date
        })
      },

      confirmShift: (id, delay = null) => set((state) => ({
        shifts: state.shifts.map(shift => 
          shift.id === id 
            ? { 
                ...shift, 
                confirmed: true, 
                status: delay ? 'delayed' : 'confirmed',
                delay 
              } 
            : shift
        )
      })),

      getEmployeeShifts: (employeeId) => {
        return get().shifts.filter(shift => shift.employeeId === employeeId)
      },

      setShifts: (shifts) => set({ shifts }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'shift-storage'
    }
  )
)

export default useShiftStore
