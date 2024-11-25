import { useState } from 'react'
import useShiftStore from '../store/shiftStore'
import useAuthStore from '../store/authStore'
import ShiftModal from '../components/ShiftModal'
import ConfirmShiftModal from '../components/ConfirmShiftModal'
import { PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

export default function Shifts() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null)
  const user = useAuthStore(state => state.user)
  const { shifts, deleteShift, getEmployeeShifts } = useShiftStore()

  const displayShifts = user.role === 'employee' 
    ? getEmployeeShifts(user.id)
    : shifts

  const handleEdit = (shift) => {
    setSelectedShift(shift)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this shift?')) {
      deleteShift(id)
      toast.success('Shift deleted successfully')
    }
  }

  const handleConfirm = (shift) => {
    setSelectedShift(shift)
    setIsConfirmModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedShift(null)
  }

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false)
    setSelectedShift(null)
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Shifts</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {user.role === 'admin' 
              ? 'Manage all employee shifts and schedules'
              : 'View and manage your shifts'}
          </p>
        </div>
        {user.role === 'admin' && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              Add shift
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Employee
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Time
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayShifts.map((shift) => (
                  <tr key={shift.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">
                      {shift.employeeName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {shift.date}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {shift.startTime} - {shift.endTime}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold
                        ${shift.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                          shift.status === 'delayed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>
                        {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {user.role === 'admin' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(shift)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(shift.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        !shift.confirmed && (
                          <button
                            onClick={() => handleConfirm(shift)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {user.role === 'admin' && (
        <ShiftModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          editShift={selectedShift}
        />
      )}

      {user.role === 'employee' && (
        <ConfirmShiftModal
          isOpen={isConfirmModalOpen}
          onClose={closeConfirmModal}
          shift={selectedShift}
        />
      )}
    </div>
  )
}
