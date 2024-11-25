import { Fragment } from 'react'
import { Link, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  UserPlusIcon,
  CalendarDaysIcon,
  HomeIcon,
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import ThemeToggle from './ThemeToggle'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'

function getNavigation(role) {
  const baseNav = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarDaysIcon },
  ]

  if (role === 'employee') {
    return [
      ...baseNav,
      { name: 'My Shifts', href: '/shifts', icon: ClockIcon },
    ]
  }

  return [
    ...baseNav,
    { name: 'Shifts', href: '/shifts', icon: ClockIcon },
    { name: 'Locations', href: '/locations', icon: BuildingOfficeIcon },
    ...(role === 'super_admin' ? [
      { name: 'Users', href: '/users', icon: UserPlusIcon },
    ] : []),
  ]
}

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const isDarkMode = useThemeStore(state => state.isDarkMode)
  const navigation = getNavigation(user?.role || 'employee')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Disclosure as="nav" className="bg-white dark:bg-gray-800 shadow-sm">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        Turnify
                      </span>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`inline-flex items-center px-1 pt-1 text-sm font-medium 
                            ${location.pathname === item.href
                              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                              : 'text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                        >
                          <item.icon className="h-5 w-5 mr-1" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    
                    <Menu as="div" className="relative ml-3">
                      <Menu.Button className="flex rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <div className="flex items-center">
                          <UserCircleIcon className="h-8 w-8 text-gray-400" />
                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                            {user.name}
                          </span>
                        </div>
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left`}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    <div className="flex items-center sm:hidden">
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      to={item.href}
                      className={`block py-2 pl-3 pr-4 text-base font-medium ${
                        location.pathname === item.href
                          ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-2" />
                        {item.name}
                      </div>
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div className="py-10">
          <main>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
