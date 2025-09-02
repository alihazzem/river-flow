"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuthStore } from "@/store/Auth"
import { useRouter } from "next/navigation"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const { session } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.replace("/")
        }
    }, [session, router])

    if (session) {
        return null
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">{children}</div>
        </div>
    )
}

export default AuthLayout
