import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('employee') // Default to 'employee'
  const [company, setCompany] = useState('') // Add company state
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const body = { name, email, password, role }
      // Only include company if the role is employer
      if (role === 'employer') {
        body.company = company
      }
      console.log(body)
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Signup failed')
      }

      // Clear fields or show success message without redirecting or logging in
      alert('User registered successfully!')
      setName('')
      setEmail('')
      setPassword('')
      setRole('employee')
      setCompany('')
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='p-4 max-w-sm mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>Sign Up</h2>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <form onSubmit={handleSignup}>
        <div className='mb-4'>
          <input
            type='text'
            className='p-2 w-full border rounded-md'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <input
            type='email'
            className='p-2 w-full border rounded-md'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <input
            type='password'
            className='p-2 w-full border rounded-md'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <select
            className='p-2 w-full border rounded-md'
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value='employee'>Employee</option>
            <option value='employer'>Employer</option>
          </select>
        </div>

        {/* Show company input only when the role is 'employer' */}
        {role === 'employer' && (
          <div className='mb-4'>
            <input
              type='text'
              className='p-2 w-full border rounded-md'
              placeholder='Company'
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
        )}

        <button
          type='submit'
          className='p-2 w-full bg-blue-600 text-white rounded-md'
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default Signup
