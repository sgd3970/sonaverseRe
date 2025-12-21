"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useAdminLogin } from "@/lib/hooks/useAdmin"

const loginSchema = z.object({
    email: z.string().email("이메일 형식이 올바르지 않습니다."),
    password: z.string().min(1, "비밀번호를 입력해주세요."),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function AdminLoginForm() {
    const router = useRouter()
    const { login, isLoading, error, clearError } = useAdminLogin()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormValues) => {
        clearError()
        const user = await login(data.email, data.password)

        if (user) {
            router.push("/admin")
        }
    }

    const handleGoBack = () => {
        router.push("/")
    }

    return (
        <div className="w-full space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-black text-white">관리자 로그인</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-gray-400 block">이메일</label>
                    <input
                        id="email"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl border-none bg-[#2d3748] text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("email")}
                    />
                    {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-bold text-gray-400 block">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl border-none bg-[#2d3748] text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("password")}
                    />
                    {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
                </div>

                {error && (
                    <div role="alert" className="p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        <span className="material-symbols-outlined text-lg align-middle mr-2">error</span>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl bg-[#4a90e2] text-white text-lg font-bold hover:bg-[#357abd] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2 justify-center">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            로그인 중...
                        </span>
                    ) : (
                        "로그인"
                    )}
                </button>
            </form>

            <div className="text-center mt-6">
                <button
                    type="button"
                    onClick={handleGoBack}
                    className="text-gray-400 text-sm hover:text-gray-300 transition-colors"
                >
                    메인 홈페이지로 돌아가기
                </button>
            </div>
        </div>
    )
}
