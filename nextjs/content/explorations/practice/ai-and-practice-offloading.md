---
title: 'When the machine can make the finished thing: AI, offloading, and the reps'
description: >-
  Early studies suggest AI used as an answer machine raises scores during
  practice but lowers what students can do alone afterward. Designed as a tutor,
  it may not.
author: claude
kind: research
domain: AI
period: 2016–2025
maker: >-
  Evan Risko & Sam Gilbert; Hamsa Bastani et al.; Nataliya Kosmyna et al.; Greg
  Kestin et al.
image: >-
  https://upload.wikimedia.org/wikipedia/commons/1/18/Skinner_teaching_machine_01.jpg
image_alt: >-
  Photograph of B. F. Skinner's teaching machine (illustrative), a mahogany box
  with a worn brass top that has a small glass window and, beside it, an opening
  onto a roll of paper.
image_credit: >-
  Silly rabbit, Teaching machine designed by B. F. Skinner, photographed 2008
  (illustrative: an earlier machine built to make students supply answers). CC
  BY 3.0, via Wikimedia Commons
image_page: 'https://commons.wikimedia.org/wiki/File:Skinner_teaching_machine_01.jpg'
order: 70
source_repository: ll-26-27/ll-week-6
source_commit: 5678a7b16701d6efbec15cbeec0357086d3486f0
source_path: apps/web/examples/practice/ai-and-practice-offloading.md
imported_by: codex
imported_on: '2026-10-14'
---
# When the machine can make the finished thing: AI, offloading, and the reps

**Wall label**

Practice means doing the small piece yourself, again and again, until it is yours. Generative AI can now produce the finished piece on request. Psychologists call handing mental work to a tool *cognitive offloading*. It is often sensible: we write lists and set reminders. In a 2025 field experiment, high-school students with an unrestricted chatbot scored higher on practice problems. Later, without it, they scored *lower* than students who never had it. A version built to give hints instead of answers removed most of that harm. The question is not whether to use AI. It is which repetitions you hand to it.

## What it is

**Cognitive offloading** is "the use of physical action to alter the information processing requirements of a task so as to reduce cognitive demand" (Risko & Gilbert, 2016). Examples include tilting your head to read rotated text, writing a shopping list, or asking a phone. Offloading is not bad in itself. It frees capacity for other work. The learning question is narrower. If the step you offload is the step you were supposed to be practising, you have skipped the practice.

This connects to every other entry in this section:

- Deliberate practice requires effortful attempts at your current limit.
- Desirable difficulties require you to retrieve and generate the answer yourself.
- A drill only works if you do the repetitions.

A tool that produces correct output on the first try can remove exactly the struggle these methods depend on. It can also remove the errors that drive learning. That reasoning is our interpretation. The studies below test parts of it.

## What the evidence says

**Bastani et al. (2025), PNAS: field experiment, peer-reviewed.**

- *Design:* nearly 1,000 students at a high school in Turkey were randomly assigned to practise math with one of three set-ups:
  - **GPT Base**, a standard ChatGPT-style interface to GPT-4
  - **GPT Tutor**, GPT-4 with teacher-designed prompts that gave hints rather than answers
  - **no AI** (the control group)
- *Results:*
  - During practice, grades rose 48% with GPT Base and 127% with GPT Tutor.
  - On later exams taken *without* AI, the GPT Base group scored 17% lower than the control group.
  - The GPT Tutor group's negative effect was "largely mitigated."
  - The authors report that GPT Base students often used it as a "crutch," asking for answers.
- *Limits:* one school, one subject, one country, and a tutor design specific to the study.

**Fan et al. (online 2024; issue 2025), *British Journal of Educational Technology*: lab experiment.**

- *Design:* 117 university students did a writing task. They were supported by ChatGPT, a human expert, writing-analytics tools, or nothing.
- *Results:*
  - The ChatGPT group improved their essay scores most.
  - They did *not* differ in knowledge gain or transfer.
  - The authors warn of "metacognitive laziness," meaning dependence on the tool in place of planning and self-monitoring.

**Kosmyna et al. (2025), MIT Media Lab, "Your Brain on ChatGPT": preprint, not peer-reviewed.**

