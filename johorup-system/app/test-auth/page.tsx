'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function TestAuth() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>

  if (session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Authentication Test - SUCCESS!</h1>
        <p className="mb-2">Signed in as: {session.user?.email}</p>
        <p className="mb-2">Name: {session.user?.name}</p>
        <p className="mb-2">Role: {(session.user as any)?.role}</p>
        <p className="mb-4">User ID: {(session.user as any)?.user_id}</p>
        <button 
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      <p className="mb-4">Not signed in</p>
      <button 
        onClick={() => signIn('credentials')}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with Credentials
      </button>
    </div>
  )
}