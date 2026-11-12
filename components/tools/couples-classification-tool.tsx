"use client"

// Couples Classification Interactive Tool (Olive Clinical).
// Two partners answer 50 questions each; results place them on a
// pursue/withdraw by internalize/externalize map, with profiles and lenses.
// Logic lives in lib/couples-tool/engine.js; this file only renders.

import { Fragment, useCallback, useEffect, useMemo, useState, type CSSProperties } from "react"
import { buildView, decodeShared, initialState } from "@/lib/couples-tool/engine"

type ToolState = ReturnType<typeof initialState>

// The view-model returns inline CSS strings (ported from the design canvas);
// convert them to React style objects once per distinct string.
const styleCache = new Map<string, CSSProperties>()
function css(str: string | undefined): CSSProperties {
  if (!str) return {}
  const hit = styleCache.get(str)
  if (hit) return hit
  const obj: Record<string, string> = {}
  for (const decl of str.split(";")) {
    const i = decl.indexOf(":")
    if (i < 0) continue
    const prop = decl.slice(0, i).trim()
    const value = decl.slice(i + 1).trim()
    if (!prop) continue
    const key = prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    obj[key] = value
  }
  styleCache.set(str, obj as CSSProperties)
  return obj as CSSProperties
}

export function CouplesClassificationTool() {
  const [state, setFull] = useState<ToolState>(initialState)
  const [toolUrl, setToolUrl] = useState("https://oliveclinical.com/couples-tool")

  const set = useCallback((patch: Partial<ToolState>) => {
    setFull((prev) => ({ ...prev, ...patch }))
  }, [])

  // A partner who receives an emailed link lands here with the first
  // partner's answers in the URL hash. Read it after mount (never during
  // render) so server and client markup match.
  useEffect(() => {
    setToolUrl(window.location.origin + window.location.pathname)
    const m = (window.location.hash || "").match(/p1=([^&]+)/)
    if (!m) return
    const shared = decodeShared(m[1])
    if (shared) {
      setFull({ ...initialState(), step: 2, n1: shared.n1, n2: shared.n2, a1: shared.a, fromLink: true })
    }
  }, [])

  // Scroll back to the top of the tool whenever the screen changes.
  useEffect(() => {
    if (typeof window !== "undefined" && state.step !== 0) {
      document.getElementById("couples-tool-top")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [state.step])

  const v: any = useMemo(() => buildView(state, set, toolUrl), [state, set, toolUrl])

  return (
    <div id="couples-tool-top">
<div style={css("position: relative; overflow: hidden; font-family: Geist, system-ui, sans-serif; color: #0b2545; background: #f3f3f3; padding: 72px 24px 80px; box-sizing: border-box; min-height: 100%")}>
<div aria-hidden="true" style={css("position: absolute; top: -110px; right: -80px; width: 280px; height: 280px; border-radius: 9999px; background: #c5a572")}></div>
<div aria-hidden="true" style={css("position: absolute; top: 120px; right: 150px; width: 72px; height: 72px; border-radius: 9999px; background: #c4877e")}></div>
<div aria-hidden="true" style={css("position: absolute; top: 40px; right: 250px; width: 32px; height: 32px; border-radius: 9999px; background: #9fb3b0")}></div>
<div aria-hidden="true" style={css("position: absolute; top: 260px; left: -70px; width: 160px; height: 160px; border-radius: 9999px; background: #9fb3b0")}></div>
<div style={css("position: relative; max-width: 1080px; margin: 0 auto; display: flex; flex-direction: column; gap: 56px")}>
<header style={css("display: flex; flex-direction: column; align-items: center; text-align: center; gap: 18px; max-width: 780px; margin: 0 auto")}>
<p style={css("margin: 0; display: flex; align-items: center; gap: 12px; font-family: Fraunces, Georgia, serif; font-size: 22px; letter-spacing: -.01em")}><span aria-hidden="true" style={css("display: inline-block; width: 28px; height: 1.5px; background: #c5a572")}></span>Olive Clinical<span aria-hidden="true" style={css("display: inline-block; width: 28px; height: 1.5px; background: #c5a572")}></span></p>
<h1 style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-weight: 400; font-size: 60px; line-height: 1.02; letter-spacing: -.025em")}>Couples Classification <em style={css("color: #7a4f6e")}>Interactive Tool</em></h1>
<p style={css("margin: 0; font-size: 18px; line-height: 1.6; max-width: 600px; color: #0b2545")}>Each of you answers 50 quick questions on your own. Then you'll see how your two patterns fit together. This tool was built to be used by two primary partners.</p>
</header>

{v.s0 && (<>
<div style={css("width: 100%; box-sizing: border-box; margin: 0 auto; max-width: 640px; background: #ffffff; border: 1px solid rgba(11,37,69,.18); border-radius: 16px; padding: 32px; display: flex; flex-direction: column; gap: 20px")}>
<p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 26px")}>Who's taking it?</p>
<p style={css("margin: 0; font-size: 15px; line-height: 1.6; color: #5b6e88")}>Names are optional and stay on this screen. Answer separately and without discussing, then compare.</p>
<div style={css("display: flex; flex-wrap: wrap; gap: 16px")}>
<label style={css("flex: 1 1 220px; display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 500")}>Partner 1
<input type="text" value={v.n1} onChange={v.setN1} placeholder="Alex" style={css("height: 44px; padding: 0 12px; border: 1px solid #e1e1e1; border-radius: 6px; background: #f3f3f3; color: #0b2545; font-size: 16px")} /></label>
<label style={css("flex: 1 1 220px; display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 500")}>Partner 2
<input type="text" value={v.n2} onChange={v.setN2} placeholder="Sam" style={css("height: 44px; padding: 0 12px; border: 1px solid #e1e1e1; border-radius: 6px; background: #f3f3f3; color: #0b2545; font-size: 16px")} /></label>
</div>
<button type="button" onClick={v.start} style={css("align-self: flex-start; cursor: pointer; font-size: 15px; font-weight: 600; padding: 12px 22px; min-height: 44px; border-radius: 6px; border: 0; background: #c5a572; color: #0b2545")}>Start with {v.p1}</button>
<p style={css("margin: 0; font-size: 13px; color: #5b6e88")}>A conversation starter, not a diagnostic measure.</p>
</div>
</>)}

{v.quiz && (<>
<div style={css("width: 100%; box-sizing: border-box; margin: 0 auto; max-width: 720px; display: flex; flex-direction: column; gap: 22px")}>
<div style={css("display: flex; flex-wrap: wrap; gap: 12px; align-items: baseline; justify-content: space-between")}>
<p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 30px")}><span style={css(v.who.dot)}></span> {v.who.name}'s turn</p>
<p style={css("margin: 0; font-size: 14px; color: #5b6e88")}>Question {v.cq.num} of {v.total}</p>
</div>
{v.fromLink && (<><p style={css("margin: 0; padding: 12px 16px; border-radius: 10px; background: #e9e9e9; font-size: 15px; line-height: 1.5")}>{v.p1} has finished their part. Answer on your own; your results together appear when you're done.</p></>)}
<div style={css("height: 8px; border-radius: 9999px; background: rgba(11,37,69,.12); overflow: hidden")}><div style={css(v.progress)}></div></div>
<p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 22px; color: #7a4f6e")}>{v.section.title}</p>
<div style={css("background: #ffffff; border: 1px solid rgba(11,37,69,.18); border-radius: 16px; padding: 32px; display: flex; flex-direction: column; gap: 20px; min-height: 260px; box-sizing: border-box")}>
<p style={css("margin: 0; font-size: 14px; color: #5b6e88")}>{v.section.hint}</p>
<p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 28px; line-height: 1.25")}>{v.cq.prompt}</p>
<div style={css("display: flex; flex-direction: column; gap: 10px")}>
{v.cq.opts.map((o,idx_o)=>(<Fragment key={idx_o}>
<button type="button" onClick={o.pick} aria-pressed={o.on} style={css(o.style)}>{o.label}</button>
</Fragment>))}
</div>
</div>
<div style={css("display: flex; flex-wrap: wrap; gap: 12px; align-items: center")}>
<button type="button" onClick={v.prevQ} style={css("cursor: pointer; font-size: 15px; font-weight: 500; padding: 12px 20px; min-height: 44px; border-radius: 6px; border: 1px solid rgba(11,37,69,.25); background: transparent; color: #0b2545")}>Back</button>
{v.canSkipAhead && (<><button type="button" onClick={v.fwdQ} style={css("cursor: pointer; font-size: 15px; font-weight: 500; padding: 12px 20px; min-height: 44px; border-radius: 6px; border: 1px solid rgba(11,37,69,.25); background: transparent; color: #0b2545")}>Next</button></>)}
{v.allDone && (<><button type="button" onClick={v.next} style={css("cursor: pointer; font-size: 15px; font-weight: 600; padding: 12px 22px; min-height: 44px; border-radius: 6px; border: 0; background: #c5a572; color: #0b2545")}>{v.nextLabel}</button></>)}
</div>
</div>
</>)}

{v.sH && (<>
<div style={css("width: 100%; box-sizing: border-box; margin: 0 auto; max-width: 720px; display: flex; flex-direction: column; gap: 20px")}>
<div style={css("display: flex; flex-direction: column; gap: 8px; text-align: center")}>
<p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 32px; line-height: 1.15")}>{v.p1} is done. Now it's {v.p2}'s turn.</p>
<p style={css("margin: 0; font-size: 16px; line-height: 1.6; color: #5b6e88")}>Choose how to hand it off.</p>
</div>
<div style={css("background: #ffffff; border: 1px solid rgba(11,37,69,.18); border-radius: 16px; padding: 28px; display: flex; flex-direction: column; gap: 12px")}>
<p style={css("margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #7a4f6e")}>Option 1</p>
<p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 24px")}>Pass this device to {v.p2}</p>
<p style={css("margin: 0; font-size: 15px; line-height: 1.6")}>Your answers stay hidden on this screen. {v.p2} answers next, and you'll see your results together at the end.</p>
<button type="button" onClick={v.passDevice} style={css("align-self: flex-start; cursor: pointer; font-size: 15px; font-weight: 600; padding: 12px 22px; min-height: 44px; border-radius: 6px; border: 0; background: #c5a572; color: #0b2545")}>{v.p2} is ready</button>
</div>
<div style={css("background: #ffffff; border: 1px solid rgba(11,37,69,.18); border-radius: 16px; padding: 28px; display: flex; flex-direction: column; gap: 14px")}>
<p style={css("margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #7a4f6e")}>Option 2</p>
<p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 24px")}>Email a link to {v.p2}</p>
<p style={css("margin: 0; font-size: 15px; line-height: 1.6")}>{v.p2} takes their part on their own device. The results will appear on {v.p2}'s device when they finish, so plan to look at them together.</p>
<div style={css("background: #e9e9e9; border-radius: 10px; padding: 16px 18px; font-size: 15px; line-height: 1.6")}>Your answers are included in the link. Anyone who opens it, including {v.p2}, could read them, and they will pass through email. If you'd rather keep them private, use Option 1.</div>
<label style={css("display: flex; gap: 10px; align-items: flex-start; font-size: 15px; line-height: 1.5; cursor: pointer; min-height: 44px")}><input type="checkbox" checked={v.consent} onChange={v.toggleConsent} style={css("width: 20px; height: 20px; margin: 2px 0 0; flex: 0 0 auto")} />I understand my answers will be shared in the link.</label>
<label style={css("display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 500; max-width: 420px")}>{v.p2}'s email (optional)
<input type="email" value={v.email} onChange={v.setEmail} placeholder="sam@example.com" style={css("height: 44px; padding: 0 12px; border: 1px solid #e1e1e1; border-radius: 6px; background: #ffffff; color: #0b2545; font-size: 16px; width: 100%; box-sizing: border-box")} /></label>
{v.consent && (<>
<div style={css("display: flex; flex-direction: column; gap: 12px")}>
<a href={v.mailto} style={css("align-self: flex-start; display: inline-flex; align-items: center; text-decoration: none; font-size: 15px; font-weight: 600; padding: 12px 22px; min-height: 44px; box-sizing: border-box; border-radius: 6px; background: #0b2545; color: #f3f3f3")}>Open email</a>
<label style={css("display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 500")}>Or copy the link
<input type="text" readOnly value={v.shareLink} style={css("height: 44px; padding: 0 12px; border: 1px solid #e1e1e1; border-radius: 6px; background: #ffffff; color: #0b2545; font-size: 16px; width: 100%; box-sizing: border-box")} /></label>
</div>
</>)}
{v.noConsent && (<>
<div style={css("display: flex; flex-wrap: wrap; gap: 12px; align-items: center")}>
<button type="button" onClick={v.consentErr} style={css("cursor: pointer; font-size: 15px; font-weight: 600; padding: 12px 22px; min-height: 44px; border-radius: 6px; border: 0; background: #0b2545; color: #f3f3f3")}>Open email</button>
{v.cerr && (<><p role="alert" style={css("margin: 0; font-size: 14px; font-weight: 600; color: #7a4f6e")}>Check the box above first.</p></>)}
</div>
</>)}
</div>
</div>
</>)}

{v.s3 && (<>
<div style={css("display: flex; flex-direction: column; gap: 64px")}>

<div style={css("display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; justify-content: space-between; padding: 20px 24px; background: #ffffff; border: 1px solid rgba(11,37,69,.18); border-radius: 16px")}>
<div style={css("display: flex; flex-wrap: wrap; gap: 12px 16px; flex: 1 1 480px")}>
<label style={css("flex: 1 1 200px; display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 500")}>Partner 1's name
<input type="text" value={v.n1} onChange={v.setN1} placeholder="Alex" style={css("height: 44px; padding: 0 12px; border: 1px solid #e1e1e1; border-radius: 6px; background: #ffffff; color: #0b2545; font-size: 16px; width: 100%; box-sizing: border-box")} /></label>
<label style={css("flex: 1 1 200px; display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 500")}>Partner 2's name
<input type="text" value={v.n2} onChange={v.setN2} placeholder="Sam" style={css("height: 44px; padding: 0 12px; border: 1px solid #e1e1e1; border-radius: 6px; background: #ffffff; color: #0b2545; font-size: 16px; width: 100%; box-sizing: border-box")} /></label>
</div>
<button type="button" onClick={v.retake} style={css("cursor: pointer; font-size: 14px; font-weight: 500; padding: 10px 18px; min-height: 44px; border-radius: 6px; border: 1px solid rgba(11,37,69,.25); background: transparent; color: #0b2545")}>Start over</button>
</div>

<section style={css("display: flex; flex-direction: column; gap: 20px")}>
<div style={css("display: flex; flex-direction: column; gap: 6px")}>
<p style={css("margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #7a4f6e")}>Step 1</p>
<h2 style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-weight: 400; font-size: 34px; line-height: 1.1; letter-spacing: -.02em")}>Where you each land</h2>
</div>
<div style={css("display: grid; grid-template-columns: 96px repeat(2, minmax(0, 1fr)); gap: 12px")}>
<div></div>
<p style={css("margin: 0; text-align: center; font-family: Fraunces, Georgia, serif; font-style: italic; font-size: 22px")}>I move toward</p>
<p style={css("margin: 0; text-align: center; font-family: Fraunces, Georgia, serif; font-style: italic; font-size: 22px")}>I pull away</p>
<p style={css("margin: 0; align-self: center; font-family: Fraunces, Georgia, serif; font-style: italic; font-size: 22px; line-height: 1.1")}>It's on me</p>
<div style={css(v.ip.style)}><p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 24px; font-weight: 600")}>Anxious pursuer</p><p style={css("margin: 0; font-size: 15px; line-height: 1.45")}>"I reach for you and wonder what I did."</p>{v.ip.hasRole && (<><p style={css("margin: 0; font-size: 14px; font-weight: 600")}>This lens: {v.ip.role}</p></>)}{v.ip.hasWho && (<><span style={css("align-self: flex-start; margin-top: auto; font-size: 13px; font-weight: 600; padding: 5px 12px; border-radius: 9999px; background: #0b2545; color: #f3f3f3")}>{v.ip.who}</span></>)}</div>
<div style={css(v.iw.style)}><p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 24px; font-weight: 600")}>Shame withdrawer</p><p style={css("margin: 0; font-size: 15px; line-height: 1.45")}>"I go quiet and feel like I'm failing."</p>{v.iw.hasRole && (<><p style={css("margin: 0; font-size: 14px; font-weight: 600")}>This lens: {v.iw.role}</p></>)}{v.iw.hasWho && (<><span style={css("align-self: flex-start; margin-top: auto; font-size: 13px; font-weight: 600; padding: 5px 12px; border-radius: 9999px; background: #0b2545; color: #f3f3f3")}>{v.iw.who}</span></>)}</div>
<p style={css("margin: 0; align-self: center; font-family: Fraunces, Georgia, serif; font-style: italic; font-size: 22px; line-height: 1.1")}>It's on you</p>
<div style={css(v.ep.style)}><p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 24px; font-weight: 600")}>Critical pursuer</p><p style={css("margin: 0; font-size: 15px; line-height: 1.45")}>"I push, and I tell you what you're doing wrong."</p>{v.ep.hasRole && (<><p style={css("margin: 0; font-size: 14px; font-weight: 600")}>This lens: {v.ep.role}</p></>)}{v.ep.hasWho && (<><span style={css("align-self: flex-start; margin-top: auto; font-size: 13px; font-weight: 600; padding: 5px 12px; border-radius: 9999px; background: #0b2545; color: #f3f3f3")}>{v.ep.who}</span></>)}</div>
<div style={css(v.ew.style)}><p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 24px; font-weight: 600")}>Dismissive withdrawer</p><p style={css("margin: 0; font-size: 15px; line-height: 1.45")}>"I shut the door and wait it out."</p>{v.ew.hasRole && (<><p style={css("margin: 0; font-size: 14px; font-weight: 600")}>This lens: {v.ew.role}</p></>)}{v.ew.hasWho && (<><span style={css("align-self: flex-start; margin-top: auto; font-size: 13px; font-weight: 600; padding: 5px 12px; border-radius: 9999px; background: #0b2545; color: #f3f3f3")}>{v.ew.who}</span></>)}</div>
</div>
<div style={css("margin-left: 108px; border-radius: 12px; background: #0b2545; color: #f3f3f3; padding: 24px 28px; display: flex; flex-direction: column; gap: 8px")}>
<div style={css("display: flex; flex-wrap: wrap; gap: 12px; align-items: baseline; justify-content: space-between")}>
<p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 26px; color: #c5a572")}>{v.name}</p>
<p style={css("margin: 0; font-size: 14px; color: #9fb3b0")}>{v.out}</p>
</div>
<p style={css("margin: 0; font-size: 16px; line-height: 1.625")}>{v.note}</p>
{v.hasCite && (<><p style={css("margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: #9fb3b0")}>Sources: {v.cite}</p></>)}
</div>
</section>

<section style={css("display: flex; flex-direction: column; gap: 20px")}>
<div style={css("display: flex; flex-direction: column; gap: 6px")}>
<p style={css("margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #7a4f6e")}>Step 2</p>
<h2 style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-weight: 400; font-size: 34px; line-height: 1.1; letter-spacing: -.02em")}>Your individual profiles</h2>
</div>
<div style={css("display: flex; flex-wrap: wrap; gap: 20px; align-items: stretch")}>
{v.rs.map((r,idx_r)=>(<Fragment key={idx_r}>
<article style={css("flex: 1 1 420px; min-width: 0; background: #ffffff; border: 1px solid rgba(11,37,69,.18); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column")}>
<div style={css(r.band)}>
<p style={css("margin: 0; font-size: 14px; font-weight: 600")}>{r.name}</p>
<p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 28px; line-height: 1.1")}>{r.label}</p>
<p style={css("margin: 0; font-size: 14px")}>{r.lean}</p>
</div>
<div style={css("padding: 22px 24px; display: flex; flex-direction: column; gap: 20px")}>
<div style={css("display: grid; grid-template-columns: 132px minmax(0, 1fr) 112px; gap: 8px 10px; align-items: center; font-size: 13px")}>
<span style={css("font-weight: 600")}>Reactivity</span><span style={css("height: 10px; border-radius: 9999px; background: rgba(11,37,69,.15); overflow: hidden")}><span style={css(r.reBar)}></span></span><span style={css("font-weight: 600")}>{r.reLevel}</span>
<span style={css("font-weight: 600")}>Regulation</span><span style={css("height: 10px; border-radius: 9999px; background: rgba(11,37,69,.15); overflow: hidden")}><span style={css(r.rgBar)}></span></span><span style={css("font-weight: 600")}>{r.rgLevel}</span>
<span style={css("font-weight: 600")}>Readiness</span><span style={css("height: 10px; border-radius: 9999px; background: rgba(11,37,69,.15); overflow: hidden")}><span style={css(r.chBar)}></span></span><span style={css("font-weight: 600")}>{r.chLevel}</span>
<span style={css("font-weight: 600")}>Insight</span><span style={css("height: 10px; border-radius: 9999px; background: rgba(11,37,69,.15); overflow: hidden")}><span style={css(r.inBar)}></span></span><span style={css("font-weight: 600")}>{r.inLevel}</span>
<span style={css("font-weight: 600")}>Regard</span><span style={css("height: 10px; border-radius: 9999px; background: rgba(11,37,69,.15); overflow: hidden")}><span style={css(r.rpBar)}></span></span><span style={css("font-weight: 600")}>{r.rgLv}</span>
<span style={css("font-weight: 600")}>Conscientiousness</span><span style={css("height: 10px; border-radius: 9999px; background: rgba(11,37,69,.15); overflow: hidden")}><span style={css(r.csBar)}></span></span><span style={css("font-weight: 600")}>{r.csLv}</span>
<span style={css("font-weight: 600")}>Control</span><span style={css("position: relative; height: 10px; border-radius: 9999px; background: rgba(11,37,69,.15)")}><span style={css("position: absolute; left: 50%; top: -2px; width: 2px; height: 14px; background: rgba(11,37,69,.4)")}></span><span style={css(r.ctMark)}></span></span><span style={css("font-weight: 600")}>{r.ctLv}</span>
<span></span><span style={css("display: flex; justify-content: space-between; font-size: 12px")}><span>Under</span><span>Over</span></span><span></span>
</div>
<dl style={css("margin: 0; padding-top: 18px; border-top: 1px solid rgba(11,37,69,.12); display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 10px 14px; font-size: 14px; line-height: 1.5")}>
<dt style={css("font-weight: 600; color: #7a4f6e")}>Regulation</dt><dd style={css("margin: 0")}>{r.reg}</dd>
<dt style={css("font-weight: 600; color: #7a4f6e")}>Readiness</dt><dd style={css("margin: 0")}>{r.ready}</dd>
<dt style={css("font-weight: 600; color: #7a4f6e")}>Insight</dt><dd style={css("margin: 0")}>{r.inDetail}</dd>
<dt style={css("font-weight: 600; color: #7a4f6e")}>Respect</dt><dd style={css("margin: 0")}>{r.respect}</dd>
<dt style={css("font-weight: 600; color: #7a4f6e")}>Follow-through</dt><dd style={css("margin: 0")}>{r.follow}</dd>
<dt style={css("font-weight: 600; color: #7a4f6e")}>Control</dt><dd style={css("margin: 0")}>{r.control}</dd>
</dl>
</div>
</article>
</Fragment>))}
</div>
</section>

<section style={css("display: flex; flex-direction: column; gap: 20px")}>
<div style={css("display: flex; flex-direction: column; gap: 6px")}>
<p style={css("margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #7a4f6e")}>Step 3</p>
<h2 style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-weight: 400; font-size: 34px; line-height: 1.1; letter-spacing: -.02em")}>Look through other lenses</h2>
</div>
<div style={css("background: #ffffff; border: 1px solid rgba(11,37,69,.18); border-radius: 16px; overflow: hidden")}>
<div style={css("display: flex; flex-wrap: wrap; gap: 6px 24px; align-items: baseline; justify-content: space-between; padding: 20px 24px; background: #e9e9e9; border-bottom: 1px solid rgba(11,37,69,.18)")}>
<div style={css("display: flex; flex-direction: column; gap: 4px; flex: 1 1 420px")}>
<p style={css("margin: 0; font-family: Fraunces, Georgia, serif; font-size: 24px")}>Other ways to read it</p>
<p style={css("margin: 0; font-size: 14px; line-height: 1.5")}>Each lens is another theory of the same map. Pick one and the map below shows what it calls each position. Your names stay put.</p>
</div>
<p style={css("margin: 0; font-size: 14px")}>Viewing: <strong style={css("font-weight: 600; color: #7a4f6e")}>{v.name}</strong></p>
</div>
{v.groups.map((g,idx_g)=>(<Fragment key={idx_g}>
<div style={css("display: flex; flex-wrap: wrap; gap: 8px 20px; align-items: center; padding: 14px 24px; border-bottom: 1px solid rgba(11,37,69,.1)")}>
<p style={css("flex: 0 0 170px; margin: 0; font-size: 13px; font-weight: 600; color: #7a4f6e")}>{g.label}</p>
<div style={css("flex: 1 1 360px; min-width: 0; display: flex; flex-wrap: wrap; gap: 6px")}>
{g.items.map((it,idx_it)=>(<Fragment key={idx_it}>
<button type="button" onClick={it.pick} style={css(it.style)}>{it.name}</button>
</Fragment>))}
</div>
</div>
</Fragment>))}
</div>
</section>

</div>
</>)}

<details style={css("border-top: 1px solid rgba(11,37,69,.18); padding-top: 24px")}>
<summary style={css("cursor: pointer; font-family: Fraunces, Georgia, serif; font-size: 20px; min-height: 44px; display: flex; align-items: center")}>References</summary>
<div style={css("display: flex; flex-direction: column; gap: 10px; padding-top: 12px")}>
<p style={css("margin: 0 0 6px; font-size: 14px; line-height: 1.5; color: #5b6e88")}>This tool is a conversation starter that draws on the work below. The quiz itself has not been validated.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Achenbach, T. M. (1966). The classification of children's psychiatric symptoms: A factor-analytic study. <em>Psychological Monographs, 80</em>(7), 1–37.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Ainsworth, M. D. S., Blehar, M. C., Waters, E., &amp; Wall, S. (1978). <em>Patterns of attachment: A psychological study of the strange situation</em>. Erlbaum.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Bartholomew, K., &amp; Horowitz, L. M. (1991). Attachment styles among young adults: A test of a four-category model. <em>Journal of Personality and Social Psychology, 61</em>(2), 226–244.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Bateson, G. (1958). <em>Naven</em> (2nd ed.). Stanford University Press.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Block, J. H., &amp; Block, J. (1980). The role of ego-control and ego-resiliency in the organization of behavior. In W. A. Collins (Ed.), <em>Minnesota Symposia on Child Psychology</em> (Vol. 13, pp. 39–101). Erlbaum.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Bowen, M. (1978). <em>Family therapy in clinical practice</em>. Jason Aronson.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Bowlby, J. (1969). <em>Attachment and loss: Vol. 1. Attachment</em>. Basic Books.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Christensen, A., &amp; Heavey, C. L. (1990). Gender and social structure in the demand/withdraw pattern of marital conflict. <em>Journal of Personality and Social Psychology, 59</em>(1), 73–81.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Costa, P. T., Jr., &amp; McCrae, R. R. (1992). <em>Revised NEO Personality Inventory (NEO PI-R) and NEO Five-Factor Inventory (NEO-FFI) professional manual</em>. Psychological Assessment Resources.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Dicks, H. V. (1967). <em>Marital tensions: Clinical studies towards a psychological theory of interaction</em>. Routledge &amp; Kegan Paul.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Doherty, W. J., Harris, S. M., &amp; Wilde, J. L. (2016). Discernment counseling for “mixed-agenda” couples. <em>Journal of Marital and Family Therapy, 42</em>(2), 246–255.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Gottman, J. M. (1994). <em>What predicts divorce? The relationship between marital processes and marital outcomes</em>. Erlbaum.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Gottman, J. M., &amp; Silver, N. (1999). <em>The seven principles for making marriage work</em>. Crown.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Gross, J. J. (1998). The emerging field of emotion regulation: An integrative review. <em>Review of General Psychology, 2</em>(3), 271–299.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Ickes, W. (1993). Empathic accuracy. <em>Journal of Personality, 61</em>(4), 587–610.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Jacobson, N. S., &amp; Christensen, A. (1996). <em>Integrative couple therapy: Promoting acceptance and change</em>. Norton.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Johnson, S. M. (2004). <em>The practice of emotionally focused couple therapy: Creating connection</em> (2nd ed.). Brunner-Routledge.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Karpman, S. B. (1968). Fairy tales and script drama analysis. <em>Transactional Analysis Bulletin, 7</em>(26), 39–43.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Lerner, H. G. (1985). <em>The dance of anger</em>. Harper &amp; Row.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Lynch, T. R. (2018). <em>Radically open dialectical behavior therapy: Theory and practice for treating disorders of overcontrol</em>. New Harbinger.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Milton, D. E. M. (2012). On the ontological status of autism: The “double empathy problem.” <em>Disability &amp; Society, 27</em>(6), 883–887.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Orlov, M. (2010). <em>The ADHD effect on marriage</em>. Specialty Press.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Prochaska, J. O., &amp; DiClemente, C. C. (1983). Stages and processes of self-change of smoking: Toward an integrative model of change. <em>Journal of Consulting and Clinical Psychology, 51</em>(3), 390–395.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Schnarch, D. (1997). <em>Passionate marriage: Sex, love, and intimacy in emotionally committed relationships</em>. Norton.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Skowron, E. A., &amp; Friedlander, M. L. (1998). The Differentiation of Self Inventory: Development and initial validation. <em>Journal of Counseling Psychology, 45</em>(3), 235–246.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Watzlawick, P., Bavelas, J. B., &amp; Jackson, D. D. (1967). <em>Pragmatics of human communication</em>. Norton.</p>
<p style={css("margin: 0; padding-left: 24px; text-indent: -24px; font-size: 13px; line-height: 1.55")}>Willi, J. (1982). <em>Couples in collusion</em>. Jason Aronson.</p>
</div>
</details>
</div>
</div>
    </div>
  )
}
