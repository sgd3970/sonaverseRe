"use client"

import * as React from "react"
import { useTranslation, useLocale } from "@/lib/i18n"

interface FileUploadProps {
    files: File[]
    onFilesChange: (files: File[]) => void
}

export function FileUpload({ files, onFilesChange }: FileUploadProps) {
    const { t } = useTranslation()
    const locale = useLocale()
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Allowed extensions
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'heic', 'pdf', 'doc', 'docx', 'hwp', 'hwpx', 'txt', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'zip']

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files
        if (!selectedFiles) return

        const validFiles: File[] = []
        const invalidFiles: string[] = []

        Array.from(selectedFiles).forEach(file => {
            const extension = file.name.split('.').pop()?.toLowerCase()
            if (extension && ALLOWED_EXTENSIONS.includes(extension)) {
                validFiles.push(file)
            } else {
                invalidFiles.push(file.name)
            }
        })

        if (invalidFiles.length > 0) {
            alert(`다음 파일은 허용되지 않는 형식입니다:\n${invalidFiles.join(', ')}\n\n허용 형식: ${ALLOWED_EXTENSIONS.join(', ')}`)
        }

        if (validFiles.length > 0) {
            onFilesChange([...files, ...validFiles])
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const removeFile = (index: number) => {
        onFilesChange(files.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-3">
            <label className="text-sm font-bold text-gray-800">
                {locale === 'en' ? 'Attachments (Multiple files allowed)' : '첨부파일 (여러 개 선택 가능)'}
            </label>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
                onChange={handleFileSelect}
                className="hidden"
            />
            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group"
            >
                <span className="material-symbols-outlined select-none text-3xl text-gray-400 group-hover:text-primary mb-2">
                    cloud_upload
                </span>
                <p className="text-sm text-gray-600 mb-1">
                    {locale === 'en' ? 'Click to upload files' : '클릭하여 파일을 업로드하세요'}
                </p>
                <p className="text-xs text-gray-400">
                    {locale === 'en' ? 'Allowed extensions' : '허용 확장자'}: {ALLOWED_EXTENSIONS.join(', ')}
                </p>
            </div>

            {/* Attached Files List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="material-symbols-outlined text-primary text-lg">attach_file</span>
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
