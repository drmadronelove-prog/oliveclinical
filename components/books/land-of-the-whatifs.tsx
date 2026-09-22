"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import { Cormorant_Garamond, Spectral } from "next/font/google"
import s from "./land-of-the-whatifs.module.css"

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--book-display",
})

const body = Spectral({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--book-body",
})

const IMG = "/books/land-of-the-whatifs"
const PAGE_KEY = "whatifs_page"
const TURN_MS = 620

type Page =
  | { type: "cover"; img: string }
  | { type: "title" }
  | { type: "dedication" }
  | { type: "story"; n: number; img: string; stanzas: string[][] }
  | { type: "end" }

// Verse lines are static strings that may carry entities and <em>.
const PAGES: Page[] = [
  { type: "cover", img: `${IMG}/panel-01.jpg` },
  { type: "title" },
  { type: "dedication" },
  { type: "story", n: 1, img: `${IMG}/panel-02.jpg`, stanzas: [[
    "A girl sat slumped inside her chair,",
    "with curls piled high and a faraway stare.",
    "The teacher droned on, the clock ticked slow,",
    "and her mind drifted off where her mind liked to go.",
  ]]},
  { type: "story", n: 2, img: `${IMG}/panel-03.jpg`, stanzas: [
    [ "Then <em>pop pop</em>, from out of the air,",
      "two fuzzy small goblins appeared by her hair.",
      "Round little bodies, eyes open wide,",
      "two tiny What-Ifs there at her side." ],
    [ "&ldquo;What if,&rdquo; said one. &ldquo;What if,&rdquo; said two.",
      "&ldquo;What if, what if, what if it&rsquo;s true?&rdquo;",
      "She blinked and she watched as they drifted away,",
      "and she rose from her seat and she followed their sway." ],
  ]},
  { type: "story", n: 3, img: `${IMG}/panel-04.jpg`, stanzas: [[
    "The floor turned to moss, the walls turned to bark,",
    "the room slipped behind her, the path grew dark.",
    "She tiptoed past trunks, she ducked under leaves,",
    "till she stood in a forest of whispering trees.",
  ]]},
  { type: "story", n: 4, img: `${IMG}/panel-05.jpg`, stanzas: [[
    "Out came the Mights with their droopy long eyes,",
    "soft purple goblins of medium size.",
    "&ldquo;Might be, might be,&rdquo; they hummed as they spun,",
    "&ldquo;might be a problem, might be no fun.&rdquo;",
  ]]},
  { type: "story", n: 5, img: `${IMG}/panel-06.jpg`, stanzas: [[
    "Then up popped the Oh-Nos with jagged spiked fur,",
    "their voices a panic, their movements a blur.",
    "&ldquo;Oh no, oh no, oh no, oh no,&rdquo;",
    "they tugged at her sleeves and they would not let go.",
  ]]},
  { type: "story", n: 6, img: `${IMG}/panel-07.jpg`, stanzas: [[
    "And tall through the trees the It&rsquo;s-Possibles loomed,",
    "thin wispy goblins where shadow had bloomed.",
    "&ldquo;It&rsquo;s possible, possible, possible too,&rdquo;",
    "they murmured of all that <em>could</em> happen to you.",
  ]]},
  { type: "story", n: 7, img: `${IMG}/panel-08.jpg`, stanzas: [[
    "She walked and she walked and the trees pressed in tight,",
    "the branches like fingers, the day turned to night.",
    "The path disappeared, the goblins all swarmed,",
    "her chest grew so small and her breath came so warmed.",
  ]]},
  { type: "story", n: 8, img: `${IMG}/panel-09.jpg`, stanzas: [[
    "She sank to the ground and she covered her face,",
    "and she cried in that dark and impossible place.",
    "She cried and she cried and she cried some more,",
    "till her tears made a puddle on the cold forest floor.",
  ]]},
  { type: "story", n: 9, img: `${IMG}/panel-10.jpg`, stanzas: [[
    "And then, very slow, she remembered to breathe.",
    "One breath. Then another. A soft small reprieve.",
    "And there in the quiet, in gold gentle light,",
    "her grandmother shimmered, a memory bright.",
  ]]},
  { type: "story", n: 10, img: `${IMG}/panel-11.jpg`, stanzas: [
    [ "&ldquo;Sweet girl,&rdquo; said her grandma, &ldquo;I see where you&rsquo;ve gone.",
      "You&rsquo;re lost in the land where the What-Ifs live on.",
      "There&rsquo;s only one way to come back from this place,",
      "so listen, my darling, and slow down your pace." ],
    [ "Don&rsquo;t follow the goblins, don&rsquo;t chase what they say.",
      "Come back to your senses. They&rsquo;ll show you the way.&rdquo;" ],
  ]},
  { type: "story", n: 11, img: `${IMG}/panel-12.jpg`, stanzas: [[
    "So the girl pressed her palm to the cool forest ground,",
    "and she opened her ears to a faint distant sound.",
  ]]},
  { type: "story", n: 12, img: `${IMG}/panel-13.jpg`, stanzas: [[
    "She looked at the trees. She felt her own chest.",
    "She breathed in and out and she did her slow best.",
  ]]},
  { type: "story", n: 13, img: `${IMG}/panel-14.jpg`, stanzas: [[
    "And the sound she had heard, very far, very thin,",
    "grew clearer and closer and pulled her right in,",
    "till the trees became desks and the moss became floor,",
    "and the goblins were dust in a sun-slanted door.",
  ]]},
  { type: "story", n: 14, img: `${IMG}/panel-15.jpg`, stanzas: [[
    "The earth was her chair. She could feel the warm wood.",
    "Her lunch bag wafted up, and it smelled so good.",
    "Her heart in her chest gave a steady kind thump,",
    "and the teacher&rsquo;s clear voice made her sit up with a jump.",
  ]]},
  { type: "story", n: 15, img: `${IMG}/panel-16.jpg`, stanzas: [[
    "She&rsquo;d wandered so far, but she&rsquo;d found her way home,",
    "to the desk and the chair and the room of her own.",
    "And she sat up so tall, and she listened so true,",
    "to the world that was real, and the things she could do.",
  ]]},
  { type: "end" },
]

