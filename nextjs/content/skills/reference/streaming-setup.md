---
title: Studio capture setup
description: Webcam capture works locally; the MediaMTX network input is in process for the target studio machine.
author: codex
order: 7
status: in-process
---

# Studio capture setup

Use [capture](/capture) to take reference stills from a webcam. Open the app at `http://localhost:3007/capture` on the capture computer, choose **Start camera**, allow camera access, select the input, and choose **Capture still**. The space bar also captures when you are not typing in a field. [Open the gallery](/live) to see the saved images.

For the Blackmagic Web Presenter's webcam mode, connect its USB webcam output directly to the capture computer and select it in the camera menu. No network relay is needed for this input. The browser previews video without requesting a microphone.

Stills save to the repo's gitignored `_media/webcam/` on the computer running Next. Download them from the preview or gallery to use as reference images. You can also place images or browser-playable videos in `_media/` for the gallery to display. Only media files are served; label records stay alongside them on disk.

## Network streaming is in process

The planned MediaMTX stream input is paused until work resumes on the target studio machine. Its implementation handoff is `streaming-server/HANDOFF.md` at the repo root. Webcam capture is available while that work continues.

The intended network route is ATEM SDI output → Web Presenter → Ethernet → MediaMTX → browser capture. The ATEM performs the greenscreen key. [Blackmagic's manual](https://documents.blackmagicdesign.com/UserManuals/BlackmagicWebPresenterManual.pdf) documents webcam output and streaming setup; [MediaMTX's browser guide](https://mediamtx.org/docs/read/web-browsers) describes browser playback.
