// src/App.js
import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import useAuthStore from './utils/useAuthStore'

// Import components
import SearchFilters from './components/SearchFilters'
import PostJob from './components/PostJob'
import JobApplicationForm from './components/JobApplicationForm'
import ApplicationStatus from './components/ApplicationStatus' // Status page without backend call
import Login from './components/Login'
import Signup from './components/Signup'
import PrivateRoute from './components/Private'
import EmployerHome from './components/EmployerHome'

function App() {
  const { token, logout, role } = useAuthStore() // Access role and token from Zustand store
  console.log(role)
  return (
    <Router>
      {/* Navbar */}
      <nav className='bg-blue-600 p-4 shadow-lg'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <Link
            to='/'
            className='text-2xl font-semibold text-white hover:text-gray-300 transition-all'
          >
            Job Finder
          </Link>
          <ul className='flex space-x-8'>
            {role === 'employer' ? (
              <li>
                <Link
                  to='/employerhome'
                  className='text-white hover:text-gray-300 font-medium text-lg transition-all'
                >
                  Home
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to='/'
                  className='text-white hover:text-gray-300 font-medium text-lg transition-all'
                >
                  Home
                </Link>
              </li>
            )}
            {role === 'employer' && (
              <li>
                <Link
                  to='/postjob'
                  className='text-white hover:text-gray-300 font-medium text-lg transition-all'
                >
                  Post Jobs
                </Link>
              </li>
            )}
            {role === 'employee' && (
              <li>
                <Link
                  to='/application-status'
                  className='text-white hover:text-gray-300 font-medium text-lg transition-all'
                >
                  Check Status
                </Link>
              </li>
            )}
            {token ? (
              <li>
                <button
                  onClick={() => logout()}
                  className='text-white hover:text-gray-300 font-medium text-lg transition-all'
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to='/login'
                  className='text-white hover:text-gray-300 font-medium text-lg transition-all'
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route
          path='/'
          element={<PrivateRoute element={<SearchFilters />} />}
        />
        <Route
          path='/employerhome'
          element={<PrivateRoute element={<EmployerHome />} />}
        />
        <Route
          path='/postjob'
          element={<PrivateRoute element={<PostJob />} />}
        />
        <Route
          path='/apply/:jobId'
          element={<PrivateRoute element={<JobApplicationForm />} />}
        />
        <Route
          path='/application-status'
          element={<PrivateRoute element={<ApplicationStatus />} />} // Redirect here for status
        />
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/signup'
          element={<Signup />}
        />
      </Routes>
    </Router>
  )
}

export default App
