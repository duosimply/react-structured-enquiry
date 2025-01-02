import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../utils/useAuthStore'

const SearchFilters = () => {
  const [salaryRange, setSalaryRange] = useState('')
  const [location, setLocation] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [jobResults, setJobResults] = useState([]) // State to store job results
  const [possibleLocation, setPossibleLocation] = useState([])
  const token = useAuthStore((state) => state.token);

  const navigate = useNavigate()
  const handleApply = (jobId) => {
    // Navigate to the ApplyJob page with the job ID
    navigate(`/apply/${jobId}`)
  }

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:5000/locations', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        setPossibleLocation(data) // Update state with fetched locations
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }

    fetchLocations() // Call the function to fetch locations
  }, [])

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/jobs?location=${location}&salary=${encodeURIComponent(
          salaryRange
        )}&experienceLevel=${experienceLevel}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          // body: JSON.stringify({ salaryRange, location, experienceLevel }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setJobResults(data) // Assuming the response contains a "jobs" array
      } else {
        console.error('Failed to fetch jobs')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className='p-4 bg-gray-100 rounded-md'>
      <h2 className='text-xl font-semibold mb-4'>Search Filters</h2>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {/* Salary Range Dropdown */}
        <div>
          <label
            htmlFor='salary'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Salary Range
          </label>
          <select
            id='salary'
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>Select Salary Range</option>
            <option value='1'>$0-$50k</option>
            <option value='2'>$50k-$100k</option>
            <option value='3'>$100k+</option>
          </select>
        </div>

        {/* Location Dropdown */}
        <div>
          <label
            htmlFor='location'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Location
          </label>
          <select
            id='location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>Select Location</option>
            {possibleLocation.map((loc) => (
              <option value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Experience Level Dropdown */}
        <div>
          <label
            htmlFor='experience'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Experience Level
          </label>
          <select
            id='experience'
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>Select Experience Level</option>
            <option value='Entry'>Entry</option>
            <option value='Mid'>Mid</option>
            <option value='Senior'>Senior</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className='mt-4'>
        <button
          onClick={handleSearch}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Search
        </button>
      </div>

      {/* Job Results */}
      <div className='mt-6'>
        <h3 className='text-lg font-semibold mb-4'>Available Jobs</h3>
        {jobResults.length > 0 ? (
          <ul className='space-y-4'>
            {jobResults.map((job, index) => (
             <li key={index} className="p-4 border border-gray-300 rounded-md flex justify-between items-center">
             <div>
               <h4 className="font-medium text-blue-600">{job.title}</h4>
               <p className="text-sm text-gray-700">{job.company}</p>
               <p className="text-sm text-gray-500">{job.location}</p>
             </div>
             <button
               onClick={() => handleApply(job.id)}
               className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
             >
               Apply
             </button>
           </li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-500'>No jobs found matching the criteria.</p>
        )}
      </div>
    </div>
  )
}

export default SearchFilters
