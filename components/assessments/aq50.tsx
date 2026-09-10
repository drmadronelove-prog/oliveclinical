"use client"

import { ScaleAssessment, type ScaleConfig } from "./scale-assessment"

const OPTIONS = [
  { value: 1, label: "Definitely Agree" },
  { value: 2, label: "Slightly Agree" },
  { value: 3, label: "Slightly Disagree" },
  { value: 4, label: "Definitely Disagree" },
]

// The AQ keys each item rather than summing it: an agreeing answer scores a
// point on these items, a disagreeing answer scores on all the others.
const AGREE_SCORE_ITEMS = new Set([
  2, 4, 5, 6, 7, 9, 12, 13, 16, 18, 19, 20, 21, 22, 23, 26, 31, 33, 35, 39, 41, 42, 43, 45, 46,
])

const config: ScaleConfig = {
  title: "AQ-50: Autism Spectrum Quotient",
  citation: "50-item screening questionnaire · Baron-Cohen et al., 2001",
  instructions: (
    <>
      For each statement, choose the response that best describes how strongly it applies to you.
      There are no right or wrong answers.
    </>
  ),
  options: OPTIONS,
  scoreItem: (num, raw) => {
    const isAgree = raw === 1 || raw === 2
    return AGREE_SCORE_ITEMS.has(num) ? (isAgree ? 1 : 0) : isAgree ? 0 : 1
  },
  scoreRange: { min: 0, max: 50 },
  items: [
    { text: "I prefer to do things with others, rather than on my own." },
    { text: "I prefer to do things the same way over and over again." },
    { text: "If I try to imagine something, I find it very easy to create a picture in my mind." },
    { text: "I frequently get so strongly absorbed in one thing that I lose sight of other things." },
    { text: "I often notice small sounds when others do not." },
    { text: "I usually notice car number plates or similar strings of information." },
    { text: "Other people frequently tell me that what I've said is impolite, even though I think it is polite." },
    { text: "When I'm reading a story, I can easily imagine what the characters might look like." },
    { text: "I am fascinated by dates." },
    { text: "In a social group, I can easily keep track of several different people's conversations." },
    { text: "I find social situations easy." },
    { text: "I tend to notice details that others do not." },
    { text: "I would rather go to a library than to a party." },
    { text: "I find making up stories easy." },
    { text: "I find myself drawn more strongly to people than to things." },
    { text: "I tend to have very strong interests, which I get upset about if I can't pursue." },
    { text: "I enjoy social chitchat." },
    { text: "When I talk, it isn't always easy for others to get a word in edgewise." },
    { text: "I am fascinated by numbers." },
    { text: "When I'm reading a story, I find it difficult to work out the characters' intentions." },
    { text: "I don't particularly enjoy reading fiction." },
    { text: "I find it hard to make new friends." },
    { text: "I notice patterns in things all the time." },
    { text: "I would rather go to the theatre than to a museum." },
    { text: "It does not upset me if my daily routine is disturbed." },
    { text: "I frequently find that I don't know how to keep a conversation going." },
    { text: "I find it easy to \"read between the lines\" when someone is talking to me." },
    { text: "I usually concentrate more on the whole picture, rather than on the small details." },
    { text: "I am not very good at remembering phone numbers." },
    { text: "I don't usually notice small changes in a situation or a person's appearance." },
    { text: "I don't know how to tell if someone listening to me is getting bored." },
    { text: "I find it easy to do more than one thing at once." },
    { text: "When I talk on the phone, I'm not sure when it's my turn to speak." },
    { text: "I enjoy doing things spontaneously." },
    { text: "I am often the last to understand the point of a joke." },
    { text: "I find it easy to work out what someone is thinking or feeling just by looking at their face." },
    { text: "If there is an interruption, I can switch back to what I was doing very quickly." },
    { text: "I am good at social chitchat." },
    { text: "People often tell me that I keep going on and on about the same thing." },
    { text: "When I was young, I used to enjoy playing games involving pretending with other children." },
    { text: "I like to collect information about categories of things (e.g. types of cars, birds, trains, plants)." },
    { text: "I find it difficult to imagine what it would be like to be someone else." },
    { text: "I like to carefully plan any activities I participate in." },
    { text: "I enjoy social occasions." },
    { text: "I find it difficult to work out people's intentions." },
    { text: "New situations make me anxious." },
    { text: "I enjoy meeting new people." },
    { text: "I am a good diplomat." },
    { text: "I am not very good at remembering people's date of birth." },
    { text: "I find it very easy to play games with children that involve pretending." },
  ],
  thresholds: [
    { at: 26, label: "Elevated range (26–31) — associated with autistic traits", color: "text-nav-amber" },
    { at: 32, label: "Above research threshold (32+) — consistent with elevated autistic traits", color: "text-nav-coral" },
  ],
  disclaimer: (
    <>
      The AQ-50 is a screening tool, not a diagnostic instrument. A score above threshold does not
      constitute a diagnosis. Scores should be interpreted by a qualified clinician in conjunction
      with a comprehensive evaluation. Baron-Cohen, S., Wheelwright, S., Skinner, R., Martin, J., &amp;
      Clubley, E. (2001). The Autism-Spectrum Quotient (AQ). <em>Journal of Autism and Developmental
      Disorders, 31</em>(1), 5&ndash;17.
    </>
  ),
}

export function AQ50() {
  return <ScaleAssessment config={config} />
}
