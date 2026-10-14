---
title: Cinematography language for prompts
description: Turn a filmmaking intention into framing, action, camera motion, light, and sound.
author: codex
order: 2
checked: 2026-10-14
---

# Cinematography language for prompts

Google's [Veo 3.1 guide](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1) organizes a prompt around camera work, subject, action, context, and style or atmosphere. fal's [cinematography skill](https://github.com/fal-ai-community/skills/blob/main/skills/cinematography/SKILL.md) offers another useful ordering, beginning with subject and context. Use either as a checklist for decisions; test the result instead of assuming an order guarantees adherence.

The following are original examples you can adapt to a shot card. Runway's [camera terms with generated examples](https://help.runwayml.com/hc/en-us/articles/47313504791059-Camera-Terms-Prompts-Examples) is a useful visual reference for these distinctions.

| Decision | Example direction | What to inspect |
| --- | --- | --- |
| Framing | A medium shot showing the courier's hands and the workbench. | Can we read the action and the prop? |
| Camera angle | The camera is at the performer's eye height. | Does the perspective agree with the intended point of view? |
| Pan | The camera rotates right from the closed door to the workbench. | Does the view rotate, or does the camera move sideways? |
| Tracking | The camera travels beside the courier as they cross the room. | Does the background shift while the subject remains readable? |
| Push-in | The camera approaches the red case as its lid opens. | Is this spatial movement or just a zoom? |
| Focus | The face is sharp; shelves behind it are softly out of focus. | What is sharp, and does focus remain stable? |
| Light | A window on frame left casts soft light across the face. | Are highlights and shadows consistent? |
| Atmosphere | Dust drifts through the window light. | Does the effect clarify the space or obscure the action? |
| Sound | The latch clicks; a quiet ventilation hum continues underneath. | Is the sound present and timed to the visible event? |

## Start with a shot you can describe

Original still prompt:

```text
Medium shot at eye height: a courier in a charcoal jacket stands behind
a worn workbench, holding a small red case with one brass latch.
A tall window on frame left provides soft daylight. The case and hands
are sharp; the shelving behind them is gently out of focus.
```

Original motion prompt for an approved first frame:

```text
The courier places the case on the bench and opens its single brass
latch. The camera slowly moves closer to the case. The window light
remains steady. The latch makes one click.
```

Change one decision and compare. A close-up of the latch tests different information from a wide shot of the room. If a request for an "85mm feel" matters, also describe the visual relationship you want between subject and background. Treat exact lens and aperture numbers as cues to evaluate, not measurements of the generated scene.

For a first study, one action and one camera movement make the result easier to judge. A sequence with several cuts needs a deliberate shot plan and a model or workflow that supports it. Google's guide also covers dialogue and ambience; include sound only when the selected endpoint supports it. [Source: Veo 3.1 prompting guide](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1).
