"use client"

import type React from "react"
import { useState } from "react"
import { useAuthStore } from "@/store/Auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { IconLock, IconMail, IconUser, IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react"
import Link from "next/link"

function RegisterPage() {
    const { register, login } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const firstname = (formData.get("firstname") as string) || ""
        const lastname = (formData.get("lastname") as string) || ""
        const email = (formData.get("email") as string) || ""
        const password = (formData.get("password") as string) || ""

        const newErrors: { [key: string]: string } = {}
        if (!firstname) newErrors.firstname = "First name is required"
        if (!lastname) newErrors.lastname = "Last name is required"
        if (!email) newErrors.email = "Email is required"
        if (!password) newErrors.password = "Password is required"

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) return

        setIsLoading(true)
        setErrors({})

        const registerResponse = await register(email, password, `${firstname} ${lastname}`)
        if (registerResponse.error) {
            setErrors({ general: registerResponse.error.message })
        } else {
            const loginResponse = await login(email, password)
            if (loginResponse.error) {
                setErrors({ general: loginResponse.error.message })
            }
        }

        setIsLoading(false)
    }

    const handleGoogleSignUp = async () => {
        // TODO: Implement Google OAuth
        console.log("Google sign up clicked")
    }

    const handleGithubSignUp = async () => {
        // TODO: Implement GitHub OAuth
        console.log("GitHub sign up clicked")
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card/20" />

            <div className="relative w-full max-w-md">
                <Card className="border-border/50 bg-card/95 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-3xl font-extrabold text-center text-card-foreground">Dive into River Flow</CardTitle>
                        <p className="text-center text-sm text-muted-foreground">
                            Where developers connect, share knowledge, and grow together
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full bg-input border-border text-card-foreground hover:bg-accent transition-all duration-200 rounded-xl shadow-sm py-3 cursor-pointer"
                                onClick={handleGoogleSignUp}
                            >
                                <IconBrandGoogle className="w-4 h-4 mr-2" />
                                Continue with Google
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full bg-input border-border text-card-foreground hover:bg-accent transition-all duration-200 rounded-xl shadow-sm py-3 cursor-pointer"
                                onClick={handleGithubSignUp}
                            >
                                <IconBrandGithub className="w-4 h-4 mr-2" />
                                Continue with GitHub
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="firstname"
                                        className="text-card-foreground flex items-center gap-2"
                                    >
                                        <IconUser className="w-4 h-4" />
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstname"
                                        name="firstname"
                                        placeholder="John"
                                        className="bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                    />
                                    {errors.firstname && (
                                        <p className="text-destructive text-sm mt-1 flex items-center gap-1">{errors.firstname}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label
                                        htmlFor="lastname"
                                        className="text-card-foreground flex items-center gap-2"
                                    >
                                        <IconUser className="w-4 h-4" />
                                        Last Name
                                    </Label>
                                    <Input
                                        id="lastname"
                                        name="lastname"
                                        placeholder="Doe"
                                        className="bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                    />
                                    {errors.lastname && (
                                        <p className="text-destructive text-sm mt-1 flex items-center gap-1">{errors.lastname}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="email" className="text-card-foreground flex items-center gap-2">
                                    <IconMail className="w-4 h-4" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="text"
                                    name="email"
                                    placeholder="you@example.com"
                                    className="bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                />
                                {errors.email && (
                                    <p className="text-destructive text-sm mt-1 flex items-center gap-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="password"
                                    className="text-card-foreground flex items-center gap-2">
                                    <IconLock className="w-4 h-4" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Create a strong password"
                                    className="bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                />
                                {errors.password && (
                                    <p className="text-destructive text-sm mt-1 flex items-center gap-1">{errors.password}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Use 8+ characters with a mix of letters, numbers & symbols
                                </p>
                            </div>

                            {errors.general && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                    <p className="text-destructive text-sm text-center">{errors.general}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        Creating Account...
                                    </div>
                                ) : (
                                    "Join River Flow"
                                )}
                            </Button>
                        </form>

                        <div className="pt-3 border-t border-border/50">
                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default RegisterPage
