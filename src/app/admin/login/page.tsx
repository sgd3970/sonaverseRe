import { AdminLoginForm } from "@/features/auth/components/AdminLoginForm"

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1a2332]">
            <div className="w-full max-w-md p-10 bg-[#232d3f] rounded-2xl shadow-2xl">
                <AdminLoginForm />
            </div>
        </div>
    )
}
