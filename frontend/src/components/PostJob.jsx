import React, { useState } from 'react'
import useAuthStore from '../utils/useAuthStore'

const PostJob = () => {
  // Define state for each form input
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [salary, setSalary] = useState('')
  const [experience, setExperience] = useState('Entry')
  const [location, setLocation] = useState('')
  const { token } = useAuthStore()

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create a job listing object
    const jobData = {
      title,
      company,
      salary,
      experience,
      location,
    }

    try {
      const response = await fetch('http://localhost:5000/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Corrected template literal syntax
        },
        body: JSON.stringify(jobData), // Send job data as JSON in the request body
      })

      if (response.ok) {
        alert('Job listing created successfully!')
        // Reset the form
        setTitle('')
        setCompany('')
        setSalary('')
        setExperience('Entry')
        setLocation('')
      } else {
        alert('Failed to create job listing')
      }
    } catch (error) {
      console.error('Error creating job listing:', error)
      alert('There was an error submitting the form')
    }
  }

  return (
    <div className='p-8 max-w-xl mx-auto mt-6 bg-white shadow-lg rounded-lg'>
      <h2 className='text-3xl font-semibold text-center mb-6'>
        Create Job Listing
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Job Title */}
        <div className='mb-4'>
          <label
            htmlFor='title'
            className='block text-lg font-medium mb-2'
          >
            Job Title
          </label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-lg'
            required
          />
        </div>

        {/* Company */}
        <div className='mb-4'>
          <label
            htmlFor='company'
            className='block text-lg font-medium mb-2'
          >
            Company
          </label>
          <input
            type='text'
            id='company'
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-lg'
            required
          />
        </div>

        {/* Salary */}
        <div className='mb-4'>
          <label
            htmlFor='salary'
            className='block text-lg font-medium mb-2'
          >
            Salary
          </label>
          <input
            type='text'
            id='salary'
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-lg'
            required
          />
        </div>

        {/* Experience */}
        <div className='mb-4'>
          <label
            htmlFor='experience'
            className='block text-lg font-medium mb-2'
          >
            Experience Level
          </label>
          <select
            id='experience'
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-lg'
            required
          >
            <option value='Entry'>Entry</option>
            <option value='Mid'>Mid</option>
            <option value='Senior'>Senior</option>
          </select>
        </div>

        {/* Location */}
        <div className='mb-4'>
          <label
            htmlFor='location'
            className='block text-lg font-medium mb-2'
          >
            Location
          </label>
          <input
            type='text'
            id='location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-lg'
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all'
        >
          Create Job Listing
        </button>
      </form>
    </div>
  )
}

export default PostJob
