import DOMPurify from 'isomorphic-dompurify'

/**
 * The single allowlist for task descriptions, used both when saving (the
 * real security boundary — nothing else stored HTML ever reaches the
 * database unfiltered) and again when rendering (belt and braces, in
 * case content ever reaches the database some other way, hand-edited in
 * Supabase included).
 *
 * Deliberately narrow: exactly what the toolbar offers and nothing more.
 * No images, no embeds, no styling attributes — those are a much larger
 * security surface for a feature this app never promised.
 */
const ALLOWED_TAGS = ['p', 'strong', 'em', 's', 'ul', 'ol', 'li', 'a', 'br']
const ALLOWED_ATTR = ['href']

// Every link a member types opens safely in a new tab, regardless of
// what the editor produced — closes the classic window.opener
// reverse-tabnabbing gap. Registered once; DOMPurify runs the hook on
// every sanitize() call.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

export function sanitizeTaskDescription(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
}
