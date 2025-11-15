import React, { useEffect, useState } from 'react'
import { apiFetch } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [me, setMe] = useState(null)

  useEffect(() => {
    apiFetch('/auth/me')
      .then(setMe)
      .catch(() => {})
  }, [])

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Logged in as: <strong>{user?.email}</strong></p>
      <h3>/auth/me</h3>
      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  )
}
