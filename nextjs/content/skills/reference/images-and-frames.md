---
title: Reference images and frame controls
description: Character references, first frames, and last frames play different roles in a video request.
author: codex
order: 5
checked: 2026-10-14
---

# Reference images and frame controls

An identity reference helps specify who or what appears. A first frame specifies the composition at the beginning of a clip. A last frame specifies where the clip should arrive. A model sheet with several views can help your planning, but sending the whole sheet as a first frame asks the model to begin with that composite image.

Keep approved character and prop views separately. Compose and review the actual scene before using it as a starting frame. If you use an ending frame, check that both frames can belong to the intended action: costume, prop state, light, and viewpoint should change only where the story calls for it.

## Check the exact endpoint

These are examples checked on October 14, 2026, not an interchangeable parameter vocabulary.

| Endpoint on fal | Starting image | Ending image | Schema |
| --- | --- | --- | --- |
| `fal-ai/veo3.1/first-last-frame-to-video` | Required `first_frame_url` | Required `last_frame_url` | [Veo first/last-frame API](https://fal.ai/models/fal-ai/veo3.1/first-last-frame-to-video/api) |
| `bytedance/seedance-2.0/image-to-video` | Required `image_url` | Optional `end_image_url` | [Seedance image-to-video API](https://fal.ai/models/bytedance/seedance-2.0/image-to-video/api) |

The schemas also differ in duration vocabulary: the Veo endpoint lists strings such as `"4s"`, while the Seedance endpoint lists strings such as `"4"` and `"auto"`. A script should validate the selected endpoint's values before submitting. Both documented outputs provide the video URL in `video.url`. [Veo schema](https://fal.ai/models/fal-ai/veo3.1/first-last-frame-to-video/api), [Seedance schema](https://fal.ai/models/bytedance/seedance-2.0/image-to-video/api).

Original planning example:

```text
Character reference: approved courier portrait and full-body view
Prop reference: red case, one brass latch, black handle
First frame: courier holds the closed case above the workbench
Last frame: open case rests on the bench; courier's hands beside it
Motion: place case down, open latch, lift lid
Review: same face, jacket, handle, latch, and light direction
```

Use URLs or uploaded assets in the form the provider accepts; a local filename is not automatically a reachable image URL. A successful request still needs a visual check: inspect whether the transition preserves the things you meant to hold constant. Google's [Veo guide](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1) distinguishes reference-driven ingredients from first/last-frame workflows.
