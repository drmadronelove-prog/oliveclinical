'use client'

import { useState } from 'react'
import { Check, Plus, Tag as TagIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandEmpty } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import type { Tag } from '@/lib/team/types'
import { cn } from '@/lib/utils'

export function TagPicker({
  selected,
  allTags,
  onChange,
  onCreateTag,
}: {
  selected: Tag[]
  allTags: Tag[]
  onChange: (tagIds: string[]) => void
  onCreateTag: (name: string) => Promise<Tag | null>
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)

  const selectedIds = new Set(selected.map((t) => t.id))
  const exactMatch = allTags.some((t) => t.name.toLowerCase() === search.trim().toLowerCase())

  function toggle(tagId: string) {
    const next = selectedIds.has(tagId)
      ? selected.filter((t) => t.id !== tagId).map((t) => t.id)
      : [...selectedIds, tagId]
    onChange([...next])
  }

  async function handleCreate() {
    const name = search.trim()
    if (!name || creating) return
    setCreating(true)
    const tag = await onCreateTag(name)
    setCreating(false)
    setSearch('')
    if (tag) onChange([...selectedIds, tag.id])
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {selected.map((tag) => (
        <Badge
          key={tag.id}
          className="gap-1 border-transparent px-1.5 py-0 text-[10px]"
          style={{ backgroundColor: `${tag.color}26`, color: tag.color }}
        >
          {tag.name}
        </Badge>
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 rounded border border-dashed border-border px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <TagIcon className="size-3" aria-hidden="true" />
            {selected.length === 0 ? 'Tags' : 'Edit'}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0" align="start">
          <Command>
            <CommandInput placeholder="Find or create a tag…" value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>
                {search.trim() ? (
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={creating}
                    className="flex w-full items-center gap-1.5 px-2 py-1.5 text-left text-sm hover:bg-secondary"
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                    Create "{search.trim()}"
                  </button>
                ) : (
                  <span className="block px-2 py-1.5 text-sm text-muted-foreground">No tags yet</span>
                )}
              </CommandEmpty>
              <CommandGroup>
                {allTags.map((tag) => (
                  <CommandItem key={tag.id} onSelect={() => toggle(tag.id)} className="gap-2">
                    <Check
                      className={cn('size-3.5', selectedIds.has(tag.id) ? 'opacity-100' : 'opacity-0')}
                      aria-hidden="true"
                    />
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </CommandItem>
                ))}
                {search.trim() && !exactMatch && (
                  <CommandItem onSelect={handleCreate} disabled={creating} className="gap-1.5 text-muted-foreground">
                    <Plus className="size-3.5" aria-hidden="true" />
                    Create "{search.trim()}"
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
