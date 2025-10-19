"use client"

import { useSession, signOut,authClient } from "@/lib/better-auth/auth-client" // pastikan path sesuai lokasi file authClient kamu

export default function DashboardPage() {
  const { data: session, isPending: isLoading } = authClient.useSession();

  if (isLoading) {
    return <p>Loading session...</p>
  }

  if (!session) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">You are not logged in</h1>
        <p>Please log in to access this page.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <p>User ID: {session.user.id}</p>

      <button
        onClick={() => signOut()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  )
}
