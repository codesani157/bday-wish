# Birthday Reveal — Product Requirements Document v2.0
### "A World Built for One Person"

---

## 1. The New Product Philosophy

The original Birthday Reveal was a scheduled greeting card. Version 2 is something fundamentally different: a **physics-powered, spatially-aware birthday universe** built entirely for one person and experienced as a genuine act of discovery.

The philosophical shift comes from a question: what makes Bruno Simon's 3D portfolio genuinely unforgettable? It is not the information it contains. It is the fact that you have to **physically move through it**. You drive. You collide. You discover. The content becomes secondary to the act of exploration. The interface itself is the experience.

Birthday Reveal v2 applies this thinking to one of the most emotionally significant moments in a person's year. The recipient does not read a birthday message — they **unwrap a world built for them**. The sender does not fill a form — they **build a gift**.

This is not cosmetic. It is a product-level architectural decision: **interaction is the medium, and physics is the language**.

---

### The Central Metaphor: The Gift Universe

Every Birthday Reveal experience lives inside what we call a **Gift Universe** — a spatially and physically simulated birthday environment tied to one specific recipient. The sender constructs it. The recipient discovers it. Everything inside follows physical rules: it has weight, it responds to touch, and it rewards curiosity.

Where v1 sent a page, v2 delivers a place.

---

## 2. Product Summary

Birthday Reveal is a scheduled, physics-powered birthday experience creator. A sender builds a personalized birthday world for someone they care about. That world is delivered by email on the recipient's birthday and experienced through a browser-based interactive reveal — driven by gesture, touch, and physical interaction — that feels closer to unwrapping a real gift than reading a webpage.

The product remains intentionally one-to-one: one world, one recipient, one birthday, one unforgettable moment.

---

## 3. Problem Statement

Most digital birthday experiences fail in one of two ways:

**Too low-effort:** A text, a generic e-card, or a quick social post. Forgettable by noon.

**Too high-effort:** A custom video, a handcrafted website, or an elaborate surprise that requires design skills, time, and manual follow-up.

The gap is a space where effort is **meaningful but accessible** and where the output is emotionally resonant, not just technically impressive.

Birthday Reveal v2 closes this gap by making the act of **creation** feel as satisfying as physical gift-wrapping, and the act of **receiving** feel as exciting as physically tearing one open.

The deeper problem it addresses is that digital experiences lack **physical weight**. They are frictionless to the point of being emotionally weightless. Receiving a birthday text has no moment. No ceremony. No gravity. By introducing physics, spatial design, and gesture-driven interaction, Birthday Reveal gives digital moments the sense of occasion they deserve — the kind of occasion people remember.

---

## 4. Target Users

### Primary Sender
A thoughtful person aged 16–40 who wants their birthday wish to feel genuinely personal — not just another notification. They are willing to spend 10–15 minutes building something meaningful if the result is visually and emotionally impressive. They will open this on their laptop, build something, and trust the system to deliver it at the right moment.

### Secondary Sender
Someone with a history of forgetting birthdays who wants a reliable, automated system they can trust to deliver something beautiful on time — because they scheduled it weeks in advance.

### Recipient
Someone who receives a private birthday link and is immediately pulled into an experience designed for them alone — requiring no account, no signup, no prior context. Their barrier to entry is a single tap. Their reward is a world.

### Ideal Early Use Cases
- Romantic partners building a year-in-memories reveal
- Best friends scheduling a midnight surprise weeks in advance
- Siblings creating a nostalgic childhood-photo world
- Long-distance families bridging the physical gap
- Last-minute builders who need something beautiful, fast

---

## 5. Core Product Principles

These replace the original v1 principles and reflect the new philosophy.

### 1. Every moment should feel earned.
Nothing appears passively. Content reveals itself through interaction and gesture. The recipient must discover their birthday — they cannot simply scroll it.

### 2. Physics gives meaning to moments.
When confetti bounces off the bottom of the screen, it feels real. When a gift shakes in response to a tap, anticipation builds. Physics is not decoration — it is the emotional engine of the experience. A particle that collides with a boundary communicates something a CSS animation never can.

