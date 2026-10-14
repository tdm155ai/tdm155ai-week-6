---
title: Model prompting guide map
description: Source links for Veo, Kling, Seedance, and Runway, with questions to bring to each guide.
author: codex
order: 4
checked: 2026-10-14
---

# Model prompting guide map

Choose a guide for the model and mode you are actually using. Read the examples, then inspect the provider's endpoint schema. A model family can have separate endpoints for text-to-video, image-to-video, reference images, and first/last frames.

| Resource | Read it for |
| --- | --- |
| [Google: Ultimate prompting guide for Veo 3.1](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1) | Camera language, subject and action, dialogue and sound, and workflows using reference images or start/end frames. |
| [Kling AI prompt guide](https://kling.ai/blog/kling-ai-prompt-guide) | Scene direction, framing and camera motion, reference consistency, and structured multi-shot examples. |
| [ByteDance: Seedance 2.0](https://seed.bytedance.com/en/seedance2_0/) | The model maker's overview of multimodal reference inputs. For implementation, pair it with your provider's API documentation. |
| [fal: Seedance 2.0 image-to-video API](https://fal.ai/models/bytedance/seedance-2.0/image-to-video/api) | Exact starting/ending image fields and other accepted parameters for this particular endpoint. |
| [Runway: Prompting Guides & Examples](https://help.runwayml.com/hc/en-us/sections/47313458960403-Prompting-Guides-Examples) | A guide index to revisit when selecting a Runway model or mode. |
| [Runway: Text to Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/47313737321107-Text-to-Video-Prompting-Guide) | Clear visual and motion descriptions, gradual refinement, and timing cues. The page identifies Gen-4.5 as its current target. |
| [Runway: Camera Terms, Prompts, & Examples](https://help.runwayml.com/hc/en-us/articles/47313504791059-Camera-Terms-Prompts-Examples) | Visual examples to compare framing, camera movement, and composition. |

## Questions for your reference notes

- Is the advice for text-to-video, image-to-video, or editing existing video?
- Which parts describe appearance, and which describe motion?
- How are character, prop, and location references supplied?
- Are timings approximate prompt cues or structured parameters?
- What is an example of failure, and what would you change to test it?

Runway's text-to-video guide does not prescribe an ideal word count. It recommends clear descriptions and refinement, and notes that timestamp prompting guides timing without perfect precision. Keep your skill's advice scoped to a model and mode instead of imposing one prompt length on every generator. [Source: Runway text-to-video guide](https://help.runwayml.com/hc/en-us/articles/47313737321107-Text-to-Video-Prompting-Guide).

For Seedance, this collection uses the accessible ByteDance overview and fal's API schema. It does not treat an unverified copy of a separate March 2026 prompting guide as an official source.
