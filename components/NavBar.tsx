'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const router = useRouter()
  async function logout() {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    })

    if (!res.ok) return

    router.push('/bca')
  }

  return (
    <header className="mt-0 bg-indigo-700 text-indigo-200">
      <nav className="flex justify-between p-4">
        <div>
          <Link className="mr-4" href="/">
            Home
          </Link>
          <Link className="mr-4" href="/admin/dashboard">
            Dashboard
          </Link>
          <Link className="mr-4" href="/admin/users">
            Users
          </Link>
        </div>
        <button onClick={() => logout()}>Logout</button>
      </nav>
    </header>
  )
}
