---
title: Who used to make this?
description: A headcount of the people behind a web app and a cinematic short, before one person with a prompt could produce a convincing version of either.
author: shared by Marlon
order: 1
---

# Who Used to Make This?

*A headcount of the people behind a web app and a cinematic short, before one person with a prompt could produce a convincing version of either.*

---

## Part 1: A full-stack web app (c. 2010–2022)

Imagine a modest product: a web app where users sign up, log in, upload things, pay for a subscription, and get email notifications. Here is who typically touched it.

### Figuring out what to build
| Role | What they did |
|---|---|
| Founder / product owner | Decided the app should exist and what problem it solved |
| Product manager | Turned the vision into prioritized features, wrote specs and user stories |
| UX researcher | Interviewed users, ran usability tests, found out what people actually needed |
| Business / data analyst | Defined metrics, pricing assumptions, what "success" meant |

### Designing it
| Role | What they did |
|---|---|
| UX / interaction designer | Wireframes, user flows, information architecture |
| UI / visual designer | Color, type, components, the design system |
| Content strategist / UX writer | Button labels, error messages, onboarding copy |
| Accessibility specialist | Screen-reader support, contrast, keyboard navigation (often skipped) |

### Building it
| Role | What they did |
|---|---|
| Front-end engineer(s) | HTML/CSS/JavaScript, React or similar, responsive layouts |
| Back-end engineer(s) | Server logic, APIs, authentication, payments integration |
| Database engineer / DBA | Schema design, migrations, query performance |
| Mobile engineer(s) | If there was an iOS/Android companion app, usually separate people for each |
| Tech lead / architect | Chose the stack, made structural decisions, reviewed code |

### Keeping it running and safe
| Role | What they did |
|---|---|
| DevOps / infrastructure engineer | Servers, cloud config, deployment pipelines, CI/CD |
| Site reliability engineer | Monitoring, uptime, getting paged at 3 a.m. |
| Security engineer | Threat modeling, penetration testing, patching vulnerabilities |
| QA / test engineer | Manual and automated testing, regression suites, bug reports |

### Coordinating, explaining, and protecting
| Role | What they did |
|---|---|
| Engineering manager / scrum master | Sprints, standups, unblocking people |
| Technical writer | API docs, help center, internal documentation |
| Legal / privacy counsel | Terms of service, privacy policy, GDPR/compliance |
| Customer support | Turned user complaints into bug tickets |

### Rough headcounts
- **Scrappy startup MVP:** 3–6 people, each wearing four or five of the hats above. Typically 3–9 months.
- **Agency build for a client:** 8–15 people across design, dev, QA, and project management.
- **Established company product team:** 15–50+ people, often more once you count shared platform, security, and legal teams.

### The invisible crowd
Even a solo developer in 2015 wasn't really alone. Every app sat on top of the unpaid or underpaid labor of **open-source maintainers** (frameworks, libraries, databases), **Stack Overflow answerers**, **tutorial and documentation writers**, and **people who filed bug reports**. That accumulated public record is a large part of what code-generating models were trained on. "Vibe coding" doesn't remove these people; it compresses them into the model.

---

## Part 2: A cinematic short (c. 2000–2023)

Imagine a 2–3 minute narrative piece or high-end commercial spot: a few locations, a couple of actors, a night exterior, some light visual effects, an original score. Here is who it took.

### Development and producing
| Role | What they did |
|---|---|
| Writer | Script |
| Director | Creative vision, performance, shot choices |
| Producer / executive producer | Money, schedule, hiring, the whole thing actually happening |
| Line producer | Budget line by line, vendors, payroll |
| Production coordinator | Paperwork, call sheets, logistics |

### Pre-production
| Role | What they did |
|---|---|
| Storyboard artist | Drew the shots in advance |
| Casting director | Found the actors |
| Location scout / manager | Found places, secured permits, dealt with neighbors |
| Production designer | Overall look of the world |
| Art director, set decorator, props master | Built and dressed the spaces, sourced every object on screen |
| Costume designer + wardrobe | Clothing, continuity of clothing |

