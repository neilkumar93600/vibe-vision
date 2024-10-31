import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ForgotPasswordForm } from "@/src/components/auth/PasswordResetForm"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
}

export default function ForgotPasswordPage() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
            <div className="absolute inset-0 bg-zinc-900">
            <Image
                src="/auth-background.jpg"
                alt="Authentication background"
                fill
                className="object-cover opacity-50"
                priority
            />
            </div>
            <div className="relative z-20 flex items-center text-lg font-medium">
            <Link href="/">Your Logo</Link>
            </div>
            <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
                <p className="text-lg">
                &ldquo;Security is not a product, but a process.&rdquo;
                </p>
                <footer className="text-sm">Bruce Schneier</footer>
            </blockquote>
            </div>
        </div>
        <div className="p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                Forgot your password?
                </h1>
                <p className="text-sm text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password
                </p>
            </div>
            <ForgotPasswordForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
                >
                Back to login
                </Link>
            </p>
            </div>
        </div>
        </div>
    )
}