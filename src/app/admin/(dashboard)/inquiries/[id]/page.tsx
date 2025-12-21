"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

// 상태 배지 색상
const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-admin-danger/10', text: 'text-admin-danger' },
    in_progress: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    waiting_for_customer: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    resolved: { bg: 'bg-green-500/20', text: 'text-green-400' },
    closed: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
    spam: { bg: 'bg-red-500/20', text: 'text-red-400' },
}

const statusLabels: Record<string, string> = {
    pending: '대기',
    in_progress: '처리중',
    waiting_for_customer: '고객응답대기',
    resolved: '완료',
    closed: '종료',
    spam: '스팸',
}

export default function AdminInquiryDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [isUpdating, setIsUpdating] = useState(false)
    const [adminNote, setAdminNote] = useState('')

    // 문의 상세 조회
    const { data, isLoading, mutate } = useSWR(
        params.id ? `/api/admin/inquiries/${params.id}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            onSuccess: (data) => {
                if (data?.data) {
                    setAdminNote(data.data.adminNote || '')
                }
            }
        }
    )

    const inquiry = data?.data

    // 상태 변경
    const handleStatusChange = async () => {
        if (!inquiry) return

        const newStatus = prompt(
            '변경할 상태를 입력하세요:\npending(대기), in_progress(처리중), waiting_for_customer(고객응답대기), resolved(완료), closed(종료), spam(스팸)',
            inquiry.status
        )

        if (!newStatus || newStatus === inquiry.status) return

        setIsUpdating(true)
        try {
            const res = await fetch(`/api/admin/inquiries/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })

            if (res.ok) {
                mutate()
                alert('상태가 변경되었습니다.')
            } else {
                alert('상태 변경에 실패했습니다.')
            }
        } catch (error) {
            alert('상태 변경에 실패했습니다.')
        } finally {
            setIsUpdating(false)
        }
    }

    // 메모 저장
    const handleSaveNote = async () => {
        setIsUpdating(true)
        try {
            const res = await fetch(`/api/admin/inquiries/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminNote }),
            })

            if (res.ok) {
                mutate()
                alert('메모가 저장되었습니다.')
            } else {
                alert('메모 저장에 실패했습니다.')
            }
        } catch (error) {
            alert('메모 저장에 실패했습니다.')
        } finally {
            setIsUpdating(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-admin-bg">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!inquiry) {
        return (
            <div className="flex-1 flex items-center justify-center bg-admin-bg">
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">error</span>
                    <p className="text-gray-500 mb-4">문의를 찾을 수 없습니다.</p>
                    <button
                        onClick={() => router.push('/admin/inquiries')}
                        className="px-6 py-3 rounded-xl bg-admin-surface border border-admin-border text-admin-text-secondary font-bold hover:text-white"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        )
    }

    const inquiryType = inquiry.inquiry_type_label?.ko || inquiry.inquiry_type || '기타'
    const statusColor = statusColors[inquiry.status] || statusColors.pending

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 admin-scroll bg-admin-bg">
            <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
                {/* 헤더 */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/admin/inquiries')}
                        className="size-10 rounded-xl bg-admin-surface border border-admin-border flex items-center justify-center text-admin-text-secondary hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined select-none">arrow_back</span>
                    </button>
                    <h1 className="text-admin-text-main text-2xl font-bold">문의 상세 보기</h1>
                </div>

                {/* 메인 카드 */}
                <div className="bg-admin-surface border border-admin-border rounded-2xl overflow-hidden">
                    {/* 문의자 정보 헤더 */}
                    <div className="p-8 border-b border-admin-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="size-16 rounded-2xl bg-admin-primary/10 text-admin-primary flex items-center justify-center">
                                <span className="material-symbols-outlined select-none text-3xl">person</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-admin-text-main">
                                    {inquiry.inquirer?.name || '이름 없음'}{' '}
                                    <span className="text-sm font-normal text-admin-text-secondary ml-2">
                                        {inquiryType}
                                    </span>
                                </h2>
                                <p className="text-admin-text-secondary">
                                    {inquiry.inquirer?.email || ''} | {inquiry.inquirer?.phone_number || ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${statusColor.bg} ${statusColor.text}`}>
                                {statusLabels[inquiry.status] || inquiry.status}
                            </span>
                            <button
                                onClick={handleStatusChange}
                                disabled={isUpdating}
                                className="h-12 px-6 rounded-xl bg-admin-bg border border-admin-border text-xs font-bold hover:text-white disabled:opacity-50"
                            >
                                상태 변경
                            </button>
                        </div>
                    </div>

                    {/* 문의 내용 */}
                    <div className="p-8 bg-admin-bg/30">
                        <h4 className="text-xs font-black text-admin-text-secondary uppercase tracking-widest mb-4">
                            Inquiry Content
                        </h4>
                        {inquiry.subject && (
                            <h3 className="text-xl font-bold text-admin-text-main mb-4">{inquiry.subject}</h3>
                        )}
                        <p className="text-admin-text-main leading-relaxed whitespace-pre-wrap text-lg">
                            {inquiry.message}
                        </p>
                    </div>

                    {/* 관리자 메모 */}
                    <div className="p-8 border-t border-admin-border space-y-4">
                        <h4 className="text-xs font-black text-admin-text-secondary uppercase tracking-widest">
                            Admin Note
                        </h4>
                        <textarea
                            className="w-full h-32 bg-admin-bg border border-admin-border rounded-xl p-4 text-sm"
                            placeholder="상담 메모를 남겨주세요."
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveNote}
                                disabled={isUpdating}
                                className="px-8 py-3 bg-admin-primary text-white font-bold rounded-xl hover:bg-admin-primary-dark disabled:opacity-50"
                            >
                                {isUpdating ? '저장 중...' : '메모 저장'}
                            </button>
                        </div>
                    </div>

                    {/* 추가 정보 섹션 */}
                    {inquiry.inquirer?.company_name && (
                        <div className="p-8 border-t border-admin-border">
                            <h4 className="text-xs font-black text-admin-text-secondary uppercase tracking-widest mb-3">
                                회사 정보
                            </h4>
                            <p className="text-admin-text-main">{inquiry.inquirer.company_name}</p>
                            {inquiry.inquirer.position && (
                                <p className="text-admin-text-secondary text-sm mt-1">{inquiry.inquirer.position}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* 문의 정보 메타 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-admin-surface border border-admin-border rounded-xl p-4">
                        <p className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest mb-2">
                            문의번호
                        </p>
                        <p className="text-admin-text-main font-mono">{inquiry.inquiry_number}</p>
                    </div>
                    <div className="bg-admin-surface border border-admin-border rounded-xl p-4">
                        <p className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest mb-2">
                            접수일시
                        </p>
                        <p className="text-admin-text-main">
                            {new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                    <div className="bg-admin-surface border border-admin-border rounded-xl p-4">
                        <p className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest mb-2">
                            우선순위
                        </p>
                        <p className="text-admin-text-main capitalize">{inquiry.priority}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
