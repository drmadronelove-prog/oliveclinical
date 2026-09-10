'use client'

import { useCallback } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void
  active: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      // Without this, clicking a toolbar button steals focus from the
      // editor first, which collapses the text selection the button
      // was supposed to act on.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        active && 'bg-secondary text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = useCallback(() => {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previous ?? 'https://')
    if (url === null) return
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }, [editor])

  return (
    <div className="flex items-center gap-0.5 border-b border-border px-1 py-1">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        label="Bold"
      >
        <Bold className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        label="Italic"
      >
        <Italic className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        label="Bullet list"
      >
        <List className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        label="Numbered list"
      >
        <ListOrdered className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton onClick={setLink} active={editor.isActive('link')} label="Link">
        <LinkIcon className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
    </div>
  )
}

const CONTENT_CLASS =
  'min-h-32 px-3 py-2 text-sm outline-none [&_p:not(:last-child)]:mb-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mb-0.5 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2'

/**
 * Bold, italic, bullet and numbered lists, links — exactly the toolbar
 * promised, nothing more. What this saves is HTML; `onChange` fires the
 * full content once when focus leaves the editor, matching how the rest
 * of the detail pane commits changes.
 *
 * Render with `key={task.id}` from the caller — switching that key is
 * what resets the editor's content when a different task opens, rather
 * than this component needing to detect and resync an external prop
 * change itself.
 */
export function RichTextEditor({
  content,
  onChange,
}: {
  content: string
  onChange: (html: string) => void
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        blockquote: false,
        code: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
        },
      }),
    ],
    content,
    editorProps: {
      attributes: { class: CONTENT_CLASS },
    },
    onBlur: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  return (
    <div className="rounded-md border border-border bg-background focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
