import { useState } from 'react'
import useLocationStore from '../store/locationStore'
import useAuthStore from '../store/authStore'
import { PlusIcon } from '@heroicons/react/24/outline'
import LocationModal from '../components/LocationModal'

export default function Locations() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)
  const locations = useLocationStore(state => state.locations)
  const user = useAuthStore(state => state.user)
  const getUsersByLocation = useAuthStore(state => state.getUsersByLocation)

  const handleEdit = (location) => {
    setEditingLocation(location)
    setIsModalOpen(true)
  }

  const canManageLocations = user.role === 'super_admin'

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Locations</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage workplace locations and assigned staff
          </p>
        </div>
        {canManageLocations && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Location
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => {
          const locationUsers = getUsersByLocation(location.id)
          const employees = locationUsers.filter(u => u.role === 'employee')
          const managers = locationUsers.filter(u => u.role === 'admin')

          return (
            <div
              key={location.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {location.name}
                  </h3>
                  {canManageLocations && (
                    <button
                      onClick={() => handleEdit(location)}
                      className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {location.address}
                </p>
                <div className="mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex justify-between mb-2">
                      <span>Managers:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {managers.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Employees:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {employees.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Contact: </span>
                  <span className="text-gray-900 dark:text-white">{location.phone}</span>
                </div>
              </div>
            </div>
          )
        })}
        {locations.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No locations available. {canManageLocations && 'Click the "Add Location" button to create one.'}
            </p>
          </div>
        )}
      </div>

      <LocationModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingLocation(null)
        }}
        location={editingLocation}
      />
    </div>
  )
}
