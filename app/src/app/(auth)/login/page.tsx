import { LoginForm } from "@/domain/auth/views/components/login-form"
import { Toaster } from "sonner"

export default function LoginPage() {
    return (
        <div className="flex justify-center items-center h-full">
            <Toaster />
            <LoginForm />
        </div>
    )
}