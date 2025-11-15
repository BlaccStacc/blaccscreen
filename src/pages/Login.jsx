import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { signInWithToken } = useAuth()

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      })

      if (data.requires_2fa) {
        navigate('/login-2fa', {
          state: {
            tempToken: data.temp_token,
            email: form.email
          }
        })
        return
      }

      signInWithToken(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label><br />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
          />
        </div>
        <div>
          <label>Password</label><br />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
          />
        </div>
        <button type="submit" style={{ marginTop: '0.5rem' }}>Sign in</button>
      </form>
    </div>
  )
}
