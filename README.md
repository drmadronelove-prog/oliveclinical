# neuroinclusivetherapy

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_RA9OsxZYPa9lNG6xok1BeLI57PEk)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/drmadronelove-prog/neuroinclusivetherapy" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>

## Team workspace (`/team`)

`oliveclinical.com/team` is an internal project-management workspace for the
practice — marketing campaigns and clinical-hire onboarding checklists. It
shares this Next.js deployment with the public site but has its own sign-in,
its own layout, and its own database.

**Data boundary — read this before you put anything in it.**

> The team workspace holds **internal operations work only**: campaigns,
> tasks, hiring steps, and notes about our own processes.
>
> **No client names. No clinical content. No PHI.** Not in a task title, not
> in a comment, not in an attachment, not "just initials". This system is not
> a HIPAA-covered environment and is not built to be one. If a piece of work
> requires naming a client, it belongs in the EHR, not here.

Setup instructions are in [`PHASE-1.md`](./PHASE-1.md). Database schema lives
in `supabase/migrations/` and is applied by pasting each file into the
Supabase SQL editor, in numbered order.

The public marketing site does not depend on any of this: if the Supabase
keys are absent, every page outside `/team` builds and serves exactly as
before.
