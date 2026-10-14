---
title: Studio streaming server handoff
description: In-process streaming work to resume in a branch on the target capture machine.
author: codex
status: in-process
updated: 2026-10-14
---

# Studio streaming server — in process

Marlon paused streaming implementation on October 14, 2026. Resume this work in a branch after cloning the repo to the target machine. This folder is a handoff; no Node streaming launcher or MediaMTX configuration has been implemented yet. No streaming server is running on the current machine.

## Working now

- `nextjs/app/capture/` opens a webcam using `getUserMedia`, selects a camera, and captures full-resolution JPEG stills. This includes the Blackmagic Web Presenter's USB webcam output when connected directly to the browser's computer.
- `nextjs/app/api/capture/route.js` saves to the repo's gitignored `_media/webcam/`, with a label sidecar.
- `/live` shows images and browser-playable videos under `_media/` and refreshes every five seconds; `/media/...` serves files with range support.
- Rotation 3 and the video prompting challenge both link to `/capture`.
- The greenscreen composite is made live in the studio's ATEM. The web app provides references and capture, not keying.

## Requested next

Build a small Node app here that launches MediaMTX in the foreground with an explicit LAN host/interface and prints consistent publishing and playback addresses. Add a MediaMTX input to the existing capture page, keeping webcam selection and capture. A remote browser's still must save on the machine running Next, through the same capture API, and appear in `/live`.

Target signal chain:

```text
Stage camera + generated background → ATEM key/program
  → SDI → Web Presenter HD/4K → Ethernet
  → MediaMTX on target machine → WebRTC/WHEP → /capture
  → JPEG → _media/ → /live
```

The target machine is another computer, not the current Mac. The Web Presenter model and firmware have not been confirmed. Prefer a wired, reachable local network for Web Presenter, relay, and clients. Same-subnet Ethernet is the simple setup; campus Wi-Fi client isolation/VLANs can block reachability even when devices are in the same building.

## Protocol decisions to verify

- Enable SRT UDP 8890 and RTMP TCP 1935 as ingest options; WebRTC signaling uses TCP 8889 and media typically UDP 8189. Enable TCP ICE fallback deliberately if needed. RTSP 8554 is useful for ffmpeg diagnostics.
- Choose H.264 for browser compatibility; H.265 varies by browser. H.264 streams containing B-frames can also fail WebRTC playback. MediaMTX relays media; it does not transcode it automatically.
- Silent capture only is sufficient today. Web Presenter AAC audio does not match MediaMTX's browser WebRTC audio codecs; a video-only receiver can avoid an audio-transcoding step. Add AAC→Opus via ffmpeg only if WebRTC sound is requested later.
- For a proposed path `live/web-presenter`, RTMP server `rtmp://HOST:1935/live` plus key `web-presenter` should produce that path. Native MediaMTX SRT uses a complete stream ID such as `publish:live/web-presenter`. Verify what the Web Presenter's firmware actually sends; do not assume its Key field is a verbatim SRT stream ID. Blackmagic XML stream-id items may use a different representation.
- WHEP address: `http://HOST:8889/live/web-presenter/whep`. Standalone MediaMTX test player: `http://HOST:8889/live/web-presenter`.
- Advertise the target machine's LAN IP through `webrtcAdditionalHosts` and allow the relevant ports through its firewall. Never put `localhost` in the Web Presenter's destination: that means the Web Presenter itself.
- Do not promise a universal SRT-vs-RTMP latency ranking. Measure end-to-end delay; SRT buffer, encoder settings, network, and playback all contribute. HLS can be a later fallback with more latency.

## Setup documentation still needed

1. Installation/start/stop commands for the Node launcher and a pinned MediaMTX binary or an existing install. Latest release observed during research: v1.21.2; recheck on the target machine. Keep downloaded binaries and generated config in ignored `bin/` and `.runtime/`.
2. List interfaces and choose the machine's reachable LAN address; print publish, player, and WHEP URLs.
3. Connect SDI from ATEM to Web Presenter and Ethernet to the same reachable network as the relay. Set DHCP or a suitable static address.
4. In Blackmagic Web Presenter Setup (newer software may call it Blackmagic Streaming Setup), select the device, open Live Stream, and configure Custom URL/H.264 or load a custom XML. Supply exact server/key settings. The official XML format requires profiles as well as the server URL; generate a complete file, not a server-only fragment. Verify import on the actual model before claiming hardware success.
5. Set On Air; inspect MediaMTX logs and the standalone test player before troubleshooting the Next app.
6. Allow remote relay host configuration in the app; account for HTTPS→HTTP mixed-content blocking and camera secure-context requirements separately.

## Code to reuse

- Capture kit: `ll-26-27/ll-kits`, `kits/capture/`. Its still canvas, camera picker, and gallery are the source of the current minimal webcam version.
- Week 5: `ll-26-27/ll-week-5-capture`, `nextjs/app/components/StreamPlayer.jsx`, `nextjs/lib/grab.mjs`, and `relay/start-relay.sh`. The player demonstrates WHEP and HLS. Improve async cancellation, peer cleanup, and WHEP session deletion when adapting it.
- Current capture: `nextjs/app/capture/CaptureCamera.jsx`; storage/gallery: `nextjs/lib/media.mjs`. Keep the existing still API/gallery rather than making another storage system.

## Sources inspected

- [MediaMTX browser reading and JavaScript integration](https://mediamtx.org/docs/read/web-browsers)
- [MediaMTX WebRTC compatibility and networking](https://mediamtx.org/docs/features/webrtc-specific-features)
- [MediaMTX configuration](https://github.com/bluenviron/mediamtx/blob/main/mediamtx.yml)
- [Blackmagic Web Presenter manual](https://documents.blackmagicdesign.com/UserManuals/BlackmagicWebPresenterManual.pdf): Live Stream tab, printed pp. 15–16; XML format, pp. 56 onward.
- [Blackmagic Streaming Processors manual](https://documents.blackmagicdesign.com/UserManuals/BlackmagicStreamingManual.pdf): setup and current XML format.

Hardware streaming and its latency remain untested. Finish those tests on the target machine with the actual encoder.
