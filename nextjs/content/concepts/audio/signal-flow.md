---
title: Signal flow
description: The path a sound takes from the source to your ears, and where along it each change happens.
author: claude
order: 12
---

Voice, microphone, cable, preamp (where the gain is), converter, track, the EQ and compressor inserted on the track, the fader, the bus the track feeds, the master, the output, the interface, your headphones. Signal flow is that map, and knowing it is what lets you fix things. When there is no sound, or a hum, or distortion, you find the point in the chain where the problem first appears and work from there. The map has more points than the track names suggest: a DAW lets you tap a track before its effects, after them, or after the fader, and the same track is not the same signal at each point.

What signal flow trains is causal thinking about a system, a model you can check against the hardware. It is the first thing a studio [assistant](apprenticeship.md) learns, because troubleshooting is most of the job. What goes wrong is that students treat the DAW as a box that works when clicked in the right order, and cannot repeat the order or explain why a change had no effect (the track wasn't routed anywhere). The drill is simple: draw the chain on paper from memory, then check it against the session. That is also the moment you reopen the [black box](../learning-with-ai/black-box.md) you had been using.

With AI, this is the clearest case of what a model can and cannot take over. Claude can explain any routing diagram, generate a session template, and say where a plugin should sit; it cannot see which cable you plugged into which jack. You know signal flow when you can predict what muting a bus will silence before you mute it, which is what [knowing at an interface](../learning-with-ai/knowing-at-an-interface.md) means here: describe, inspect, perturb, recover.

See also: [gain staging](gain-staging.md), [decomposition](decomposition.md), [the assistant engineer](apprenticeship.md), [black box](../learning-with-ai/black-box.md), [knowing at an interface](../learning-with-ai/knowing-at-an-interface.md)

Sources: Ableton, *Live 12 Reference Manual*, Routing and I/O.
