---
title: "Challenge: build a set of video prompting skills"
description: Turn filmmaking decisions into reusable skills for references, shots, background plates, and continuity checks.
author: codex
order: 3
---

# Challenge: build a set of video prompting skills

Build a small set of Claude Code skills that helps you direct generated video from the command line. Your aim is recognizable characters, consistent props and places, and control over what changes between shots. A useful skill collects the right inputs, makes a repeatable artifact, and tells you how to judge it. See [what a skill is](intro-to-skills.md), then use the [reference collection](reference/README.md) to research the job you want to teach it.

At the [video station](../activities/rotation-3-ai-video.md), you will also make background plates for a live greenscreen performance. You and your partner will go on the studio stage; the ATEM will combine your performance with the plate. [Capture reference stills](/capture) from a webcam or the Web Presenter's USB webcam output to help match the camera, framing, and light, then [view the gallery](/live). A network stream input is in process.

## Choose the jobs your skills will do

Start with a few connected jobs. These are possible skills to build, rather than a requirement to build every one.

| Possible skill | Inputs | Artifact and judgment |
| --- | --- | --- |
| Character references | Character description, approved images, clothing and distinguishing features | A model sheet plus separate reference images; check face, silhouette, costume, and proportions across views. |
| Prop references | Shape, material, scale, distinctive marks, how the prop is held | A prop sheet and clean views; check that the object remains the same when handled or seen from another angle. |
| Shot planning | Story beat, character and prop references, location | A shot card specifying framing, action, camera movement, light, and what must stay consistent. |
| Still generation and review | Shot card, approved references | Candidate first frames; a person selects or revises one before animating it. |
| Video generation | Approved frame or references, movement plan, chosen endpoint | A validated request, command-line generation, downloaded clip, and record of settings. |
| Background plates | Stage reference, performer position, camera height, light direction | A still or moving environment with usable space for the performer; test its scale and horizon in the ATEM composite. |
| Continuity review | Shot cards, reference images, generated clips | A contact sheet and notes identifying drift in identity, prop, space, light, or action. |

## Work through one scene

1. **Choose a visible action.** For example, a courier places a distinctive red case on a workbench, opens it, and looks inside. Identify the character, case, and workshop before designing the shots.
2. **Build the references.** Capture or generate a character sheet, prop views, and the location. Keep separate images for individual views so you can send the right image to the right model. Save an approved description of the features that should persist.
3. **Plan the shots.** Decide what the viewer needs to see in each shot. Change framing and action deliberately while keeping identity and story facts stable. Use [cinematography language](reference/cinematography.md) to make those decisions concrete.
4. **Create and evaluate stills first.** Check hands, prop geometry, costume, perspective, lighting, and composition. A character sheet is a reference for identity; a first frame is the actual composition you want the video to begin with.
5. **Inspect the chosen video endpoint.** Record its exact name, schema link, and date checked. Determine whether it accepts a first frame, a last frame, character references, sound, or multiple shots. See [reference images and frame controls](reference/images-and-frames.md). Translate the shot plan into the fields that endpoint actually accepts.
6. **Generate from Claude Code or the command line.** Reuse the repo's text and image tools for those stages. Add a video script or use a documented CLI for the selected provider; the existing image script does not submit video requests. Preserve the request, downloaded result, and notes together.
7. **Review the motion.** Watch the whole clip, then compare its beginning, middle, and end with the approved references. Name what drifted and change one relevant decision before trying again.
8. **Teach the process to a skill.** Write down the inputs, steps, stopping points, outputs, and quality checks. Try it on a different character or location to see whether it carries your judgment into a new case.

## A background plate is a shot designed for a performer

Use the [capture tool](/capture) to take a reference of the stage camera's view. Note the camera height, horizon, performer size and position, and the studio's light direction. Design an environment that leaves space for the person you will key into it. A floor, doorway, or workbench can help expose mismatches in scale and perspective.

For your first plate, try a stable camera and a readable environment. If you animate it, decide what moves: distant traffic, steam, or rain might be useful while the camera remains fixed. Preview the plate with your live performance in the ATEM, then revise the image or the studio setup based on what you see. More ideas are in [character references and background plates](reference/characters-and-plates.md).

## Give each skill a clear contract

Use a small `SKILL.md` as the entry point. Put longer prompting notes in `references/` and repeatable commands in `scripts/`. The [origin-story skill](origin-story.md) is an example of coordinating several generation steps.

```text
my-video-skill/
  SKILL.md                  When to use it; inputs; steps; quality bar
  references/
    prompting.md            Source-linked notes for this job
    endpoint.md             Supported fields and date checked
  scripts/
    generate.mjs            Validates inputs and saves the result
```

Include a point where the human approves a still before it becomes a video input. A skill that always generates another candidate needs a clearer stopping rule. A skill that reports success should identify the files it produced and the checks it performed.

## Keep evidence of what you learned

Keep the skill, reference notes with source links, approved images, shot cards, exact requests, results, and a short account of a failed attempt and its revision. Label untested advice as a hypothesis. Optical terms such as focal length and aperture are requests for a visual result in generated media; judge the actual perspective and focus rather than treating the words as proof of a physical camera simulation.

Begin with [fal's skills](reference/fal-skills.md), compare [Higgsfield's controls](reference/higgsfield.md), and consult the [model guide map](reference/model-guides.md) for the model you use. These local reference pages are reading notes and original examples, with links to the upstream guides.
