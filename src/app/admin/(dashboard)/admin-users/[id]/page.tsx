"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

const roleOptions = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
]

export default function AdminUserEditPage() {
    const params = useParams()
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

    // 관리자 조회
    const { data, isLoading } = useSWR(
        params.id ? `/api/admin/admin-users/${params.id}` : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    // 데이터 로드 시 폼 초기화
    useEffect(() => {
        if (data?.data) {
            const user = data.data
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                role: user.role || 'viewer',
                phone: user.phone || '',
                isActive: user.is_active !== false,
            })
        }
    }, [data])

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            alert('이름을 입력해주세요.')
            return
        }
        if (!formData.email.trim()) {
            alert('이메일을 입력해주세요.')
            return
        }

        setIsSubmitting(true)
        try {
            const submitData: any = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                phone: formData.phone,
                isActive: formData.isActive,
            }

            // 비밀번호가 입력된 경우에만 포함
            if (formData.password.trim()) {
                submitData.password = formData.password
            }

            const res = await fetch(`/api/admin/admin-users/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
            })

            if (res.ok) {
                alert('저장되었습니다.')
                router.refresh()
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

    const handleDelete = async () => {
        if (!confirm('정말 삭제하시겠습니까?')) return

        try {
            const res = await fetch(`/api/admin/admin-users/${params.id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                router.push('/admin/admin-users')
            } else {
                alert('삭제에 실패했습니다.')
            }
        } catch (error) {
            alert('삭제에 실패했습니다.')
        }
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-admin-bg">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!data?.data) {
        return (
            <div className="flex-1 flex items-center justify-center bg-admin-bg">
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">error</span>
                    <p className="text-gray-500 mb-4">관리자를 찾을 수 없습니다.</p>
                    <button
                        onClick={() => router.push('/admin/admin-users')}
                        className="px-6 py-3 rounded-xl bg-admin-surface border border-admin-border text-admin-text-secondary font-bold hover:text-white"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        )
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
                    <h1 className="text-admin-text-main text-2xl font-bold">관리자 계정 수정</h1>
                    <div className="flex items-center gap-2 ml-auto">
                        {formData.isActive ? (
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                                활성화
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">
                                비활성화
                            </span>
                        )}
                    </div>
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
                            비밀번호
                        </label>
                        <input
                            className="w-full h-12 bg-admin-bg border border-admin-border rounded-xl px-4 text-sm"
                            type="password"
                            title="변경 시에만 입력"
                            placeholder="********"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        />
                        <p className="text-xs text-admin-text-secondary">* 변경할 경우에만 입력하세요</p>
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
                    <div className="flex justify-between gap-3 pt-6 border-t border-admin-border">
                        <button
                            onClick={handleDelete}
                            className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 border border-red-500/20"
                        >
                            삭제
                        </button>
                        <div className="flex gap-3">
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
        </div>
    )
}
