# React Bits effects

SplashCursor, Strands, and GhostCursor are adapted from https://github.com/DavidHDev/react-bits/tree/main/src/ts-tailwind/Animations (retrieved 2026-10-06).

Copyright (c) 2026 David Haz. The upstream MIT + Commons Clause license is included in LICENSE.react-bits.md.

Local changes: SplashCursor is confined to its parent frame, uses local pointer coordinates, starts without requiring a mouse event, and cleans up listeners, its animation loop, and allocated WebGL resources. Strands observes its parent size. Ghost respects its parent’s CSS positioning. In `graphic-tools-for-blue`, one source canvas is captured at 30 fps and passed as a MediaStream to the same-origin display window; this copy has no display window, so `LiveEffect` is used without `onStream`. Effects sit behind the graphic text on black. Static PNG export continues to use the original graphic renderer and does not include live effects.

Splash uses an opaque WebGL context, opaque shader output, and disables display blending when transparency is off. This avoids alpha unpremultiplication/color differences during canvas-to-video capture.

Strands and Ghost also use opaque canvas/output paths on the black stage. Ghost’s final pass preserves composed RGB instead of unpremultiplying to translucent color. The effect host has an explicit stacking layer below the graphic.
