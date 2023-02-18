'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const router = useRouter()
  async function logout() {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    })

    router.push('/')
  }

  return (
    <header className="mt-0 bg-indigo-700 text-indigo-200">
      <nav className="flex justify-between p-4">
        <div>
          <Link className="mr-4" href="/">
            Home
          </Link>
          <Link className="mr-4" href="/bca/transactions">
            Transactions
          </Link>
          <Link className="mr-4" href="/bca/reports">
            Reports
          </Link>
          <Link className="mr-4" href="/bca/parameters">
            Parameters
          </Link>
        </div>
        <div className="flex">
          <Link className="mr-4" href="/bca/users">
            Users
          </Link>
          <button onClick={() => logout()}>Logout</button>
        </div>
      </nav>
    </header>
  )
}
