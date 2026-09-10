"use client"

import { ScaleAssessment, type ScaleConfig } from "./scale-assessment"

// The RBQ-3 changes its response labels between blocks: frequency counts for the
// motor items, severity for the interest items, and tolerance-of-change wording
// for the sameness items.
const FREQUENCY = [
  { value: 1, label: "Never or rarely" },
  { value: 2, label: "One or more times daily" },
  { value: 3, label: "15+ times daily (at least hourly)" },
  { value: 4, label: "30+ times daily (at least twice hourly)" },
]

const SEVERITY = [
  { value: 1, label: "Never or rarely" },
  { value: 2, label: "Mild or occasional" },
  { value: 3, label: "Marked or notable" },
  { value: 4, label: "Serious or extreme" },
]

const AFFECTS_OTHERS = [
  { value: 1, label: "Never or rarely" },
  { value: 2, label: "Mild or occasional (does not affect others)" },
  { value: 3, label: "Marked or notable (occasionally affects others)" },
  { value: 4, label: "Serious or severe (affects others regularly)" },
]

const TOLERATES_CHANGE = [
  { value: 1, label: "Never or rarely" },
  { value: 2, label: "Mild or occasional (not entirely resistant to change)" },
  { value: 3, label: "Marked or notable (will tolerate changes when necessary)" },
  { value: 4, label: "Serious or severe (will not tolerate any changes)" },
]

const config: ScaleConfig = {
  title: "RBQ-3: Repetitive Behaviour Questionnaire",
  citation: "20-item self-report, v1.3 · Wales Autism Research Centre, Cardiff University",
  instructions: (
    <>
      Individuals of all ages often repeat the same behaviour over and over again, and some engage in
      more repetitive behaviours than others. Please rate the repetitive behaviours you have shown
      over the last two weeks, choosing the most usual way you display each one.
    </>
  ),
  options: FREQUENCY,
  items: [
    { section: "Repetitive motor behaviours", text: "Do you like to arrange items in rows or patterns?" },
    { text: "Do you repetitively fiddle with items? (e.g. spin, twiddle, bang, tap, twist, or flick anything repeatedly)" },
    { text: "Do you spin yourself around and around?" },
    { text: "Do you rock backwards and forwards, or side to side, either when sitting or when standing?" },
    { text: "Do you pace or move around repetitively? (e.g. walk to and fro across a room, or around the same path outside)" },
    { text: "Do you make repetitive hand and/or finger movements? (e.g. flap, wave, or flick hands or fingers repeatedly)" },
    { section: "Restricted interests and sensory focus", text: "Do you have a fascination with specific objects? (e.g. trains, road signs, or other things)", options: SEVERITY },
    { text: "Do you like to look at objects from particular or unusual angles?", options: SEVERITY },
    { text: "Do you have a special interest in the smell of people or objects?", options: SEVERITY },
    { text: "Do you have a special interest in the feel of different surfaces?", options: SEVERITY },
    { text: "Do you have any special objects you like to carry around?", options: SEVERITY },
    { text: "Do you collect or hoard items of any sort?", options: SEVERITY },
    { section: "Insistence on sameness", text: "Do you insist on things at home remaining the same? (e.g. furniture staying in the same place, things being kept in certain places or arranged in certain ways)", options: AFFECTS_OTHERS },
    { text: "Do you get upset about minor changes to objects? (e.g. flecks of dirt on clothes, minor scratches on objects)", options: AFFECTS_OTHERS },
    { text: "Do you insist that aspects of daily routine must remain the same?", options: AFFECTS_OTHERS },
    { text: "Do you insist on doing things in a certain way, or re-doing things until they are “just right”?", options: AFFECTS_OTHERS },
    { text: "Do you play the same music, game, or video, or read the same book repeatedly?", options: TOLERATES_CHANGE },
    { text: "Do you insist on wearing the same clothes, or refuse to wear new clothes?", options: TOLERATES_CHANGE },
    { text: "Do you insist on eating the same foods, or a very small range of foods, at every meal?", options: TOLERATES_CHANGE },
    {
      section: "Choice of activity",
      text: "What sort of activity will you choose if left to occupy yourself?",
      options: [
        { value: 1, label: "A range of different and flexible self-chosen activities" },
        { value: 2, label: "Some varied and flexible interests, but commonly the same activities" },
        { value: 3, label: "Almost always a restricted range of repetitive activities" },
      ],
    },
  ],
  scoringNote: (
    <>
      The questionnaire is scored dimensionally — a higher total reflects more frequent or more
      restrictive repetitive behaviour. The authors publish no cut-off score, so there is no threshold
      to fall above or below.
    </>
  ),
  disclaimer: (
    <>
      The RBQ-3 is a dimensional self-report measure, not a diagnostic instrument, and no total
      constitutes a diagnosis. Scores should be interpreted by a qualified clinician alongside a
      comprehensive evaluation. Repetitive Behaviour Questionnaire-3 (Self), v1.3, Wales Autism
      Research Centre, Cardiff University. Reproduced unaltered under the authors&rsquo; free-use
      terms.
    </>
  ),
}

export function RBQ3() {
  return <ScaleAssessment config={config} />
}
