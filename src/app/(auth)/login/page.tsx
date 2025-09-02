"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/Auth"
import { useLoginFormStore } from "@/store/FormState"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import Link from "next/link"
import { flattenValidationError } from "@/utils/form"

function LoginPage() {
    const { login } = useAuthStore()
    const { email, password, setField, reset } = useLoginFormStore()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors({})

        const formData = new FormData(e.currentTarget)
        const emailInput = (formData.get("email") as string)?.trim() || ""
        const passwordInput = (formData.get("password") as string)?.trim() || ""

        setIsLoading(true)

        const loginResponse = await login(emailInput, passwordInput)

        if (!loginResponse.success) {
            if ("validationError" in loginResponse && loginResponse.validationError) {
                setErrors(flattenValidationError(loginResponse.validationError))
            } else if (loginResponse.error) {
                setErrors({ general: loginResponse.error.message })
            }
            setIsLoading(false)
            return
        }

        setIsLoading(false)
        reset() // clear persisted form state
        router.push("/profile")
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md rounded-3xl bg-card shadow-2xl border border-border">
                <CardHeader className="pt-7 px-6">
                    <CardTitle className="text-center text-3xl font-extrabold text-foreground">
                        Welcome Back to River Flow
                    </CardTitle>
                </CardHeader>

                <CardContent className="px-6 py-7">
                    <div className="flex flex-col gap-3 mb-6">
                        <Button
                            variant="outline"
                            className="flex items-center justify-center gap-2 bg-input text-foreground hover:bg-accent rounded-xl shadow-sm py-3 transition-all duration-200 cursor-pointer"
                        >
                            <IconBrandGoogle size={20} />
                            Continue with Google
                        </Button>

                        <Button
                            variant="outline"
                            className="flex items-center justify-center gap-2 bg-input text-foreground hover:bg-accent rounded-xl shadow-sm py-3 transition-all duration-200 cursor-pointer"
                        >
                            <IconBrandGithub size={20} />
                            Continue with GitHub
                        </Button>
                    </div>

                    <div className="flex items-center my-6">
                        <span className="flex-1 h-px bg-border"></span>
                        <span className="px-3 text-muted-foreground text-sm">or continue with email</span>
                        <span className="flex-1 h-px bg-border"></span>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-foreground">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="text"
                                name="email"
                                value={email}
                                onChange={(e) => setField("email", e.target.value)}
                                placeholder="you@example.com"
                                className="bg-input border-input text-foreground placeholder-muted-foreground focus:ring-primary focus:border-primary"
                            />
                            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-foreground">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setField("password", e.target.value)}
                                placeholder="********"
                                className="bg-input border-input text-foreground placeholder-muted-foreground focus:ring-primary focus:border-primary"
                            />
                            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* General Error */}
                        {errors.general && <p className="text-destructive text-sm text-center mt-2">{errors.general}</p>}

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign in to River Flow"}
                        </Button>

                        <p className="text-center text-muted-foreground mt-4 text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-primary font-semibold hover:underline">
                                Join the flow
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage
