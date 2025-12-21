"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = '내용을 입력하세요...',
  className,
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !disabled,
  })

  if (!editor) {
    return null
  }

  return (
    <div className={cn("border border-admin-border rounded-xl overflow-hidden bg-admin-bg", className)}>
      {/* 툴바 */}
      <div className="flex items-center gap-1 p-2 border-b border-admin-border bg-admin-surface flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "size-8 rounded flex items-center justify-center text-sm transition-colors",
            editor.isActive('bold') 
              ? "bg-admin-primary text-white" 
              : "text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover"
          )}
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "size-8 rounded flex items-center justify-center text-sm transition-colors",
            editor.isActive('italic') 
              ? "bg-admin-primary text-white" 
              : "text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover"
          )}
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            "size-8 rounded flex items-center justify-center text-sm transition-colors",
            editor.isActive('strike') 
              ? "bg-admin-primary text-white" 
              : "text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover"
          )}
        >
          <span className="line-through">S</span>
        </button>
        <div className="w-px h-6 bg-admin-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "size-8 rounded flex items-center justify-center text-sm transition-colors",
            editor.isActive('heading', { level: 1 }) 
              ? "bg-admin-primary text-white" 
              : "text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover"
          )}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "size-8 rounded flex items-center justify-center text-sm transition-colors",
            editor.isActive('heading', { level: 2 }) 
              ? "bg-admin-primary text-white" 
              : "text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover"
          )}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "size-8 rounded flex items-center justify-center text-sm transition-colors",
            editor.isActive('heading', { level: 3 }) 
              ? "bg-admin-primary text-white" 
              : "text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover"
          )}
        >
          H3
        </button>
        <div className="w-px h-6 bg-admin-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "size-8 rounded flex items-center justify-center text-sm transition-colors",
            editor.isActive('bulletList') 
              ? "bg-admin-primary text-white" 
              : "text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover"
          )}
        >
          <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "size-8 rounded flex items-center justify-center text-sm transition-colors",
            editor.isActive('orderedList') 
              ? "bg-admin-primary text-white" 
              : "text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover"
          )}
        >
          <span className="material-symbols-outlined text-sm">format_list_numbered</span>
        </button>
        <div className="w-px h-6 bg-admin-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "size-8 rounded flex items-center justify-center text-sm transition-colors",
            editor.isActive('blockquote') 
              ? "bg-admin-primary text-white" 
              : "text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover"
          )}
        >
          <span className="material-symbols-outlined text-sm">format_quote</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="size-8 rounded flex items-center justify-center text-sm text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover transition-colors"
        >
          <span className="material-symbols-outlined text-sm">horizontal_rule</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="size-8 rounded flex items-center justify-center text-sm text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">undo</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="size-8 rounded flex items-center justify-center text-sm text-admin-text-secondary hover:text-white hover:bg-admin-surface-hover transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">redo</span>
        </button>
      </div>

      {/* 에디터 */}
      <div className="p-4 min-h-[300px]">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:min-h-[250px] [&_.ProseMirror]:outline-none [&_.ProseMirror_placeholder]:text-admin-text-secondary [&_.ProseMirror_placeholder]:opacity-50"
        />
      </div>
    </div>
  )
}

