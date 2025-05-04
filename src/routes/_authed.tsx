// app/routes/_authed.tsx

import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SignIn, useUser } from '@clerk/tanstack-react-start'
import { useEffect } from 'react'
import { triplit } from '@/triplit/triplitClient'

function AuthLayout() {
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      const saveUserToTriplit = async () => {
        try {
          await triplit.insert('users', {
            id: user.id,
            username: user.username || user.fullName || '',
            email: user.primaryEmailAddress?.emailAddress || '',
            created_at: new Date(),
          })
        } catch (err: any) {
          if (!err.message?.includes('already exists')) {
            console.error('Failed to insert user into Triplit:', err)
          }
        }
      }

      saveUserToTriplit()
    }
  }, [user])

  return <Outlet />
}

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw new Error('Not authenticated')
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      return (
        <div className="flex items-center justify-center p-12">
          <SignIn routing="hash" forceRedirectUrl={window.location.href} />
        </div>
      )
    }

    throw error
  },
  component: AuthLayout,
})
