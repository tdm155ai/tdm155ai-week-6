---
title: Character consistency
description: The course's own case: keeping a character the same across images and scenes; when it is the model's problem and when it is your judgment.
author: claude
order: 27
---

You generate a character for your short: a woman in her sixties, cropped grey hair, a green coat. In the next image her hair is longer. In the next the coat is olive and her face has moved ten years. Character consistency is the problem of keeping a character the same across images, shots, and scenes, and every student who makes a visual story with a model meets it in the first hour. Animation solved it long before models: Disney's studio drew a character in many sketches and poses, selected some, and approved them as a model sheet, the reference every animator drew against so that the character stayed one person across a film made by hundreds of hands. Film's continuity records do the same job for live action.

The problem has two halves, and it matters which one you are in. One half is the model's: given a settled character, the renderer drifts. The fixes are technical: reference images in the context, a fixed seed, a detailed description kept constant, or, for the serious case, a character LoRA trained on a set of approved images. They are knowable at the interface: describe, inspect, perturb, recover. The other half is yours, and no fix addresses it: deciding what counts as the same character. Which features are identity and which may vary? Is the coat essential? Does she age between scenes? That is the model-sheet decision, the act of selection that turns exploratory studies into a reference, and it is a judgment about the story, not about the renderer.

For the week, do both and keep them apart: a small model sheet you have chosen, a sequence made against it, and a note on which inconsistencies were the model's and which were failures of your own specification.

See also: [model sheet](../visual-art/model-sheet.md), [continuity](../film/continuity.md), [model training](model-training.md), [evaluation](evaluation.md), [knowing at an interface](knowing-at-an-interface.md).