// Poem lines never wrap: each page's verse starts at the base size and
// shrinks just enough for its longest line to fit the column.
function Verse({ stanzas, stacked }: { stanzas: string[][]; stacked: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const base = stacked ? 38 : 34
  const [size, setSize] = useState(base)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      const current = el.style.fontSize
      el.style.fontSize = base + "px"
      const lines = Array.from(el.querySelectorAll<HTMLElement>("." + s.vline))
      const widest = Math.max(...lines.map((l) => l.scrollWidth))
      setSize(widest > el.clientWidth ? Math.floor((base * el.clientWidth) / widest) : base)
      el.style.fontSize = current
    }
    fit()
    document.fonts?.ready.then(fit)
  }, [base, stanzas])

  return (
    <div ref={ref} className={s.verse} style={{ fontSize: size }}>
      {stanzas.map((st, i) => (
        <p className={s.stanza} key={i}>
          {st.map((line, j) => (
            <span className={s.vline} key={j} dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </p>
      ))}
    </div>
  )
}

function Ornament() {
  return (
    <div className={s.ornament} aria-hidden="true">
      <span className={s.ornRule} />
      <span className={s.ornDot} />
      <span className={s.ornRule} />
    </div>
  )
}

function PageContent({ page, stacked }: { page: Page; stacked: boolean }) {
  if (page.type === "cover") {
    return (
      <div className={`${s.page} ${s.pageArt}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.fitImg} src={page.img} alt="What If… — cover illustration" />
        <div className={s.coverCredit}>
          <span className={s.ccRule} />
          <span className={s.ccName}>Madrone&nbsp;Love</span>
        </div>
      </div>
    )
  }
  if (page.type === "title") {
    return (
      <div className={`${s.page} ${s.pagePaper} ${s.pageFront}`}>
        <div className={s.frontInner}>
          <Ornament />
          <h1 className={s.bookTitle}>The Land<br />of the Whatifs</h1>
          <p className={s.bookSub}>A story about listening to what matters</p>
          <p className={s.bookAuthor}>Madrone Love</p>
        </div>
      </div>
    )
  }
  if (page.type === "dedication") {
    return (
      <div className={`${s.page} ${s.pagePaper} ${s.pageFront}`}>
        <div className={`${s.frontInner} ${s.dedication}`}>
          <p className={s.dedFor}>for Gil Fronsdal &mdash;</p>
          <p className={s.dedLine}>who points the way back<br />to the breath, the bell,<br />and the present moment.</p>
          <Ornament />
        </div>
      </div>
    )
  }
  if (page.type === "end") {
    return (
      <div className={`${s.page} ${s.pagePaper} ${s.pageFront}`}>
        <div className={s.frontInner}>
          <Ornament />
          <p className={s.theEnd}>the end</p>
        </div>
      </div>
    )
  }

  if (stacked) {
    return (
      <div className={`${s.page} ${s.pagePaper} ${s.pageStacked}`}>
        <div className={s.stackImg}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.img} alt="" />
        </div>
        <div className={s.stackText}>
          <div className={s.verseWrap}><Verse stanzas={page.stanzas} stacked={stacked} /></div>
          <span className={s.folio}>{page.n}</span>
        </div>
      </div>
    )
  }

  // facing: art on the left page, verse on the right
  return (
    <div className={`${s.page} ${s.pagePaper}`}>
      <div className={s.spreadLeft}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className={s.plate}><img src={page.img} alt="" /></div>
      </div>
      <div className={s.spreadRight}>
        <div className={s.verseWrap}><Verse stanzas={page.stanzas} stacked={stacked} /></div>
        <span className={s.folio}>{page.n}</span>
      </div>
      <div className={s.gutter} />
    </div>
  )
}

export function LandOfTheWhatifs() {
  const [idx, setIdx] = useState(0)
  const [anim, setAnim] = useState<{ from: number; to: number; dir: 1 | -1 } | null>(null)
  const [scale, setScale] = useState(1)
  const [stacked, setStacked] = useState(false)

  // Resume where the reader left off (read after mount to avoid a hydration mismatch).
  useEffect(() => {
    try {
      const saved = parseInt(localStorage.getItem(PAGE_KEY) || "0", 10)
      if (saved > 0 && saved < PAGES.length) setIdx(saved)
    } catch {}
  }, [])
  useEffect(() => {
    try { localStorage.setItem(PAGE_KEY, String(idx)) } catch {}
  }, [idx])

  const go = useCallback((to: number) => {
    if (to < 0 || to >= PAGES.length) return
    setAnim((a) => a || { from: idx, to, dir: to > idx ? 1 : -1 })
  }, [idx])
  const next = useCallback(() => go(idx + 1), [go, idx])
  const prev = useCallback(() => go(idx - 1), [go, idx])

  useEffect(() => {
    if (!anim) return
    const tm = setTimeout(() => { setIdx(anim.to); setAnim(null) }, TURN_MS)
    return () => clearTimeout(tm)
  }, [anim])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); next() }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev() }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, prev])

  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const portrait = h > w
      setStacked(portrait)
      setScale(portrait
        ? Math.min((w - 32) / 1000, (h - 130) / 1500)
        : Math.min((w - 120) / 1500, (h - 90) / 1000))
    }
    fit()
    window.addEventListener("resize", fit)
    return () => window.removeEventListener("resize", fit)
  }, [])

  // The book is a full-screen reader; stop the page underneath from scrolling.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prevOverflow }
  }, [])

  const last = PAGES.length - 1

  return (
    <div className={`${s.root} ${display.variable} ${body.variable} ${stacked ? s.stacked : ""}`}>
      <div className={s.stage}>
        <div className={s.stageInner} style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          {anim ? (
            <>
              <div className={`${s.layer} ${anim.dir === 1 ? s.leaveFwd : s.leaveBack}`} key={"l" + anim.from}>
                <PageContent page={PAGES[anim.from]} stacked={stacked} />
              </div>
              <div className={`${s.layer} ${anim.dir === 1 ? s.enterFwd : s.enterBack}`} key={"e" + anim.to}>
                <PageContent page={PAGES[anim.to]} stacked={stacked} />
              </div>
            </>
          ) : (
            <div className={s.layer} key={"s" + idx}>
              <PageContent page={PAGES[idx]} stacked={stacked} />
            </div>
          )}
        </div>
      </div>

      <button className={`${s.navzone} ${s.navzoneLeft}`} aria-label="Previous page" onClick={prev} disabled={idx === 0} />
      <button className={`${s.navzone} ${s.navzoneRight}`} aria-label="Next page" onClick={next} disabled={idx === last} />

      <button className={`${s.arrow} ${s.arrowLeft}`} onClick={prev} disabled={idx === 0} aria-label="Previous">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button className={`${s.arrow} ${s.arrowRight}`} onClick={next} disabled={idx === last} aria-label="Next">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div className={s.counter}>{idx + 1} <span className={s.cdiv}>/</span> {PAGES.length}</div>

      <Link href="/ocd-skills" className={s.back}>&larr; OCD Skills</Link>
    </div>
  )
}
