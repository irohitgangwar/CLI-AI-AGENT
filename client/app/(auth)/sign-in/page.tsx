"use client"
import React, { useEffect, Suspense } from 'react'
import { LoginForm } from '../../../components/ui/Login-form'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { useRouter, useSearchParams } from 'next/navigation'

const SignInContent = () => {
  const { data, isPending } = authClient.useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"
  
  useEffect(() => {
    if (!isPending && (data?.session || data?.user)) {
      router.push(redirectTo)
    }
  }, [data, isPending, router, redirectTo])
  
  if (isPending || data?.session || data?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }
  return <LoginForm />
}

const Page = () => {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}

export default Page