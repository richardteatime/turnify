import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useShiftStore from '../store/shiftStore'
import { format } from 'date-fns'
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import ConfirmShiftModal from '../components/ConfirmShiftModal'

function StatCard({ icon: Icon, name, stat, description, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:px-6 
        ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors' : ''}`}
    >
      <dt>
        <div className={`absolute rounded-md ${color} p-3`}>
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
          {name}
        </p>
      </dt>
      <dd className="ml-16 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {stat}
        </p>
        <p className="ml-2 flex items-baseline text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </dd>
    </div>
  )
}

function AdminDashboard({ role }) {
  const navigate = useNavigate()
  const shifts = useShiftStore(state => state.shifts)
  const users = useAuthStore(state => state.users)
  const today = format(new Date(), 'yyyy-MM-dd')

  const todayShifts = shifts.filter(shift => shift.date === today)
  const activeEmployees = new Set(shifts.map(s => s.employeeId)).size
  const totalAdmins = users.filter(u => u.role === 'admin').length
  
  const stats = [
    { 
      name: 'Total Shifts', 
      stat: shifts.length,
      description: 'All scheduled shifts',
      icon: CalendarDaysIcon,
      color: 'bg-blue-500',
      onClick: () => navigate('/shifts')
    },
    { 
      name: 'Today\'s Shifts', 
      stat: todayShifts.length,
      description: 'Shifts for today',
      icon: ClockIcon,
      color: 'bg-green-500',
      onClick: () => navigate('/calendar')
    },
    { 
      name: 'Active Employees', 
      stat: activeEmployees,
      description: 'Employees with shifts',
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      onClick: role === 'super_admin' ? () => navigate('/users') : null
    }
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <StatCard key={item.name} {...item} />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Today's Activity
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {todayShifts.map((shift) => (
              <li 
                key={shift.id} 
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate('/shifts')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {shift.employeeName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {shift.startTime} - {shift.endTime}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${shift.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                        shift.status === 'delayed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>
                      {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
            {todayShifts.length === 0 && (
              <li className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                No shifts scheduled for today
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

function EmployeeDashboard({ user }) {
  const [selectedShift, setSelectedShift] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const navigate = useNavigate()
  const getEmployeeShifts = useShiftStore(state => state.getEmployeeShifts)
  const today = format(new Date(), 'yyyy-MM-dd')
  
  const myShifts = getEmployeeShifts(user.id)
  const todayShift = myShifts.find(shift => shift.date === today)
  const upcomingShifts = myShifts.filter(shift => shift.date > today)
  const pendingShifts = myShifts.filter(shift => !shift.confirmed)

  const handleConfirmShift = (shift) => {
    setSelectedShift(shift)
    setIsConfirmModalOpen(true)
  }

  const stats = [
    {
      name: 'Today\'s Shift',
      stat: todayShift ? `${todayShift.startTime} - ${todayShift.endTime}` : 'No shift today',
      description: todayShift && !todayShift.confirmed ? 'Needs confirmation' : '',
      icon: ClockIcon,
      color: 'bg-blue-500',
      onClick: todayShift && !todayShift.confirmed ? () => handleConfirmShift(todayShift) : null
    },
    {
      name: 'Pending Confirmations',
      stat: pendingShifts.length,
      description: 'Shifts to confirm',
      icon: ExclamationCircleIcon,
      color: 'bg-yellow-500',
      onClick: () => navigate('/shifts')
    },
    {
      name: 'Upcoming Shifts',
      stat: upcomingShifts.length,
      description: 'Future shifts',
      icon: CalendarDaysIcon,
      color: 'bg-green-500',
      onClick: () => navigate('/calendar')
    }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Welcome back, {user.name}
      </h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <StatCard key={item.name} {...item} />
        ))}
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Next Shifts
          </h3>
        </div>
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {upcomingShifts.slice(0, 5).map((shift) => (
            <li 
              key={shift.id} 
              className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => !shift.confirmed && handleConfirmShift(shift)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {shift.date}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {shift.startTime} - {shift.endTime}
                  </p>
                </div>
                {!shift.confirmed && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                    Needs Confirmation
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ConfirmShiftModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false)
          setSelectedShift(null)
        }}
        shift={selectedShift}
      />
    </div>
  )
}

export default function Dashboard() {
  const user = useAuthStore(state => state.user)
  
  if (user.role === 'employee') {
    return <EmployeeDashboard user={user} />
  }
  
  return <AdminDashboard role={user.role} />
}
