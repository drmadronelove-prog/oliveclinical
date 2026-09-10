"use client"

import { ScaleAssessment, type ScaleConfig } from "./scale-assessment"

const YES_NO = [
  { value: 1, label: "Yes" },
  { value: 0, label: "No" },
]

const config: ScaleConfig = {
  title: "MMS: Modified Mini Screen",
  citation: "22-item broad psychiatric screen · public domain",
  instructions: (
    <>
      The following questions cover a broad range of experiences. Answer yes or no to each one. The
      screen is designed to flag areas worth exploring further with a clinician rather than to measure
      severity.
    </>
  ),
  options: YES_NO,
  items: [
    { section: "Section A — mood", text: "Have you been consistently depressed or down, most of the day, nearly every day, for the past two weeks?" },
    { text: "In the past two weeks, have you been less interested in most things, or less able to enjoy the things you used to enjoy most of the time?" },
    { text: "Have you felt sad, low, or depressed most of the time for the last two years?" },
    { text: "In the past month, did you think that you would be better off dead, or wish you were dead?" },
    { text: "Have you ever had a period of time when you were feeling up, hyper, or so full of energy or full of yourself that you got into trouble, or that other people thought you were not your usual self? (Do not consider times when you were intoxicated on drugs or alcohol.)" },
    { text: "Have you ever been so irritable, grouchy, or annoyed for several days that you had arguments, verbal or physical fights, or shouted at people outside your family? Have you or others noticed that you have been more irritable or overreacted, compared to other people, even when you thought you were right to act this way?" },
    { section: "Section B — anxiety and trauma", text: "Have you had one or more occasions when you felt intensely anxious, frightened, uncomfortable, or uneasy, even when most people would not feel that way, and did these intense feelings get to be their worst within ten minutes?" },
    { text: "Do you feel anxious or uneasy in places or situations where you might have panic-like symptoms, or where help might not be available or escape might be difficult? (e.g. being in a crowd, standing in a line, being alone away from home, crossing a bridge, travelling in a bus, train, or car)" },
    { text: "Have you worried excessively or been anxious about several things over the past six months?" },
    { text: "Are these worries present most days?" },
    { text: "In the past month, were you afraid or embarrassed when others were watching you, or when you were the focus of attention? Were you afraid of being humiliated? (e.g. speaking in public, eating in public or with others, writing while someone watches, being in social situations)" },
    { text: "In the past month, have you been bothered by thoughts, impulses, or images that you couldn’t get rid of that were unwanted, distasteful, inappropriate, intrusive, or distressing?" },
    { text: "In the past month, did you do something repeatedly without being able to resist doing it? (e.g. washing or cleaning excessively, counting or checking things over and over, repeating, collecting, or arranging things, other superstitious rituals)" },
    { text: "Have you ever experienced, witnessed, or had to deal with an extremely traumatic event that included actual or threatened death or serious injury to you or someone else?" },
    { text: "Have you re-experienced the awful event in a distressing way in the past month? (e.g. dreams, intense recollections, flashbacks, physical reactions)" },
    { section: "Section C — unusual experiences", text: "Have you ever believed that people were spying on you, or that someone was plotting against you, or trying to hurt you?" },
    { text: "Have you ever believed that someone was reading your mind or could hear your thoughts, or that you could actually read someone’s mind or hear what another person was thinking?" },
    { text: "Have you ever believed that someone or some force outside of yourself put thoughts in your mind that were not your own, or made you act in a way that was not your usual self? Or have you ever felt that you were possessed?" },
    { text: "Have you ever believed that you were being sent special messages through the TV, radio, or newspaper? Did you believe that someone you did not personally know was particularly interested in you?" },
    { text: "Have your relatives or friends ever considered any of your beliefs strange or unusual?" },
    { text: "Have you ever heard things other people couldn’t hear, such as voices?" },
    { text: "Have you ever had visions when you were awake, or have you ever seen things other people couldn’t see?" },
  ],
  subscales: [
    { label: "Section A — mood", items: [1, 2, 3, 4, 5, 6] },
    { label: "Section B — anxiety and trauma", items: [7, 8, 9, 10, 11, 12, 13, 14, 15] },
    { label: "Section C — unusual experiences", items: [16, 17, 18, 19, 20, 21, 22] },
  ],
  scoringNote: (
    <>
      The screen counts endorsements rather than grading severity, and publishes no cut-off, so the
      section totals matter more than the overall number. Item 4 asks about thoughts of being better
      off dead; any endorsement is worth raising with a clinician regardless of the total.
    </>
  ),
  disclaimer: (
    <>
      The MMS is a screening tool, not a diagnostic instrument, and no total constitutes a diagnosis.
      Results should be reviewed with a qualified clinician as part of a fuller evaluation. If you are
      having thoughts of harming yourself, please contact your clinician, call or text 988 (Suicide
      &amp; Crisis Lifeline, US), or go to your nearest emergency department. Modified Mini Screen
      (MMS); document is in the public domain.
    </>
  ),
}

export function MMS() {
  return <ScaleAssessment config={config} />
}
