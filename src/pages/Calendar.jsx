import { useState } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth
} from 'date-fns'
import useShiftStore from '../store/shiftStore'
import useAuthStore from '../store/authStore'
import { 
  PlusIcon, 
  DocumentDuplicateIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import ShiftModal from '../components/ShiftModal'
import { toast } from 'react-toastify'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedShift, setSelectedShift] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false)
  
  const shifts = useShiftStore(state => state.shifts)
  const user = useAuthStore(state => state.user)
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  const getShiftsForDay = (day) => {
    return shifts.filter(shift => isSameDay(new Date(shift.date), day))
  }

  const handleAddShift = (date) => {
    setSelectedDate(format(date, 'yyyy-MM-dd'))
    setSelectedShift(null)
    setIsDuplicating(false)
    setIsModalOpen(true)
  }

  const handleDuplicateShift = (shift) => {
    setSelectedShift(shift)
    setIsDuplicating(true)
    setIsModalOpen(true)
  }

  const canManageShifts = ['super_admin', 'admin'].includes(user.role)

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  // Generate months for quick navigation
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), i, 1)
    return {
      date,
      name: format(date, 'MMMM')
    }
  })

  return (
    <div className="h-full">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="relative">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            Calendar
          </h1>
          <div className="mt-2 flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
              className="text-lg font-medium text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              {format(currentDate, 'MMMM yyyy')}
              <CalendarIcon className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={goToToday}
              className="ml-2 px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              Today
            </button>
          </div>

          {/* Month Quick Selector */}
          {isMonthSelectorOpen && (
            <div className="absolute z-10 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-1 p-2">
                {months.map(({ date, name }) => (
                  <button
                    key={name}
                    onClick={() => {
                      setCurrentDate(date)
                      setIsMonthSelectorOpen(false)
                    }}
                    className={`px-2 py-1 rounded-md text-sm ${
                      isSameMonth(date, currentDate)
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col">
        <div className="grid grid-cols-7 gap-px sm:gap-2 text-center text-xs leading-6 text-gray-500 dark:text-gray-400">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 sm:p-3 font-semibold">
              <span className="sm:hidden">{day.charAt(0)}</span>
              <span className="hidden sm:inline">{day}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px sm:gap-2 mt-2 text-sm">
          {days.map((day) => {
            const dayShifts = getShiftsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            
            return (
              <div
                key={day.toString()}
                className={`min-h-[80px] sm:min-h-[120px] relative bg-white dark:bg-gray-800 rounded-lg 
                  ${!isCurrentMonth ? 'bg-opacity-50 dark:bg-opacity-50' : ''}
                  ${isToday(day) ? 'border-2 border-blue-500 dark:border-blue-400' : 'border border-gray-200 dark:border-gray-700'}
                `}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start p-1 sm:p-2">
                    <span className={`
                      text-sm sm:text-base font-medium
                      ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : ''}
                      ${isToday(day) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}
                    `}>
                      {format(day, 'd')}
                    </span>
                    {canManageShifts && isCurrentMonth && (
                      <button
                        onClick={() => handleAddShift(day)}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 p-1 space-y-1 overflow-y-auto max-h-24 sm:max-h-32">
                    {dayShifts.map((shift, index) => (
                      <div
                        key={index}
                        className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded px-1.5 py-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate">{shift.employeeName}</span>
                          {canManageShifts && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDuplicateShift(shift)
                              }}
                              className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                            >
                              <DocumentDuplicateIcon className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <div className="text-xs opacity-75">
                          {shift.startTime}-{shift.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ShiftModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
        duplicateShift={isDuplicating ? selectedShift : null}
      />
    </div>
  )
}