### 3. The sender builds; the recipient discovers.
Two distinct emotional journeys sharing one artifact. Senders feel the satisfaction of assembly and intention. Recipients feel the delight of discovery and surprise. These experiences are designed separately, optimized separately, and equally important.

### 4. Automation is trust.
Scheduled delivery is not a feature — it is the core product promise. Timing is emotional. A birthday message arriving at midnight feels magical. One arriving three days late feels like an afterthought. The system must be obsessively reliable. Every edge case around delivery is a product-level priority.

### 5. Depth rewards curiosity.
The minimum interaction delivers the sender's message. But the recipient who taps more, explores more, and lingers longer finds more. Easter eggs, hidden reactions, and secondary content reward engagement without ever requiring it.

### 6. Performance is emotional respect.
A beautiful experience that freezes on a mid-range Android is a broken experience. Physics simulations must be adaptive. The reveal should be emotionally impactful on every device a real recipient might use — not just on a developer's MacBook Pro.

### 7. One person, one world.
Each Gift Universe is not a template reused for everyone. The recipient's name is woven into the environment. Their photos occupy their specific positions. Their music threads through their space. The personalization is structural, not cosmetic.

---

## 6. The Experience Pillars
*(Bruno Simon's design language, translated into Birthday Reveal)*

### Pillar 1: The Pre-Load and Boot Sequence
A physics-powered birthday world cannot render until its assets exist in the browser. Like Bruno Simon's portfolio, Birthday Reveal uses a **pre-load sequence** that blocks rendering until the world is ready. Rather than hiding this, the product makes it part of the experience: a softly animated loading screen with birthday atmosphere plays while assets download. Once loaded, a **cinematic camera swoop** carries the recipient into their world — giving them a sweeping view of the scene before handing over control. This is not a spinner. It is a curtain rising.

### Pillar 2: Physical Interaction as Primary Interface
The recipient does not scroll a webpage. They interact with objects. The gift responds to touch. Wrapping paper peels away with a swipe. Photos are pinned to surfaces they can tap. Messages unfurl from inside an envelope. The interface is gesture- and physics-driven, not form-and-scroll-driven. This is the single most important experiential shift from v1.

### Pillar 3: Baked Atmosphere, Live Physics
The background environment — lighting, scenery, ambient detail — is beautiful and pre-rendered for performance, like baked lighting in Bruno's world. The interactive layer — the gift itself, confetti, floating photos, reactive elements — runs live physics simulation in the browser. Static things are perfect and still. Dynamic things are alive.

### Pillar 4: Camera Cinematography
The reveal experience has a **camera** — not just a viewport. The camera lerps (smoothly interpolates) between states. When the recipient opens a photo, the camera gently moves closer. When the celebration triggers, it pulls back to reveal the full confetti eruption. The camera tells the story. This gives Birthday Reveal a cinematic quality that no standard webpage can replicate, because it requires intention in how space is framed.

### Pillar 5: Depth Rewards Exploration
Like Bruno's sacrificial portal, his hydraulics Easter egg, and his horn — Birthday Reveal has hidden interactions. A shake gesture triggers a mini confetti burst at any moment. A tap-and-hold on a photo plays a subtle pulse animation. There may be a hidden note tucked into the corner of the scene. The recipient who explores more gets more. Discovering something unannounced is its own form of celebration.

### Pillar 6: Adaptive Performance Scaling
On load, the system detects device capability. High-end devices get full physics simulation and particle effects. Mid-tier devices get simplified physics with canvas-based particles. Low-end or accessibility-preference devices get a beautiful, non-physics reveal using CSS. Performance scaling is automatic, invisible, and never makes the experience feel broken — only appropriately tuned.

---

## 7. Core User Flows

### Flow 1: The Builder — Sender Creates a Gift Universe

1. **Landing**: Sender arrives at the homepage — a lightly interactive 3D scene where a gift floats in space, reacting to cursor or finger movement. It establishes the product's nature before a word is read.
2. **Entry**: Sender taps "Build a Birthday" and enters their email. Magic link sent. Sender authenticated.
3. **Step 1 — The Recipient**: Enter recipient name, email, birthdate, timezone. Minimal form. Maximum clarity. A live preview shows the recipient's name appearing in the World scene as it's typed.
4. **Step 2 — The World**: Choose a themed Gift Universe. Each World is previewed as an animated scene thumbnail — not a color swatch. The sender can watch the World in motion before selecting.
5. **Step 3 — The Assembly Canvas**: Enter the Gift Builder. Drag-and-drop photos onto a visual gift-building surface. Write a message that appears on a visible digital card in the preview. Add a music link. Enable the Memory Gate if desired. The canvas updates live as content is added — the gift visually fills as the sender builds.
6. **Step 4 — The Preview Run**: The sender experiences the full recipient journey in a sender-mode preview. The camera swoops, physics runs, music fades in. The sender sees exactly what their recipient will experience — not a static mockup, but the live thing.
7. **Step 5 — The Seal**: Confirm delivery date and time. A cinematic sealing animation plays — the gift wraps, folds, and locks with the delivery date pressed into it. This moment is deliberate, satisfying, and memorable. It marks the completion of an intentional act.
8. **Dashboard**: The sender lands on their dashboard. Their sealed gift sits, glowing, waiting for its moment.

### Flow 2: Automated Birthday Delivery

1. On the recipient's birthday at the scheduled UTC-normalized time, the background worker sends the birthday email.
2. The email design matches the chosen World — it is themed, beautiful, and minimal. Not a notification. An invitation.
3. The subject line and preview text are personal and intentional, not template-generated.
4. If delivery fails, the system logs the failure and immediately surfaces it to the sender with a recovery path.

### Flow 3: The Discovery — Recipient Opens the Gift Universe

1. **The Email**: Recipient receives the birthday email. It is visually distinct and themed. The call to action is singular: "Open your gift."
2. **Pre-Load**: A softly animated birthday loading screen appears with the World's ambient atmosphere. Assets load behind the scene. A progress indicator is visible but unobtrusive.
3. **The Swoop**: The camera sweeps into the World. The recipient sees their name woven into the environment. This takes approximately two seconds and establishes a sense of arrival.
4. **The Sealed Gift**: A beautifully wrapped gift sits in the scene. It bounces gently when tapped. The recipient is invited to unwrap it.
5. **Unwrapping**: The recipient swipes to unwrap. Wrapping paper peels away with physics — it falls, bounces, settles. Layer by layer, the gift opens.
6. **Layer 1 — The Greeting**: The headline message emerges with a camera zoom and a gentle entrance animation.
7. **Optional Memory Gate**: If the sender enabled it, a playful prompt appears before further content unlocks.
8. **Layer 2 — The Message**: The full personal message unfolds in a paced, scroll-driven reveal. Each paragraph breathes.
9. **Layer 3 — The Memories**: Photos emerge as if pinned or placed in the scene. The recipient swipes through them. Each can be tapped to expand. Each has a moment.
10. **Layer 4 — The Music**: Music gradually fades in as the recipient progresses deeper. It reaches full volume at the celebration threshold.
11. **The Celebration**: A physics-based confetti eruption fills the screen. Particles bounce off screen boundaries. The recipient's name is displayed at peak size. This is the emotional apex.
12. **The Replay**: A quiet prompt invites the recipient to replay or revisit any section. The world remains. It does not close.

Recipient events — opened, prompt passed, completed — are reported to the sender's dashboard in near-real time.

### Flow 4: Sender Manages a Gift

1. Sender accesses the dashboard via magic link re-authentication.
2. Dashboard shows all gifts by status: Draft, Sealed, Delivered, Opened, Completed.
3. Sealed gifts approaching their delivery date gain a visual urgency indicator — a subtle pulse — mirroring how a real deadline feels.
4. Sender can edit content before the cutoff window.
5. Post-delivery, sender sees recipient engagement status: whether the gift was opened, whether the Memory Gate was passed, whether the celebration state was reached.
6. Sender can duplicate any past gift as a starting point for a new one.

---

## 8. The World System
*(Themes, reinvented as spatially distinct environments)*

In v1, themes were color palettes. In v2, **Worlds** are fully realized spatial environments with distinct physics behaviors, particle effects, ambient audio characteristics, and lighting identities. The choice of World is a meaningful creative decision, not a cosmetic one.

---

### MVP Worlds (3 for launch, 1 stretch):

**The Starlight Loft**
A warm attic space with wooden beams and string lights. Low gravity. Gold and silver star-shaped confetti. Ambient vinyl-crackle undertone. Isometric camera angle. The gift is wrapped in midnight-blue paper with a gold ribbon. This World is timeless, warm, and romantic. Best for: partners, close friends, intimate celebrations.

**The Midnight Garden**
A dark, atmospheric outdoor scene lit by floating lanterns and drifting fireflies. The gift rests on a stone surface. Flowers bloom as the reveal progresses. Particles are petals and firefly sparks. The reveal is slower and more cinematic. Camera angle is slightly lower and more dramatic. Best for: romantic gestures, poetic personalities, anyone who appreciates the beautiful and the quiet.

**The Arcade Cabinet**
A retro-inspired scene with pixel-art 3D geometry and a saturated color palette. The gift is wrapped in cartridge-style packaging. Physics are exaggerated and bouncy — high restitution. Confetti is pixel-shaped. The celebration triggers a chiptune fanfare. Camera angle is slightly overhead with a mild perspective distortion. Best for: gaming enthusiasts, nostalgic friendships, playful personalities.

**The Cloud Terrace** *(Stretch MVP)*
A bright, elevated space above the clouds. Gifts float gently. Gravity is lowered — confetti drifts upward and sideways. Colors are white, pale gold, and sky blue. Music is airy. Best for: optimistic, light-hearted celebrations and daytime birthday opens.

---

### World System Rules:
- Each World defines a gravity value, restitution coefficient, particle type, and particle density for the celebration state.
- Each World has a matching email design template — the themed experience begins in the inbox.
- Each World has a unique camera sweep sequence for the entry moment.
- Each World has a defined ambient audio texture (separate from the sender's music link).
- The sender's World choice must feel cohesive from email → loading → reveal → celebration. No mismatches between these states.

---

## 9. The Physics and Interaction Model

This section defines the physical vocabulary of the recipient experience.

### Gesture Dictionary

| Gesture | Action | Physics Response |
|---|---|---|
| Single tap | Acknowledge / nudge | Object bounces with spring damping |
| Swipe up | Advance reveal / unwrap layer | Peeling or lift motion with friction simulation |
| Swipe horizontal | Navigate photos | Momentum-preserving carousel with deceleration |
| Tap and hold | Trigger special interaction | Subtle vibration / pulse feedback |
| Shake (mobile) | Easter egg trigger | Mini confetti burst anywhere in the flow |
| Pinch / expand | Photo zoom | Smooth scale with inertia, gravity snap-back |

### Physical Parameters per World

Each World defines:
- **Gravity value** — affects confetti fall speed and arc
- **Restitution (bounciness)** — affects particle collision with screen boundaries
- **Damping coefficient** — how quickly motion settles after impact
- **Particle density** — number of confetti pieces triggered at celebration state
- **Minimum interaction duration** — the floor for how long any physics response lasts, preventing instant snapping

### Interaction Principles:
- No response should feel instant. Every physics reaction has a minimum duration that makes it feel real, not programmatic.
- Objects retain their changed state. A gift that has been unwrapped stays unwrapped. A photo that has been viewed remains accessible.
- The recipient cannot break the experience. Extreme or rapid gestures are handled gracefully — they may trigger an exaggerated but playful response rather than an error.
- The experience is never gated behind gesture accuracy. Imprecise swipes are interpreted generously.

---

## 10. The Emotional Journey Map

The recipient experience is designed as an emotional arc. Every design and engineering decision should be tested against this arc.

| Stage | Emotion Target | Mechanism |
|---|---|---|
| Email arrival | Curiosity | Themed, beautiful email with just enough mystery |
| Pre-load | Anticipation | Atmospheric birthday scene, soft ambient audio |
| Camera swoop | Wonder | Cinematic entry into the World |
| Seeing the sealed gift | Excitement | The gift bounces gently on tap, clearly alive |
| Unwrapping | Delight | Physical gesture, satisfying physics, wrapping falling away |
| Reading the message | Tenderness | Paced reveal, personal language, space to breathe |
| Seeing the photos | Nostalgia | Gentle photo physics, each image its own small moment |
| Music building | Warmth | Audio fades in naturally to full volume at celebration |
| Celebration state | Joy | Physics confetti, name prominent, particles filling the screen |
| Replay | Contentment | The world remains, accessible, unhurried |

---

## 11. Feature List

### MVP Features

**Sender Experience**
- Magic-link passwordless authentication (no passwords, no friction)
- Gift Builder canvas with drag-and-drop photo placement and live visual preview
- Preview updates in real time as the sender types, uploads, or changes settings
- 3 World themes with animated, in-motion preview thumbnails
- Custom headline, long-form personal message, optional music URL
- Optional Memory Gate: sender sets a question and normalized answer
- Pre-scheduling preview run: full recipient experience in sender mode
- Cinematic "sealing" animation on scheduling confirmation
- Sender dashboard with gift status (Draft, Sealed, Delivered, Opened, Completed)
- Dashboard visual urgency indicator for gifts delivering within 24 hours
- Email notification to sender when recipient opens the gift
- Edit access until defined cutoff before delivery
- Duplicate any gift as a new draft
- Auto-save throughout the builder flow

**Recipient Experience**
- Themed birthday email with World-matched design
- Pre-load sequence with atmospheric birthday visual and progress indicator
- Cinematic camera swoop entry into the Gift Universe
- Physics-based gift wrapping with swipe-to-unwrap gesture
- Paced, scroll/swipe-driven reveal of message and photos
- Adaptive physics: full simulation on capable devices, canvas-based on mid-tier, CSS on low-tier
- Music URL fade-in tied to reveal progression, with visible manual play fallback
- Physics-based confetti celebration with screen-boundary particle collision
- Recipient name woven into the scene environment
- Optional Memory Gate with playful failure handling and auto-bypass after threshold
- Easter egg: shake gesture triggers mini confetti burst at any time
- Replay capability from celebration state

**System**
- Scheduled delivery worker with UTC-normalized send times
- Unique signed reveal token per gift
- Event tracking: opened, prompt passed, reveal completed
- Sender notification on delivery failure with recovery path
- Mobile-first recipient experience across all three physics tiers
- Adaptive performance detection on page load

---

### Future Features

- **Collaborative group gifts**: multiple senders contribute photos and messages to one World; the recipient sees contributions from everyone
- **Live reveal presence**: sender receives a real-time notification when the recipient is actively inside the Gift Universe
- **Voice and short video notes**: an audio or video message layer inside the reveal
- **Custom World builder**: senders design their own environment from a toolkit of objects, lighting, and particle options
- **AI message assistant**: in-builder writing help that prompts for memories, inside jokes, and personal details
- **Physical gift links**: an integrated "and here's what's arriving by post" card inside the reveal
- **Recipient reply wall**: after completing the reveal, the recipient can leave a voice or text response that the sender receives
- **Memory continuity**: each year's gift auto-archives into a sender-accessible timeline — a record of how a relationship has been celebrated
- **Recurring birthday system**: sender sets a recurring annual reminder with draft pre-population from the previous year
- **Surprise countdown page**: before the birthday, the sender can share a teaser link showing a sealed, interactive gift with a live countdown clock
- **Premium custom domains**: deliver via a personal URL (e.g., `from.alex.to/jamie`)
- **Multilingual World text**: world environment text rendered in the recipient's language

---

## 12. Key Differentiators for v2

### Differentiator 1: Physics as the Interface
No birthday product uses physics simulation as its primary interaction model. This is the defining differentiator — technically, experientially, and emotionally. It is not a feature. It is the medium.

### Differentiator 2: Worlds, Not Templates
Competitors offer themes. Birthday Reveal offers spatially distinct environments with different gravity, audio signatures, particle behaviors, and visual identities. The World choice is a meaningful creative decision.

### Differentiator 3: The Sealing Moment
Scheduling is not a form submission. It is a cinematic event. The sender watches their gift wrap itself, fold, and lock with the delivery date pressed into it. This transforms an administrative act into an intentional, memorable one.

### Differentiator 4: The Camera
Most web experiences have no camera — content simply exists on a page. Birthday Reveal has a camera with cinematographic intent: it lerps between states, zooms into moments, and pulls back for the celebration. This is the difference between a website and a scene.

### Differentiator 5: Adaptive Performance Without Degradation
The experience is never broken on lower-end devices — it is appropriately tuned. A recipient on a 3-year-old Android phone gets a different physics tier, not a worse product. This is a product principle that requires coordinated engineering and design effort.

### Differentiator 6: Discovery as the Emotional Model
In v1, content was delivered. In v2, content is discovered. This is a fundamental reframing of what a birthday message is: not information transmitted, but a world explored.

---

## 13. Edge Cases

### Timing Edge Cases
- Recipient birthday is today and scheduled send time has already passed → offer immediate send with explicit sender confirmation
- Recipient born February 29 → system defaults to February 28 in non-leap years with a visible sender notice and the option to change
- Sender leaves timezone at a default value → explicit confirmation step before sealing, showing both sender and recipient local times
- Same-day last-minute scheduling → allowed with a "sending within 15 minutes" confirmation and no false precision

### Physics and Performance Edge Cases
- Device cannot run WebGL → auto-detect and deliver canvas-based 2D physics tier
- Device cannot run canvas physics adequately → auto-detect and deliver CSS animation tier
- Device has severely limited memory → photos load progressively; particle count capped automatically
- iOS Safari blocks audio autoplay → music player appears as a prominently visible tap-to-play element with clear context
- Recipient has `prefers-reduced-motion` enabled → all animations replaced with static or gently fading equivalents; physics disabled; experience remains emotionally complete

### Delivery Edge Cases
- Recipient email bounces → sender notified within minutes with an update-email option
- Recipient opens link before their birthday → interactive countdown experience with the sealed gift; no content visible
- Recipient opens link weeks after their birthday → reveal is fully accessible; a soft "your gift waited for you" framing replaces the urgency of the reveal
- Recipient opens link on multiple devices → state syncs; the world remains accessible and un-gated after first completion on any device
- Duplicate gifts created for the same recipient and date → sender warned and asked to confirm or cancel the prior gift

### Content Edge Cases
- No photos uploaded → photo layer omitted cleanly; the World feels complete without it
- No music added → no music controls appear; the World's ambient audio texture is the only audio
- Photos too large → client-side resize before upload begins; the original file size never blocks the sender
- Memory Gate answer forgotten by recipient → friendly auto-bypass after 3 attempts with playful copy ("Close enough. Happy Birthday!")
- Sender abandons the builder mid-flow → draft auto-saved; returning sender is placed back at their exact step

### Access Edge Cases
- Invalid or expired reveal token → clear, privacy-safe message; no content is exposed or referenced; contact-sender guidance provided
- Sender session expires mid-build → progress saved to draft; re-authentication returns the sender to their exact step
- Gift opened on a TV browser or unconventional viewport → responsive CSS fallback renders a simplified but beautiful layout
- Recipient opens on an extremely slow mobile network → assets load progressively with a graceful loading state per section, rather than blocking the full experience

---

## 14. Non-Goals for v2 MVP

- Building a social network or public birthday feed
- Supporting multi-sender group collaboration in the builder (future feature)
- In-browser video recording or processing
- Physical gift fulfillment
- Enterprise HR or calendar birthday management tooling
- Building a general-purpose website or page creator
- Supporting more than one recipient per gift setup
- Real-time sender visibility into a live recipient reveal session (future feature)
- End-to-end encryption beyond standard HTTPS and signed token security

---

## 15. Success Metrics

### Primary Metrics
- **Setup completion rate**: % of senders who start the builder and reach "Sealed" status
- **Send success rate**: % of scheduled gifts delivered within 2 minutes of the scheduled time
- **Open rate**: % of delivered emails leading to a reveal page open
- **Reveal completion rate**: % of recipients who reach the final celebration state
- **Physics engagement rate**: % of recipients who interact beyond the minimum required path (proxy for exploration and delight)

### Secondary Metrics
- Average time to build a complete gift (target: under 12 minutes)
- % of senders who upload at least one photo (target: >80%)
- % of senders who enable the Memory Gate
- % of recipients who trigger the experience replay
- % of recipients who discover at least one easter egg interaction
- Sender return rate within 90 days (repeat use for another birthday)
- Celebration-state dwell time (how long recipients remain after the final state)

### Experience Quality Metrics
- Time to first meaningful visual on the recipient reveal page (target: under 3 seconds on a 4G connection)
- Frame rate at the celebration state (target: 60fps on mid-tier Android, 45fps minimum on low-tier)
- Physics tier distribution across recipient devices (understanding the real-world split between full, canvas, and CSS tiers)
- Confetti boundary-collision event rate (proxy for physics quality — are particles actually bouncing?)

---

## 16. MVP Release Criteria

The MVP is production-ready when all of the following are true:

- A sender can build and schedule a gift in under 12 minutes without technical knowledge or external instructions
- The birthday email is delivered within 2 minutes of the scheduled UTC time in at least 99% of cases
- The physics-based unwrapping works on touch screens without requiring precise gesture accuracy
- The full physics experience runs at or above 45fps on a mid-tier Android device (e.g., 2022 Pixel A-series)
- The CSS-tier fallback experience is tested and confirmed emotionally complete for recipients on low-end devices
- The Memory Gate bypass logic works correctly after the defined attempt threshold
- Delivery failures surface to the sender within 5 minutes of occurrence with a clear recovery path
- Three complete Worlds are production-ready with matching email templates and camera sequences
- The recipient experience on iPhone Safari passes audio fallback, gesture handling, and physics performance tests

---

## 17. Open Product Decisions

**Physics & Interaction**
- Should the unwrapping gesture be required (the recipient must swipe to progress) or optional (tapping also advances the reveal)? Mandatory gesture builds more anticipation but introduces friction for first-time recipients unfamiliar with the mechanic.
- Should the Memory Gate use strict exact-match comparison or fuzzy-match normalization? Fuzzy matching is more forgiving and feels more playful but requires a defined similarity threshold.
- Should extreme or rapid gesture inputs trigger exaggerated playful physics responses, or be silently normalized?

**Worlds**
- Should senders be able to mix elements across Worlds (e.g., Midnight Garden particles in a Starlight Loft environment)? Adds creative power but risks visual incoherence and contradicts the "one coherent world" principle.
- Should the World choice affect the email design, or should all emails share a single clean template with only the color scheme adapting? Fully themed emails feel more cohesive but add engineering and design complexity.

**The Landing Page**
- Should the homepage itself be a physics-interactive 3D scene (a floating gift that responds to mouse and touch), or a clean fast-loading marketing page that teases the 3D experience? A fully 3D homepage is a powerful differentiator but increases initial load time and complexity for new senders who may arrive on slow connections.

**Timing**
- Should the default send time be midnight in the recipient's local timezone or a configurable morning hour? Midnight is more dramatic and aligns with the birthday tradition, but most recipients will be asleep and open the gift hours later. A morning default may produce better immediate open rates.
- What is the minimum lead time for same-day scheduling? 15 minutes? 1 hour?

**Replay and Persistence**
- Should the recipient experience the full physics reveal on every replay, or should the replay be a simplified static view that loads faster and protects the impact of the first experience?
- Should the reveal link expire after a defined period (e.g., 90 days post-birthday), or remain accessible indefinitely?

**Easter Eggs**
- Should easter eggs be fixed per World (same interactions for all recipients in a given World) or customizable by the sender (sender can plant a specific hidden message)?
- Should discovering an easter egg trigger a sender notification? ("Your recipient found the secret message you hid.")

---

*Birthday Reveal — Product Requirements Document v2.0*
*Next: Technical Requirements Document v2.0*