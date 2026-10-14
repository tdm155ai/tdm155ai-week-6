---
title: Reopening the box
description: Breakdown as the moment the box opens; studying a tool by perturbing it and inspecting what changes.
author: claude
order: 9
---

Latour's example is a slide projector. While it works, the audience sees a lecture; nobody sees the projector. When the bulb goes, the projector appears, and so do its parts, the person who knows how to change the bulb, and the shelf where the spares are kept. Black boxing is reversible, and breakdown is what reverses it. Anyone who has watched a build fail at the one step they had never looked at knows the feeling: the layer you had been allowed to ignore is suddenly the only thing in the room.

You can wait for breakdown or arrange it. The study is this: take a working command, a working skill, a working prompt, and in a copy, break one thing on purpose. Change a field name, delete a reference image, remove a line from the SKILL.md. Trace the failure only far enough to find and fix it, then write down which layer mattered and why the layers below it did not. That record is a defensible answer to "how much do I need to know," specific to a task, which is the only form the answer comes in. The gentler version is perturbation without breaking: change one input, predict the effect on one property of the output, inspect the intermediate thing (the storyboard, the transcript, the generated code), and see if the prediction held. What goes wrong is overshooting, reading everything because you are now anxious about everything; and asking the model to explain its own failure and taking the explanation as the cause. A model's account of itself is a hypothesis to test, not a diagnosis.

This is the étude for understanding a tool. It is small, it repeats, and it leaves you able to see something you could not see before: the shape of the box.

See also: [black box](black-box.md), [knowing at an interface](knowing-at-an-interface.md), [studies for an agent](studies-for-an-agent.md), [harness](harness.md), [feedback](../learning/feedback.md).

Sources: Bruno Latour, "On Technical Mediation."
