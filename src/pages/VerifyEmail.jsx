import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiFetch } from '../api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState('Verifying...')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setMessage('')
      setError('Missing verification token')
      return
    }

    apiFetch(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(() => {
        setMessage('Email verified! You can now log in.')
        setError('')
      })
      .catch((err) => {
        setError(err.message || 'Verification failed')
        setMessage('')
      })
  }, [searchParams])

  return (
    <div>
      <h2>Email Verification</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
