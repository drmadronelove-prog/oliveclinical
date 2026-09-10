"use client"

import { ScaleAssessment, type ScaleConfig } from "./scale-assessment"

const OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Slightly Disagree" },
  { value: 4, label: "Slightly Agree" },
  { value: 5, label: "Agree" },
  { value: 6, label: "Strongly Agree" },
]

const config: ScaleConfig = {
  title: "POPS: Pathological Obsessive-Compulsive Personality Scale",
  citation: "49-item measure across five factors · Pinto, Ansell & Wright, 2019",
  instructions: (
    <>
      The statements below describe attitudes, opinions, interests, feelings, and behaviors that
      people may experience. Choose the response that best describes the way you usually are. Please
      respond to every statement, even if you are not completely sure of your answer. Read each
      statement carefully, but don&rsquo;t spend too much time deciding on any one answer. Some
      statements are similar to each other — answer each one on its own, without concern for your
      other answers.
    </>
  ),
  options: OPTIONS,
  reverseItems: [19, 25],
  items: [
    { text: "I get lost in the details." },
    { text: "I never let someone else do something because they almost always do it incorrectly." },
    { text: "I tend to keep my emotions to myself." },
    { text: "When someone crosses me, I make sure to get revenge." },
    { text: "I hate changing my plans at the last minute." },
    { text: "I get upset when my day's schedule is disrupted." },
    { text: "My need to be perfect affects how much I get done." },
    { text: "I often have to take over others' responsibilities to make sure that the job is done right." },
    { text: "I spend too much time on something in order to get it just right." },
    { text: "I try to convince others of what I believe to be right and wrong." },
    { text: "People are either with me or they are against me." },
    { text: "I have been told I am inconsiderate of others." },
    { text: "I punish those who deserve it." },
    { text: "Expressing emotions usually leads to embarrassment." },
    { text: "I am easily upset by changes in my routine." },
    { text: "I have trouble dealing with unforeseen events." },
    { text: "I have trouble with last minute changes." },
    { text: "I often miss the deadlines I set for myself." },
    { text: "I trust others to carry out tasks competently." },
    { text: "I tend to take on more tasks because counting on others is useless." },
    { text: "Other people say that I am argumentative." },
    { text: "I get angry when others try to change my mind." },
    { text: "I have difficulty adapting to change." },
    { text: "Others say that I am closed minded." },
    { text: "I am happy to let others help me in my work." },
    { text: "I am a stubborn person." },
    { text: "I often spend too much time getting organized." },
    { text: "I rarely feel comfortable showing affection toward others." },
    { text: "I hold back my feelings." },
    { text: "It is difficult for me to show my feelings to others." },
    { text: "People think I am being critical whenever I give them advice." },
    { text: "I insist that others do things my way." },
    { text: "People tell me that I am inflexible." },
    { text: "Others have told me I am demanding in my relationships." },
    { text: "When working in a group, I find that I end up doing most of the work." },
    { text: "People have described me as being closed with my feelings." },
    { text: "I will put off a task if I do not think I can do it perfectly." },
    { text: "People say I am critical of the way they do things." },
    { text: "It is hard for me to shift from one task to another." },
    { text: "I end up doing a lot of jobs myself because no one can live up to my standards." },
    { text: "People say that I dismiss points of view that differ from my own." },
    { text: "There are few people who can meet my expectations." },
    { text: "It really irritates me when people don't stick to the plan." },
    { text: "I frequently need extensions on deadlines." },
    { text: "It takes longer for me to complete a task to my high standards." },
    { text: "I get caught up in the details no matter what I'm doing." },
    { text: "I put pressure on myself to get things just right." },
    { text: "It is difficult for me to relate to other people's emotions." },
    { text: "I am hard on myself when I am unable to complete a task to my high standards." },
  ],
  // Item 39 is deliberately shared between maladaptive perfectionism and
  // difficulty with change, per the scale's scoring instructions.
  subscales: [
    { label: "Rigidity", items: [4, 10, 11, 12, 13, 21, 22, 24, 26, 31, 32, 33, 34, 38, 41] },
    { label: "Emotional overcontrol", items: [3, 14, 28, 29, 30, 36, 48] },
    { label: "Maladaptive perfectionism", items: [1, 7, 9, 18, 27, 37, 39, 44, 45, 46, 47, 49] },
    { label: "Reluctance to delegate", items: [2, 8, 19, 20, 25, 35, 40, 42] },
    { label: "Difficulty with change", items: [5, 6, 15, 16, 17, 23, 39, 43] },
  ],
  scoringNote: (
    <>
      Items 19 and 25 are reverse-scored. Item 39 counts toward both maladaptive perfectionism and
      difficulty with change, so the factor item counts sum to more than 49 while the total counts
      each item once.
    </>
  ),
  disclaimer: (
    <>
      The POPS is a dimensional self-report measure, not a diagnostic instrument, and the source
      publishes no cut-off score — a higher total does not constitute a diagnosis of
      obsessive-compulsive personality disorder. Scores should be interpreted by a qualified clinician
      alongside a comprehensive evaluation. Pathological Obsessive-Compulsive Personality Scale (POPS)
      &copy; 2019 by Anthony Pinto, PhD, Emily B. Ansell, PhD, and Aidan G. C. Wright, PhD, in Grant,
      J. E., Chamberlain, S. R., &amp; Pinto, A. (Eds.), <em>Obsessive-Compulsive Personality
      Disorder</em>. American Psychiatric Association Publishing. All rights reserved.
    </>
  ),
}

export function POPS() {
  return <ScaleAssessment config={config} />
}
