import React, { useState } from 'react'
import { apiFetch } from '../api'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      })
      setMessage('Registered! Check your email to verify your account.')
    } catch (err) {
      setError(err.message || 'Register failed')
    }
  }

  return (
    <div>
      <h2>Register</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Username</label><br />
          <input
            name="username"
            value={form.username}
            onChange={onChange}
          />
        </div>
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
        <button type="submit" style={{ marginTop: '0.5rem' }}>Sign up</button>
      </form>
    </div>
  )
}
