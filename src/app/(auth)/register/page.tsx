"use client"

import type React from "react"
import { useState } from "react"
import { useAuthStore } from "@/store/Auth"
import { useRegisterFormStore } from "@/store/FormState"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { IconLock, IconMail, IconUser, IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react"
import { flattenValidationError } from "@/utils/form"
import Link from "next/link"

function RegisterPage() {
    const { register, login } = useAuthStore()
    const { firstname, lastname, email, password, setField, reset } = useRegisterFormStore()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const firstname = (formData.get("firstname") as string)?.trim() || "";
        const lastname = (formData.get("lastname") as string)?.trim() || "";
        const email = (formData.get("email") as string)?.trim() || "";
        const password = (formData.get("password") as string)?.trim() || "";

        // Frontend name validation
        const nameErrors: { name?: string } = {};
        if (!firstname || firstname.length < 3 || !lastname || lastname.length < 3) {
            nameErrors.name = "First and last name must be at least 3 characters long";
        }

        // Call register (which also runs Zod validation for email/password)
        const registerResponse = await register(email, password, `${firstname} ${lastname}`);

        const combinedErrors: { [key: string]: string } = { ...nameErrors };

        if (!registerResponse.success) {
            if ("validationError" in registerResponse && registerResponse.validationError) {
                Object.assign(combinedErrors, flattenValidationError(registerResponse.validationError));
            } else if (registerResponse.error) {
                combinedErrors.general = registerResponse.error.message;
            }
        }

        // Show errors if any
        if (Object.keys(combinedErrors).length > 0) {
            setErrors(combinedErrors);
            setIsLoading(false);
            return;
        }

        // Call login
        const loginResponse = await login(email, password);
        if (!loginResponse.success) {
            if ("validationError" in loginResponse && loginResponse.validationError) {
                setErrors(flattenValidationError(loginResponse.validationError));
            } else if (loginResponse.error) {
                setErrors({ general: loginResponse.error.message });
            }
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        reset();
    };

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

                        <form onSubmit={handleRegister} className="space-y-4">
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
                                        value={firstname}
                                        onChange={(e) => setField("firstname", e.target.value)}
                                        className="bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                    />
                                    {errors.name && (
                                        <p className="text-destructive text-sm mt-1 flex items-center gap-1">{errors.name}</p>
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
                                        value={lastname}
                                        onChange={(e) => setField("lastname", e.target.value)}
                                        className="bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                    />
                                    {errors.name && (
                                        <p className="text-destructive text-sm mt-1 flex items-center gap-1">{errors.name}</p>
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
                                    value={email}
                                    onChange={(e) => setField("email", e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setField("password", e.target.value)}
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
