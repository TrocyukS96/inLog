import type { ReactNode } from 'react'
import { SignHeader } from '../../../features/auth/ui/SignHeader'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/laboratory.jpg')" }} // положи картинку в public/images
    >
      <SignHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-border/50">
          {children}
        </div>
      </main>
    </div>
  )
}