import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Login2FA() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signInWithToken } = useAuth()

  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const tempToken = location.state?.tempToken
  const email = location.state?.email

  if (!tempToken) {
    return <p>Missing 2FA token. Go back and login again.</p>
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await apiFetch('/auth/login/2fa', {
        method: 'POST',
        body: JSON.stringify({
          temp_token: tempToken,
          code
        })
      })

      signInWithToken(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || '2FA failed')
    }
  }

  return (
    <div>
      <h2>Two-Factor Authentication</h2>
      <p>Enter the 6-digit code from your authenticator app for <strong>{email}</strong>.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
        />
        <button type="submit" style={{ marginLeft: '0.5rem' }}>Verify</button>
      </form>
    </div>
  )
}
