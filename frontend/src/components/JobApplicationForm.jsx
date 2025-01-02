// src/components/JobApplicationForm.js
import React, { useState } from 'react'
import useAuthStore from '../utils/useAuthStore'  // Adjust path to your Zustand store
import { useParams } from 'react-router-dom'

const JobApplicationForm = () => {
  // State for application form
  const [applicantName, setApplicantName] = useState('')
  const [applicantEmail, setApplicantEmail] = useState('')
  const [resume, setResume] = useState(null)
  const [message, setMessage] = useState('')
  const jobId = useParams()
  // Get token from Zustand store
  const { token }  = useAuthStore()  // Assuming you store the token in Zustand

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!applicantName || !applicantEmail || !resume) {
      setMessage('All fields are required.')
      return
    }

    const formData = new FormData()
    formData.append('jobId', jobId.jobId)
    formData.append('applicantName', applicantName)
    formData.append('applicantEmail', applicantEmail)
    formData.append('resume', resume)
    console.log(jobId)
    try {
      const response = await fetch('http://localhost:5000/applications', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,  // Include the token from Zustand
        }
      })

      const result = await response.json()
      if (response.ok) {
        setMessage(result.message || 'Application submitted successfully!')
        setApplicantName('')
        setApplicantEmail('')
        setResume(null)
      } else {
        setMessage(result.message || 'Failed to submit the application.')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      setMessage('An error occurred while submitting the application.')
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto mt-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Apply for Job</h2>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="mb-10">
        {/* Applicant Name */}
        <div className="mb-4">
          <label htmlFor="applicantName" className="block text-lg font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="applicantName"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Applicant Email */}
        <div className="mb-4">
          <label htmlFor="applicantEmail" className="block text-lg font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="applicantEmail"
            value={applicantEmail}
            onChange={(e) => setApplicantEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Resume Upload */}
        <div className="mb-4">
          <label htmlFor="resume" className="block text-lg font-medium mb-2">
            Resume
          </label>
          <input
            type="file"
            id="resume"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Submit Application
        </button>

        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </form>
    </div>
  )
}

export default JobApplicationForm
