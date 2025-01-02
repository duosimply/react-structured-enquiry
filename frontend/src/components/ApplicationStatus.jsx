// src/components/ApplicationStatusAndUserId.js
import React, { useState } from 'react'
import useAuthStore from '../utils/useAuthStore'  // Adjust path to your Zustand store

const ApplicationStatus = () => {
  // State for application status and user ID retrieval
  const [userId, setUserId] = useState('')
  const [applicationStatus, setApplicationStatus] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [nameForId, setNameForId] = useState('')
  const [emailForId, setEmailForId] = useState('')
  const [retrievedUserId, setRetrievedUserId] = useState('')
  const [idMessage, setIdMessage] = useState('')

  // Get token from Zustand store
  const token = useAuthStore((state) => state.token)  // Assuming you store the token in Zustand

  // Fetch application status
  const fetchApplicationStatus = async () => {
    if (!userId) {
      setStatusMessage('Please enter a valid User ID.')
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/applications/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Include token for authenticated request
        }
      })
      if (response.ok) {
        const data = await response.json()
        setApplicationStatus(data)
        setStatusMessage('') // Clear previous message
      } else {
        setApplicationStatus([])
        setStatusMessage('No applications found for this User ID.')
      }
    } catch (error) {
      console.error('Error fetching application status:', error)
      setApplicationStatus([])
      setStatusMessage('Failed to fetch application status.')
    }
  }

  // Fetch User ID
  const fetchUserId = async () => {
    if (!nameForId || !emailForId) {
      setIdMessage('Please provide both name and email.')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/user-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include token for authenticated request
        },
        body: JSON.stringify({ name: nameForId, email: emailForId }),
      })

      const result = await response.json()
      if (response.ok && result.userId) {
        setRetrievedUserId(result.userId)
        setIdMessage('')
      } else {
        setRetrievedUserId('')
        setIdMessage('No user found with the provided details.')
      }
    } catch (error) {
      console.error('Error fetching user ID:', error)
      setRetrievedUserId('')
      setIdMessage('Failed to fetch user ID.')
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto mt-6 bg-white shadow-lg rounded-lg">
      {/* Application Status Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-10">
        <h3 className="text-2xl font-medium mb-4">Check Application Status</h3>

        {/* User ID Input */}
        <div className="mb-4">
          <label htmlFor="userId" className="block text-lg font-medium mb-2">
            User ID
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter your User ID"
          />
        </div>

        {/* Fetch Status Button */}
        <button
          onClick={fetchApplicationStatus}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
        >
          Check Status
        </button>

        {/* Status Message */}
        {statusMessage && <p className="mt-4 text-center text-gray-700">{statusMessage}</p>}

        {/* Display Application Status */}
        {applicationStatus.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xl font-medium mb-4">Your Applications:</h4>
            <ul className="space-y-4">
              {applicationStatus.map((application) => (
                <li key={application.id} className="border p-4 rounded-lg shadow-md">
                  <p>
                    <strong>Job Title:</strong> {application.title}
                  </p>
                  <p>
                    <strong>Company:</strong> {application.company}
                  </p>
                  <p>
                    <strong>Status:</strong> {application.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* User ID Retrieval Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-medium mb-4">Retrieve User ID</h3>

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="nameForId" className="block text-lg font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="nameForId"
            value={nameForId}
            onChange={(e) => setNameForId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="emailForId" className="block text-lg font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="emailForId"
            value={emailForId}
            onChange={(e) => setEmailForId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Fetch User ID Button */}
        <button
          onClick={fetchUserId}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
        >
          Retrieve User ID
        </button>

        {/* ID Message */}
        {idMessage && <p className="mt-4 text-center text-gray-700">{idMessage}</p>}

        {/* Display Retrieved User ID */}
        {retrievedUserId && (
          <p className="mt-4 text-center text-gray-700">
            Your User ID: <strong>{retrievedUserId}</strong>
          </p>
        )}
      </div>
    </div>
  )
}

export default ApplicationStatus
