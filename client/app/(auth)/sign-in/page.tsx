"use client"
import React, { useEffect } from 'react'
import { LoginForm } from '../../../components/ui/Login-form'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const Page = () => {
  const { data, isPending } = authClient.useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (!isPending && (data?.session || data?.user)) {
      router.push("/")
    }
  }, [data, isPending, router])
  
  if (isPending || data?.session || data?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }
  return (
   <>
   <LoginForm/>
   </>
  )
}

export default Page