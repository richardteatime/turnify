import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialUsers = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'super_admin',
    locationIds: []
  },
  {
    id: 2,
    name: 'Manager',
    email: 'manager@example.com',
    password: 'manager123',
    role: 'admin',
    locationIds: []
  },
  {
    id: 3,
    name: 'Employee One',
    email: 'employee@example.com',
    password: 'employee123',
    role: 'employee',
    locationIds: []
  }
]

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: initialUsers,
      isAuthenticated: false,

      login: (email, password) => {
        const user = get().users.find(u => 
          u.email.toLowerCase() === email.toLowerCase() && 
          u.password === password
        )
        
        if (!user) {
          throw new Error('Invalid credentials')
        }
        
        const userData = { ...user }
        delete userData.password
        
        set({ 
          user: userData, 
          isAuthenticated: true
        })
        
        return userData
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false
        })
      },

      createUser: (userData) => {
        const { users, user: currentUser } = get()
        
        if (!currentUser || !['super_admin', 'admin'].includes(currentUser.role)) {
          throw new Error('Unauthorized')
        }

        if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
          throw new Error('Email already exists')
        }

        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...userData,
          locationIds: userData.locationIds || []
        }

        set({ users: [...users, newUser] })
        return { ...newUser, password: undefined }
      },

      getUsers: () => {
        const { users, user: currentUser } = get()
        if (!currentUser) return []
        
        if (currentUser.role === 'super_admin') {
          return users.filter(u => u.id !== currentUser.id)
        }
        if (currentUser.role === 'admin') {
          return users.filter(u => 
            u.role === 'employee' && 
            u.locationIds.some(id => currentUser.locationIds.includes(id))
          )
        }
        return []
      },

      getUsersByLocation: (locationId) => {
        return get().users.filter(user => 
          user.locationIds?.includes(locationId) ||
          user.role === 'super_admin'
        )
      },

      getEmployees: () => get().users.filter(u => u.role === 'employee'),
      getAdmins: () => get().users.filter(u => ['admin', 'super_admin'].includes(u.role))
    }),
    {
      name: 'auth-storage',
      version: 1,
      partialize: (state) => ({
        user: state.user,
        users: state.users,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useAuthStore
