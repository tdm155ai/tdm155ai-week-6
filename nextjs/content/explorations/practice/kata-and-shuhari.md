---
title: 'Kata and shuhari: forms you repeat until you can leave them'
description: >-
  Martial arts teach through set forms repeated for years. Programmers borrowed
  the idea as the "code kata." Shuhari names the stages of learning a form.
author: claude
kind: method
domain: martial arts
period: 18th century (shuhari); 2003 (code kata)
maker: Japanese arts traditions; Kawakami Fuhaku (attributed); Dave Thomas
image: >-
  https://upload.wikimedia.org/wikipedia/commons/7/78/Gichin_Funakoshi_-_Heian_Nidan_%28Yoi%29.png
image_alt: >-
  Black-and-white photograph of Gichin Funakoshi in a white karate uniform,
  standing in the ready position at the start of a kata.
image_credit: >-
  Gichin Funakoshi in the ready position (yoi) of the kata Heian Nidan, from
  Rentan Goshin Karate Jutsu (1925), p. 61. Public domain, via Wikimedia
  Commons.
image_page: >-
  https://commons.wikimedia.org/wiki/File:Gichin_Funakoshi_-_Heian_Nidan_(Yoi).png
order: 50
source_repository: ll-26-27/ll-week-6
source_commit: 5678a7b16701d6efbec15cbeec0357086d3486f0
source_path: apps/web/examples/practice/kata-and-shuhari.md
imported_by: codex
imported_on: '2026-10-14'
---
# Kata and shuhari: forms you repeat until you can leave them

**Wall label**

A *kata* is a fixed sequence of movements. A karate student performs the same form thousands of times, often for years. No real fight follows that script. The form exists to build the movements into the body. *Shuhari* names three stages: *shu*, keep the form exactly; *ha*, break it and vary it; *ri*, leave it and act freely. Around 2003 the programmer Dave Thomas borrowed the word for "code kata." These are short exercises you solve again and again, because, he wrote, "the goal is the practice, not the solution."

## What it is

**Kata** (型 or 形, "form, pattern") are prearranged sequences practised solo or in pairs. They appear in karate, judo, kendo and iaido, and also in tea ceremony, calligraphy and Noh. A form fixes everything except the quality of execution. Each performance is therefore a repetition with only one variable: how well you do it.

**Shuhari** (守破離) describes the arc of learning a form:

- **Shu (守, protect/keep):** copy the teacher's form exactly. Do not improvise.
- **Ha (破, break):** vary the form, test its limits, and learn from other teachers.
- **Ri (離, leave):** leave the form behind. You act freely, and what you do still contains the form.

**Code kata.** Dave Thomas, co-author of *The Pragmatic Programmer*, posted a series of small programming exercises on his blog, starting around 2003. Some sources date his use of the term to 1999, but we could not confirm that. Examples include supermarket pricing, a binary search ("Karate Chop") written five different ways, and anagrams. He wrote that each is "a short exercise (perhaps 30 minutes to an hour long)," and that "the point of the kata is not arriving at a correct answer." The idea spread to "coding dojos," which Laurent Bossavit and Emmanuel Gaillot presented at the XP2005 conference.

## What the evidence says

**Documented:**

- Kata are central to how Japanese martial arts are taught and examined. Gichin Funakoshi's 1925 karate manual (image above) presents kata photographically, posture by posture.
- Dave Thomas's code kata texts are online at codekata.com. A blog post by Simon Willison from August 2003 links to them, so they were online by then.

**Origin of shuhari (contested, so be careful):**

- English sources often credit the phrase to the 16th-century tea master Sen no Rikyū. That claim rests on a verse in the *Rikyū dōka*, a collection of verses composed by later followers to pass on his teaching.
- Some sources trace it to the Noh playwright Zeami. This appears to be a confusion with his different three-part concept, *jo-ha-kyū*.
- The earliest documented statement of all three stages is usually credited to the Edo-period tea master **Kawakami Fuhaku** (1716–1807), in writings known as *Fuhaku hikki*.

We could not check the primary text or its date. Treat "an 18th-century tea-ceremony formulation, later adopted by martial arts and then by software" as the most defensible short version.

**Research:** we found no controlled studies of kata training as such. Interpretation: kata combine two ideas the research supports. One is fixed, repeated practice of one well-specified sequence. The other is a planned move to variation and free use (*ha*, *ri*, and sparring), which fits research on varied and interleaved practice (see *Desirable difficulties*).

## Optional exercises


- **In karate:** one kata, often 20–60 seconds long, performed start to finish. Sometimes a single section is drilled on its own.
- **In code:** one small, well-defined problem (30–60 minutes, by Thomas's estimate). It is solved again on another day, or in a different style, or under a new constraint.

The problem stays the same, so the only thing that changes between repetitions is you.

### More ways to try it
- Give every studio or lab a "house kata": one small problem everyone solves at the start of each session for several weeks. Examples include a typographic lockup, a paper fold, a sorting function, or a 6-panel thumbnail sequence.
- Use shuhari explicitly. Week 1: follow the reference exactly. Week 2: change one constraint. Week 3: make it your own, and say what you kept.
- Time the kata and keep the timings. Speed is not the goal, but timings plotted across weeks show internalization that students cannot easily see for themselves.
- Discourage looking up the answer. As Thomas says, the solution is not the point.

## Sources

1. Thomas, D. *CodeKata* (collected kata and essays, originally posted c. 2003). http://codekata.com/ ; see especially "Kata, Kumite, Koan, and Dreyfus," http://codekata.com/kata/kata-kumite-koan-and-dreyfus/
2. Willison, S. (2003, August 27). Code Kata. https://simonwillison.net/2003/Aug/27/codeKata/
3. Funakoshi, G. (1925). *Rentan Goshin Karate Jutsu* (錬胆護身唐手術). Tokyo. Image via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Gichin_Funakoshi_-_Heian_Nidan_(Yoi).png
4. "Shuhari." *Wikipedia*. https://en.wikipedia.org/wiki/Shuhari (for the commonly repeated attributions; its sourcing is thin).
5. 田中成幸 (Tanaka Masayuki). 「守破離の提唱者は世阿弥でも利休でもないよ、という話。」 *note*. https://note.com/mass3behappy/n/n8e3d417c4942 (argues for Kawakami Fuhaku; quotes *Fuhaku hikki*; a secondary, non-scholarly source).
6. "Kata (programming)." *Wikipedia*. https://en.wikipedia.org/wiki/Kata_(programming) (for the XP2005 Bossavit–Gaillot coding dojo; it also says the term was used in 1999, which we could not confirm).
