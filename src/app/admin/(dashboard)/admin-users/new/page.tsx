"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const roleOptions = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
]

export default function AdminUserNewPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'viewer' as const,
        phone: '',
        isActive: true,
    })

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            alert('이름을 입력해주세요.')
            return
        }
        if (!formData.email.trim()) {
            alert('이메일을 입력해주세요.')
            return
        }
        if (!formData.password.trim()) {
            alert('비밀번호를 입력해주세요.')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/admin/admin-users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                const data = await res.json()
                router.push(`/admin/admin-users/${data.data.id}`)
            } else {
                const error = await res.json()
                alert(error.message || '저장에 실패했습니다.')
            }
        } catch (error) {
            alert('저장에 실패했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
                {/* 헤더 */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/admin/admin-users')}
                        className="size-10 rounded-xl bg-admin-surface border border-admin-border flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined select-none">arrow_back</span>
                    </button>
                    <h1 className="text-admin-text-main text-2xl font-bold">신규 관리자 추가</h1>
                </div>

                {/* 폼 */}
                <div className="bg-admin-surface border border-admin-border rounded-2xl p-6 md:p-8 space-y-6">
                    {/* 이름 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                            이름 <span className="text-admin-danger">*</span>
                        </label>
                        <input
                            className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                            placeholder="관리자 이름을 입력하세요"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    </div>

                    {/* 이메일 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                            이메일 <span className="text-admin-danger">*</span>
                        </label>
                        <input
                            className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                    </div>

                    {/* 전화번호 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                            전화번호
                        </label>
                        <input
                            className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                            type="tel"
                            placeholder="010-0000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                    </div>

                    {/* 권한 등급 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                            권한 등급 <span className="text-admin-danger">*</span>
                        </label>
                        <select
                            className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm text-admin-text-main"
                            value={formData.role}
                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                        >
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 비밀번호 */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest flex items-center gap-1">
                            비밀번호 <span className="text-admin-danger">*</span>
                        </label>
                        <input
                            className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                            type="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        />
                    </div>

                    {/* 계정 활성화 */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                            className="w-4 h-4 rounded border-admin-border"
                        />
                        <span className="text-sm text-admin-text-secondary">계정 활성화</span>
                    </div>

                    {/* 버튼 */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-admin-border">
                        <button
                            onClick={() => router.push('/admin/admin-users')}
                            className="px-6 py-3 rounded-xl bg-admin-bg text-admin-text-secondary font-bold hover:text-white"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-10 py-3 rounded-xl bg-admin-primary text-white font-bold hover:bg-admin-primary-dark shadow-lg shadow-admin-primary/20 disabled:opacity-50"
                        >
                            {isSubmitting ? '저장 중...' : '계정 저장'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