### On set: camera
| Role | What they did |
|---|---|
| Director of photography (DP) | Lighting and camera design, the "cinematic" look itself |
| Camera operator | Physically operated the camera |
| 1st assistant camera (focus puller) | Kept things sharp, a full-time job at shallow depth of field |
| 2nd assistant camera | Slate, lenses, media, camera reports |
| DIT (digital imaging technician) | Data backup, on-set color, checking footage |
| Steadicam / drone operator | Specialty movement |

### On set: light, rigging, and movement
| Role | What they did |
|---|---|
| Gaffer + electricians | Built the lighting the DP designed |
| Key grip + grips | Rigging, flags, diffusion, safety |
| Dolly grip | Pushed the dolly so camera moves landed exactly |
| Generator operator | Power for night exteriors |

### On set: everything else
| Role | What they did |
|---|---|
| 1st and 2nd assistant directors | Ran the schedule, ran the set |
| Script supervisor | Continuity: which hand held the cup, which line was cut |
| Production sound mixer + boom operator | Clean dialogue |
| Hair and makeup | Faces, continuity of faces |
| Actors, background extras, stand-ins | The people in the frame |
| Stunt coordinator, safety officer | If anything moved fast or caught fire |
| Production assistants, drivers, catering, craft services | Nothing happens without them |

### Post-production
| Role | What they did |
|---|---|
| Editor + assistant editor | Built the film from hours of footage |
| VFX supervisor, compositors, 3D artists | Sky replacements, cleanup, anything that couldn't be shot |
| Colorist | The final "look" |
| Sound designer, foley artist, dialogue editor | Built the sound world, footsteps, ambience |
| Re-recording mixer | Final mix |
| Composer / music supervisor | Score or licensed music |
| Title / motion graphics designer | Titles and credits |

### Plus the businesses behind the businesses
Equipment rental houses, insurance brokers, permit offices, post houses, payroll companies, film commissions.

### Rough headcounts
- **Student / micro-budget short:** 8–20 people, mostly volunteers, many doubling up.
- **Professional indie short:** 25–50 people across all phases.
- **National commercial spot (30–60 sec.):** 50–100+ people, often for a one- or two-day shoot.
- **Hollywood feature (for scale):** read the end credits. Hundreds to thousands.

---

## Part 3: What collapsed into what

Tools like Seedance and Higgsfield (video), and agentic coding tools (software), don't eliminate these functions. They absorb many of them into a single interface. A useful way to read any AI-generated work is to ask which of these roles the model performed, and how well.

| Function | Who used to do it | Where it goes now |
|---|---|---|
| Camera movement, lens choice, lighting | DP, camera op, gaffer, grips | A prompt or a preset ("dolly in," "anamorphic," "golden hour") |
| Sets, props, locations, costume | Production design, art dept., locations | The model's latent sense of "what a scene like this looks like" |
| Performance | Actors, director | Generated faces and bodies, steered by text |
| Boilerplate code, wiring, config | Front-end, back-end, DevOps engineers | Agentic coding tools |
| Testing, security, accessibility | QA, security, a11y specialists | **Often nowhere.** This is where AI-built things break. |
| Taste, judgment, "is this good?" | Director, product owner, editor | **Still you.** |

The roles most easily absorbed are the ones with the clearest conventions, the most examples in training data, and the most visible outputs. The roles least absorbed tend to be the ones whose work is invisible when done right: continuity, security, safety, testing, and saying no.

---

## Questions to bring to class

1. Pick one role from each list. What specific knowledge did that person carry that never appears on screen or in the code? Does a model have access to it?
2. When one person now does the work of forty, what happens to the *collaboration*: the arguments, the second opinions, the person who catches your mistake?
3. Many of these roles were entry points: PA, 2nd AC, junior developer, QA tester. If those jobs shrink, how does anyone become a DP or a tech lead?
4. Which role on these lists do you most want to be? Which ones are you now being asked to be, all at once?
