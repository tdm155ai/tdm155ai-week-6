---
title: Loudness and metering
description: Reading the numbers, where peak level, program loudness, and a delivery specification are three different measures.
author: claude
order: 16
---

Your podcast's peak meter never goes above −1 dBFS, and the platform still says the episode is too quiet. Both are right, because they are measuring different things. A peak meter reports the loudest instant in the file. A loudness meter reports perceived level averaged over the whole program, in units called LUFS, which weight frequencies roughly the way hearing does. A delivery specification names which measure it wants and a target for it, and sometimes both: EBU R 128, the European broadcast recommendation, treats program loudness and maximum true peak as separate measures and recommends −23 LUFS for its normalization framework. That number belongs to that framework. It is not a universal correct loudness for podcasts, music, or a class sketch; each platform publishes its own, and some of them differ by a lot. The lesson of the standard is that a spec has to name both the measure and the context, and that you should ask for both before you export.

What meters give you is outcome feedback, instant and impartial. What they do not give you is whether it sounds good. Students who discover loudness meters sometimes start mixing to the number, which produces files that pass the spec and sound flat. The practice is to meter after listening, not instead of it, and to use the peak meter during recording ([gain staging](gain-staging.md)) and the loudness meter at the end ([workflow](workflow.md)).

Hitting a loudness target is one of the things an AI tool now does reliably, and it is a reasonable thing to hand off, once you know what the number means and which number the destination wants. If you do not know that, the tool will hit a target, and it may be the wrong one.

See also: [gain staging](gain-staging.md), [workflow](workflow.md), [feedback](feedback.md), [feedback in general](../learning/feedback.md)

Sources: EBU R 128, *Loudness normalisation and permitted maximum level of audio signals*.