- *Design:* 54 participants wrote essays over three sessions. They used an LLM, a search engine, or nothing. 18 participants returned for a fourth session in which conditions were switched.
- *Results:*
  - EEG showed the weakest brain connectivity in the LLM group.
  - LLM users reported the least ownership of their essays and had trouble quoting what they had just written.
- *Limits:* small sample; EEG connectivity is hard to interpret; not peer-reviewed as of this writing. A comment posted to arXiv (Stanković et al., 2601.00856) raises concerns about sample size, reproducibility and the EEG analysis. Treat it as suggestive only. Its many press headlines claimed far more than the data support.

**Kestin et al. (2025), *Scientific Reports*: randomized trial, Harvard physics, a counterweight.**

- *Design:* undergraduates in an introductory physics course took part in a crossover trial. The study reports 194 students; we took that figure from secondary summaries. Each student had one week's lesson from a custom AI tutor at home and the other week's in an active-learning class. The tutor was built on the same teaching principles as the class: step-by-step scaffolding, prompts to keep students thinking, and feedback.
- *Results:* students "learn[ed] significantly more in less time" with the AI tutor.
- *Point:* AI designed to make students do the thinking is a different tool from AI that hands them the product.

**Summary (interpretation):** the evidence so far is early and comes mostly from math, writing and physics. It points one way. How the AI is designed and what students ask it to do matter more than whether AI is present. Tools that supply answers can raise output and lower learning. Tools that withhold answers and prompt effort can help.

## Optional exercises


The question for any course in this area: **which repetition is the student supposed to own?**

- **AI as sketch partner.** It cheaply generates 20 thumbnails, palettes, layouts or code approaches, *so the student can practise choosing, critiquing and redrawing*. The rep the student owns is judgment, plus the redraw by hand.
- **AI as substitute.** It produces the drawing, paragraph or function the student was meant to produce. The rep the student owns is typing a prompt. Prompting is a skill too, but it is not the skill the exercise was meant to build.

One rep should still be short and done unaided, with the AI used before or after it, not during.

### More ways to try it
- Name the target rep in every assignment ("this week's rep is the ellipse, the topic sentence, the loop"). State whether AI is allowed *for that rep* or only around it.
- Copy the GPT Tutor design. If students use AI during practice, give them a hint-only system prompt, or ask them to request critique, not output.
- Add an unaided check. A short task done without tools, a day or a week later, is the only way to see whether the practice built anything. Bastani et al. found the harm only when AI was taken away.
- Use AI where variation is the point. Generating many alternatives quickly is useful in the sketch stage. Then make students *redraw* the chosen option themselves.

## Sources

1. Risko, E. F., & Gilbert, S. J. (2016). Cognitive offloading. *Trends in Cognitive Sciences, 20*(9), 676–688. https://doi.org/10.1016/j.tics.2016.07.002
2. Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, Ö., & Mariman, R. (2025). Generative AI without guardrails can harm learning: Evidence from high school mathematics. *Proceedings of the National Academy of Sciences, 122*(26), e2422633122. https://doi.org/10.1073/pnas.2422633122 (Correction to an author affiliation: https://doi.org/10.1073/pnas.2518204122)
3. Fan, Y., Tang, L., Le, H., Shen, K., Tan, S., Zhao, Y., Shen, Y., Li, X., & Gašević, D. (2025). Beware of metacognitive laziness: Effects of generative artificial intelligence on learning motivation, processes, and performance. *British Journal of Educational Technology, 56*(2), 489–530. https://doi.org/10.1111/bjet.13544 (online December 2024)
4. Kosmyna, N., Hauptmann, E., Yuan, Y. T., Situ, J., Liao, X.-H., Beresnitzky, A. V., Braunstein, I., & Maes, P. (2025). Your brain on ChatGPT: Accumulation of cognitive debt when using an AI assistant for essay writing task. *arXiv preprint* 2506.08872. https://arxiv.org/abs/2506.08872
5. Stanković, M., Hirche, E., Kollatzsch, S., & Doetsch, J. N. (2026). Comment on: Your brain on ChatGPT. *arXiv preprint* 2601.00856. https://arxiv.org/abs/2601.00856
6. Kestin, G., Miller, K., Klales, A., Milbourne, T., & Ponti, G. (2025). AI tutoring outperforms in-class active learning: An RCT introducing a novel research-based design in an authentic educational setting. *Scientific Reports, 15*, 17458. https://doi.org/10.1038/s41598-025-97652-6
