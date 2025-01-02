import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../utils/useAuthStore'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      const { token, role, company } = data // Assuming the response contains a 'role'

      // Save both token and role in Zustand store
      login({ token, role, company })

      if (role === 'employer') 
        navigate('/employerhome')
      else 
        navigate('/') // Redirect to the homepage
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='p-4 max-w-sm mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>Login</h2>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button
          type='submit'
          className='p-2 w-full bg-blue-600 text-white rounded-md'
        >
          Login
        </button>
      </form>
      <p className='text-center mt-4'>
        Don't have an account?{' '}
        <Link
          to='/signup'
          className='text-blue-600 underline'
        >
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default Login
