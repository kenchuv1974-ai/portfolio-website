/**
 * ==========================================================================
 * CINEMATIC ULTRA-REALISTIC HORSE & JOCKEY LOADING SCREEN
 * Luxury Minimalist Monochrome: Pure White (#FFFFFF) & Jet-Black Horse/Jockey
 * Biomechanical 60FPS Gallop with Center Downward Drop Gesture & Ground Physics
 * ==========================================================================
 */

(function initCinematicHorseIntro() {
  'use strict';

  // Prevent multiple initializations
  if (window.__cinematicHorseInitialized) return;
  window.__cinematicHorseInitialized = true;

  // Real-time Loading Status Steps
  const LOADING_STEPS = [
    {
      badge: 'SYSTEM BOOT // STEP 01',
      title: 'INITIALIZING SYSTEM ARCHITECTURE...',
      sub: 'BGS COLLEGE OF ENGINEERING AND TECHNOLOGY • IDT PORTFOLIO'
    },
    {
      badge: 'SYSTEM CALIBRATION // STEP 02',
      title: 'CALIBRATING 60FPS HARMONIC SPECTRUM ENGINE...',
      sub: 'SYNAPSE DYNAMICS • LOCAL STORAGE CONFIGURATION'
    },
    {
      badge: 'RESOURCE PIPELINE // STEP 03',
      title: 'SYNCHRONIZING VERIFIED REPOSITORIES & METRICS...',
      sub: 'CLASSPILOT • TIC-TAC-TOE • SCHOLAR CREDENTIALS'
    },
    {
      badge: 'EXECUTION READY // COMPLETE',
      title: 'SYSTEM SYNCHRONIZED — WELCOME',
      sub: 'HARSHITH V • ARTIFICIAL INTELLIGENCE & MACHINE LEARNING'
    }
  ];

  let currentStepIndex = 0;
  let isPageFullyLoaded = false;
  let hasDroppedTextThisPass = false;
  let passCount = 0;
  let animationFrameId = null;

  // DOM Elements
  let overlay, canvas, ctx;
  let textContainer, textBadge, textTitle, textFill, textSub;

  function createIntroDOM() {
    overlay = document.getElementById('horseCinematicOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'horseCinematicOverlay';
      overlay.className = 'horse-cinematic-overlay';
      overlay.setAttribute('aria-live', 'polite');
      overlay.setAttribute('role', 'status');

      overlay.innerHTML = `
        <canvas id="horseCinematicCanvas" class="horse-cinematic-canvas"></canvas>
        <div id="horseDroppedTextContainer" class="horse-dropped-text-container">
          <div id="horseDroppedBadge" class="horse-dropped-badge">SYSTEM INITIALIZATION</div>
          <div id="horseDroppedTitle" class="horse-dropped-title">INITIALIZING SYSTEM ARCHITECTURE...</div>
          <div class="horse-dropped-bar"><div id="horseDroppedProgress" class="horse-dropped-fill"></div></div>
          <div id="horseDroppedSub" class="horse-dropped-sub">HARSHITH V • BGSCET AI & ML</div>
        </div>
        <div class="horse-intro-skip-hint">PRESS ESC OR CLICK ANYWHERE TO ENTER</div>
      `;

      if (document.body) {
        document.body.prepend(overlay);
      }
    }

    canvas = document.getElementById('horseCinematicCanvas');
    ctx = canvas ? canvas.getContext('2d') : null;
    textContainer = document.getElementById('horseDroppedTextContainer');
    textBadge = document.getElementById('horseDroppedBadge');
    textTitle = document.getElementById('horseDroppedTitle');
    textFill = document.getElementById('horseDroppedProgress');
    textSub = document.getElementById('horseDroppedSub');

    // Skip on user interaction
    if (overlay) {
      overlay.addEventListener('click', () => completeIntro(true));
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        completeIntro(true);
      }
    });

    handleResize();
    window.addEventListener('resize', handleResize);
  }

  let width = 0, height = 0, dpr = 1;
  let groundY = 0;

  function handleResize() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    groundY = height * 0.62;
  }

  // Horse & Jockey Kinematics State (Starts visibly entering on left edge)
  let horseX = -120;
  let horseSpeed = 0;
  let strideTime = 0;
  let isDropping = false;
  let dropGestureProgress = 0; // 0 (normal) -> 1 (full reach down) -> 0

  // Dropped Text Physics
  let textDropActive = false;
  let textPhysics = {
    x: 0,
    y: 0,
    targetY: 0,
    vy: 0,
    opacity: 0,
    settled: false
  };

  function triggerTextDrop(releaseX, releaseY) {
    if (textDropActive && currentStepIndex >= LOADING_STEPS.length - 1) return;

    hasDroppedTextThisPass = true;
    const step = LOADING_STEPS[currentStepIndex];

    textBadge.textContent = step.badge;
    textTitle.textContent = step.title;
    textSub.textContent = step.sub;

    const progressPct = Math.min(100, Math.round(((currentStepIndex + 1) / LOADING_STEPS.length) * 100));
    textFill.style.width = progressPct + '%';

    // Position container at horizontal center with vertical release point
    textPhysics.y = releaseY;
    textPhysics.targetY = groundY + 28;
    textPhysics.vy = 4;
    textPhysics.opacity = 0;
    textPhysics.settled = false;
    textDropActive = true;

    textContainer.style.left = '50%';
    textContainer.style.transform = 'translateX(-50%)';
    textContainer.style.top = textPhysics.y + 'px';
    textContainer.style.opacity = '1';
    textContainer.classList.add('active');

    // Advance to next step for next cycle
    if (currentStepIndex < LOADING_STEPS.length - 1) {
      currentStepIndex++;
    }
  }

  function updateTextPhysics() {
    if (!textDropActive || textPhysics.settled) return;

    textPhysics.vy += 0.85; // Gravity
    textPhysics.y += textPhysics.vy;
    textPhysics.opacity = Math.min(1, textPhysics.opacity + 0.12);

    if (textPhysics.y >= textPhysics.targetY) {
      textPhysics.y = textPhysics.targetY;
      if (Math.abs(textPhysics.vy) > 2) {
        textPhysics.vy = -textPhysics.vy * 0.35; // Damped bounce
      } else {
        textPhysics.vy = 0;
        textPhysics.settled = true;
      }
    }

    textContainer.style.top = textPhysics.y + 'px';
    textContainer.style.opacity = textPhysics.opacity;
  }

  // ----------------------------------------------------
  // ANATOMICAL BIOMECHANICAL HORSE & JOCKEY RENDERER
  // ----------------------------------------------------
  function renderHorseAndJockey(x, y, phase, gestureProg) {
    ctx.save();
    ctx.translate(x, y);

    // Subtle scale for responsive mobile vs desktop
    const scale = width < 600 ? 0.72 : width < 1000 ? 0.88 : 1.0;
    ctx.scale(scale, scale);

    // 1. Dynamic Ground Contact Shadow
    // Expands when airborne, sharpens when hooves strike ground
    const verticalBounce = Math.sin(phase * 2) * 12;
    const shadowScale = 1.0 + verticalBounce * 0.015;
    const shadowAlpha = 0.22 - verticalBounce * 0.008;

    ctx.save();
    ctx.translate(40, 85 - verticalBounce * 0.6);
    ctx.beginPath();
    ctx.ellipse(0, 0, 110 * shadowScale, 14 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0.08, shadowAlpha)})`;
    ctx.filter = 'blur(6px)';
    ctx.fill();
    ctx.filter = 'none';
    ctx.restore();

    // Stride dynamic angles
    const trunkBob = verticalBounce;
    const trunkPitch = Math.sin(phase) * 0.08;

    ctx.save();
    ctx.translate(0, trunkBob);
    ctx.rotate(trunkPitch);

    // ------------------------------------------------
    // LAYER A: FAR LEGS (Background Shadow - Darker Obsidian)
    // ------------------------------------------------
    drawLeg(ctx, phase + 0.0, true, true);   // Far Hind
    drawLeg(ctx, phase + 1.15, false, true); // Far Fore

    // ------------------------------------------------
    // LAYER B: HORSE MAIN BODY & ANATOMICAL MUSCULATURE
    // ------------------------------------------------
    drawHorseTorso(ctx, phase);

    // ------------------------------------------------
    // LAYER C: FLOWING TAIL (Lagging Wave Physics)
    // ------------------------------------------------
    drawHorseTail(ctx, phase);

    // ------------------------------------------------
    // LAYER D: NECK, HEAD & FLOWING MANE
    // ------------------------------------------------
    drawHorseNeckAndHead(ctx, phase);

    // ------------------------------------------------
    // LAYER E: THE JOCKEY (Racing Crouch & Drop Gesture)
    // ------------------------------------------------
    drawJockey(ctx, phase, gestureProg);

    // ------------------------------------------------
    // LAYER F: NEAR LEGS (Foreground - Glossy Jet-Black with Highlights)
    // ------------------------------------------------
    drawLeg(ctx, phase + 0.45, true, false);  // Near Hind
    drawLeg(ctx, phase + 1.65, false, false); // Near Fore

    ctx.restore(); // end trunkBob
    ctx.restore(); // end horse root
  }

  // Draw Anatomical Horse Leg with 4 Moving Joints
  function drawLeg(context, legPhase, isHind, isFar) {
    context.save();

    // Far leg is slightly darker for true 3D visual depth
    const baseColor = isFar ? '#080808' : '#000000';
    const highlightColor = isFar ? '#121212' : '#222222';

    // Kinematics joint angle calculations based on gallop phase
    const cycle = legPhase % (Math.PI * 2);
    let upperAngle = 0;
    let midAngle = 0;
    let lowerAngle = 0;

    if (isHind) {
      // Hip joint anchor
      context.translate(-65, 0);
      upperAngle = Math.sin(cycle) * 0.45 - 0.15;
      midAngle = Math.sin(cycle - 0.7) * 0.65 + 0.4;
      lowerAngle = Math.sin(cycle - 1.4) * 0.5 - 0.2;
    } else {
      // Shoulder joint anchor
      context.translate(65, 0);
      upperAngle = Math.sin(cycle) * 0.5 + 0.1;
      midAngle = Math.sin(cycle - 0.8) * 0.7 - 0.35;
      lowerAngle = Math.sin(cycle - 1.5) * 0.45 + 0.15;
    }

    // Upper Leg (Femur / Humerus) with muscular contour
    context.rotate(upperAngle);
    const gradUpper = context.createLinearGradient(-15, 0, 15, 45);
    gradUpper.addColorStop(0, highlightColor);
    gradUpper.addColorStop(0.5, baseColor);
    gradUpper.addColorStop(1, '#000000');
    context.fillStyle = gradUpper;

    context.beginPath();
    if (isHind) {
      // Powerful quarter / stifle
      context.moveTo(-16, 0);
      context.bezierCurveTo(-26, 20, -18, 42, -8, 48);
      context.lineTo(10, 46);
      context.bezierCurveTo(16, 28, 12, 12, 4, 0);
    } else {
      // Muscular shoulder / forearm
      context.moveTo(-12, 0);
      context.bezierCurveTo(-16, 18, -12, 38, -6, 45);
      context.lineTo(8, 44);
      context.bezierCurveTo(12, 25, 8, 10, 2, 0);
    }
    context.closePath();
    context.fill();

    // Middle Leg (Gaskin / Radius)
    context.translate(0, 45);
    context.rotate(midAngle);

    context.beginPath();
    context.moveTo(-7, 0);
    context.lineTo(-4, 38);
    context.lineTo(5, 38);
    context.lineTo(7, 0);
    context.closePath();
    context.fillStyle = baseColor;
    context.fill();

    // Lower Leg (Cannon bone, Fetlock, Pastern & Hoof)
    context.translate(0, 38);
    context.rotate(lowerAngle);

    // Cannon bone
    context.beginPath();
    context.moveTo(-3.5, 0);
    context.lineTo(-2.5, 25);
    context.lineTo(3.5, 25);
    context.lineTo(4, 0);
    context.closePath();
    context.fillStyle = '#0a0a0a';
    context.fill();

    // Fetlock & Hoof
    context.translate(0, 25);
    context.beginPath();
    context.moveTo(-3, 0);
    context.lineTo(-5, 9);
    context.lineTo(7, 9);
    context.lineTo(4, 0);
    context.closePath();
    context.fillStyle = '#000000';
    context.fill();

    context.restore();
  }

  // Draw Muscular Horse Torso with High-Gloss Shading
  function drawHorseTorso(context, phase) {
    context.save();

    // Muscle gradient sheen
    const grad = context.createLinearGradient(-110, -50, 110, 40);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.2, '#181818');
    grad.addColorStop(0.45, '#0a0a0a');
    grad.addColorStop(0.7, '#202020');
    grad.addColorStop(1, '#000000');
    context.fillStyle = grad;

    context.beginPath();
    // Croup (high muscular rump)
    context.moveTo(-95, -18);
    context.bezierCurveTo(-108, -5, -112, 20, -90, 35);
    // Belly / flank
    context.bezierCurveTo(-60, 42, -20, 38, 10, 34);
    // Deep athletic chest / brisket
    context.bezierCurveTo(45, 38, 75, 42, 92, 18);
    // Breast / Point of shoulder
    context.bezierCurveTo(105, 5, 102, -18, 85, -28);
    // Withers (raised crest above shoulders)
    context.bezierCurveTo(65, -38, 45, -34, 25, -28);
    // Back & Loin
    context.bezierCurveTo(0, -25, -45, -28, -75, -24);
    context.bezierCurveTo(-85, -22, -90, -20, -95, -18);
    context.closePath();
    context.fill();

    // Muscle Contour Shadow Lines
    context.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    context.lineWidth = 1.2;
    context.beginPath();
    // Ribcage sheen line
    context.moveTo(-15, -10);
    context.bezierCurveTo(10, -5, 30, 8, 45, 22);
    // Scapula definition
    context.moveTo(55, -22);
    context.bezierCurveTo(68, -10, 72, 8, 80, 16);
    // Hip flank curve
    context.moveTo(-75, -14);
    context.bezierCurveTo(-65, 5, -70, 18, -80, 26);
    context.stroke();

    context.restore();
  }

  // Draw Arching Neck, Equine Head, Pricked Ears & Mane
  function drawHorseNeckAndHead(context, phase) {
    context.save();
    context.translate(65, -28);

    const neckBob = Math.sin(phase - 0.4) * 0.08;
    context.rotate(neckBob);

    // Arching Crest of the Neck
    const neckGrad = context.createLinearGradient(0, -40, 60, 20);
    neckGrad.addColorStop(0, '#222222');
    neckGrad.addColorStop(0.5, '#0a0a0a');
    neckGrad.addColorStop(1, '#000000');
    context.fillStyle = neckGrad;

    context.beginPath();
    context.moveTo(0, 0);
    context.bezierCurveTo(15, -25, 35, -46, 60, -52); // Crest arch
    context.lineTo(82, -45);                          // Poll
    context.bezierCurveTo(88, -25, 78, 5, 52, 18);    // Throatlatch
    context.bezierCurveTo(35, 16, 15, 12, 0, 10);
    context.closePath();
    context.fill();

    // Head
    context.save();
    context.translate(68, -48);
    const headBob = Math.sin(phase) * 0.05;
    context.rotate(headBob);

    context.fillStyle = '#050505';
    context.beginPath();
    context.moveTo(0, 0);
    // Pricked Ears
    context.lineTo(4, -18);
    context.lineTo(10, -12);
    context.lineTo(12, -2);
    // Forehead and Bridge of Nose
    context.bezierCurveTo(24, 0, 36, 6, 48, 14);
    // Muzzle / Flaring Nostril
    context.bezierCurveTo(52, 17, 50, 24, 44, 25);
    // Chin and strong Jowl curve
    context.bezierCurveTo(36, 26, 22, 28, 14, 22);
    context.bezierCurveTo(4, 15, -4, 8, 0, 0);
    context.closePath();
    context.fill();

    // Eye highlight
    context.fillStyle = '#222222';
    context.beginPath();
    context.ellipse(18, 5, 2.5, 1.8, 0.2, 0, Math.PI * 2);
    context.fill();

    context.restore(); // end head

    // Flowing Mane (whipped back by the headwind)
    context.fillStyle = '#020202';
    for (let i = 0; i < 7; i++) {
      const strandPhase = phase * 1.5 - i * 0.4;
      const wave = Math.sin(strandPhase) * 6;
      context.beginPath();
      context.moveTo(i * 9, -i * 7);
      context.bezierCurveTo(i * 8 - 25, -i * 7 - 12 + wave, i * 8 - 45, -i * 7 - 5 - wave, i * 8 - 60, -i * 7 + 8);
      context.bezierCurveTo(i * 8 - 40, -i * 7 + 2, i * 8 - 20, -i * 7 - 2, i * 9 + 4, -i * 7 + 3);
      context.closePath();
      context.fill();
    }

    context.restore(); // end neck
  }

  // Draw Flowing Tail with Wave Harmonics
  function drawHorseTail(context, phase) {
    context.save();
    context.translate(-94, -18);

    context.fillStyle = '#000000';
    for (let i = 0; i < 6; i++) {
      const wave1 = Math.sin(phase - i * 0.35) * 10;
      const wave2 = Math.cos(phase * 1.2 - i * 0.4) * 12;

      context.beginPath();
      context.moveTo(0, i * 2);
      context.bezierCurveTo(-45, -15 + wave1, -95, -10 + wave2, -145, 15 + i * 6 + wave1);
      context.bezierCurveTo(-115, 22 + wave2, -65, 8 + wave1, 0, 5 + i * 2);
      context.closePath();
      context.fill();
    }

    context.restore();
  }

  // Draw Jockey in Racing Crouch & Center Downward Throw Gesture
  function drawJockey(context, phase, gestureProg) {
    context.save();
    context.translate(-8, -34); // Sits above withers/back

    // Racing Saddle & Pad
    context.fillStyle = '#050505';
    context.beginPath();
    context.moveTo(-28, 0);
    context.bezierCurveTo(-20, -6, 15, -6, 25, 0);
    context.lineTo(18, 5);
    context.lineTo(-22, 5);
    context.closePath();
    context.fill();

    // Jockey Pelvis & Thigh (Deep Crouch with High Stirrup)
    context.save();
    context.translate(-10, -6);

    // Torso (Aerodynamic forward racing lean)
    context.save();
    const jockeyTorsoPitch = -0.55 + Math.sin(phase) * 0.04;
    context.rotate(jockeyTorsoPitch);

    const silksGrad = context.createLinearGradient(0, -35, 30, 0);
    silksGrad.addColorStop(0, '#1c1c1c');
    silksGrad.addColorStop(0.5, '#0a0a0a');
    silksGrad.addColorStop(1, '#000000');
    context.fillStyle = silksGrad;

    // Muscular back & torso of jockey
    context.beginPath();
    context.moveTo(-8, 0);
    context.bezierCurveTo(-12, -18, -6, -34, 10, -38); // Curved back
    context.bezierCurveTo(24, -36, 28, -20, 22, -2);   // Chest
    context.closePath();
    context.fill();

    // Jockey Head & Streamlined Racing Helmet
    context.save();
    context.translate(14, -40);
    context.rotate(0.25);

    // Helmet
    context.fillStyle = '#050505';
    context.beginPath();
    context.arc(0, 0, 9.5, 0, Math.PI * 2);
    context.fill();

    // Helmet Peak / Visor
    context.beginPath();
    context.moveTo(4, -2);
    context.lineTo(14, 2);
    context.lineTo(6, 5);
    context.closePath();
    context.fill();

    // Goggles / Chin strap highlight
    context.strokeStyle = '#282828';
    context.lineWidth = 1.2;
    context.strokeRect(-4, -2, 9, 4);

    context.restore(); // end head

    // Left Arm (Holding Reins firmly)
    context.save();
    context.translate(18, -30);
    context.strokeStyle = '#050505';
    context.lineWidth = 6.5;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(18, 14);
    context.lineTo(34, 18);
    context.stroke();
    context.restore();

    // ----------------------------------------------------
    // RIGHT ARM: GESTURE CONTROLLER
    // In normal gallop: rests forward near reins.
    // At center: sweeps outward & downward in a distinct release gesture!
    // ----------------------------------------------------
    context.save();
    context.translate(12, -28); // Right shoulder

    if (gestureProg > 0) {
      // Reaching downward toward the ground!
      const reachAngle = 0.4 + gestureProg * 1.5;
      context.rotate(reachAngle);

      context.strokeStyle = '#181818';
      context.lineWidth = 6;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(18, 18 * gestureProg);
      context.lineTo(36 * (1 - gestureProg * 0.3), 38 * gestureProg + 10);
      context.stroke();

      // Black Glover Hand at bottom of reach
      context.fillStyle = '#000000';
      context.beginPath();
      context.arc(36 * (1 - gestureProg * 0.3), 38 * gestureProg + 10, 4.5, 0, Math.PI * 2);
      context.fill();
    } else {
      // Normal gallop posture
      context.strokeStyle = '#141414';
      context.lineWidth = 6;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(14, 12);
      context.lineTo(28, 15);
      context.stroke();

      // Hand holding crop / rein
      context.fillStyle = '#050505';
      context.beginPath();
      context.arc(28, 15, 4, 0, Math.PI * 2);
      context.fill();
    }

    context.restore(); // end right arm
    context.restore(); // end torso

    // Jockey Legs & High Stirrups (Monkey Crouch)
    context.fillStyle = '#0a0a0a';
    context.beginPath();
    context.moveTo(0, 0);
    context.bezierCurveTo(14, -8, 26, 4, 22, 16);  // Thigh angled forward
    context.bezierCurveTo(12, 18, 4, 14, -2, 6);
    context.closePath();
    context.fill();

    // Shin & Riding Boot (Tucked tightly back)
    context.fillStyle = '#000000';
    context.beginPath();
    context.moveTo(22, 14);
    context.lineTo(10, 32);  // Boot heel
    context.lineTo(2, 30);
    context.lineTo(15, 12);
    context.closePath();
    context.fill();

    // Stirrup Iron
    context.strokeStyle = '#222222';
    context.lineWidth = 2;
    context.strokeRect(6, 30, 8, 4);

    context.restore(); // end jockey pelvis
    context.restore(); // end jockey root
  }

  // ----------------------------------------------------
  // MAIN ANIMATION LOOP (60 FPS)
  // ----------------------------------------------------
  let lastTimestamp = 0;

  function loop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
    lastTimestamp = timestamp;

    // Clear with pure white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Subtle ground horizon marker line
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, groundY + 70);
    ctx.lineTo(width, groundY + 70);
    ctx.stroke();

    // Advance horse position
    const transitDuration = 2.7; // seconds to cross screen
    const totalDistance = width + 750;
    horseSpeed = totalDistance / transitDuration;
    horseX += horseSpeed * delta;

    // Advance 4-beat gallop stride
    strideTime += delta * 10.5;

    // Detect Center Proximity for the Downward Hand Gesture
    const centerX = width / 2;
    const distToCenter = horseX - centerX;

    // Gesture Window: 180px before center to 160px after center
    if (distToCenter >= -180 && distToCenter <= 160) {
      isDropping = true;
      // Normalizes from 0 to 1 at exact center, then back to 0
      const norm = 1 - Math.abs(distToCenter) / 180;
      dropGestureProgress = Math.max(0, Math.sin(norm * Math.PI * 0.5));

      // Trigger text drop at peak of reach
      if (!hasDroppedTextThisPass && distToCenter >= -15 && distToCenter <= 25) {
        const handTipX = horseX + 30;
        const handTipY = groundY - 20;
        triggerTextDrop(handTipX, handTipY);
      }
    } else {
      isDropping = false;
      dropGestureProgress = 0;
    }

    // Render Horse and Jockey
    renderHorseAndJockey(horseX, groundY, strideTime, dropGestureProgress);

    // Update Physics of Dropped Loading Text
    updateTextPhysics();

    // Check if Horse has exited the right screen edge
    if (horseX > width + 380) {
      passCount++;
      hasDroppedTextThisPass = false;

      if (isPageFullyLoaded && passCount >= 1) {
        // Allow settled text to be enjoyed, then smoothly unveil website
        setTimeout(() => {
          completeIntro(false);
        }, 1100);
        return;
      } else {
        // Loop back for next pass if still loading
        horseX = -320;
      }
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  function completeIntro(immediate) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    if (!overlay) return;

    if (immediate) {
      overlay.style.transition = 'opacity 0.25s ease-out';
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay) overlay.remove();
      }, 260);
    } else {
      // Smooth luxury fade-out
      overlay.classList.add('fade-out');
      setTimeout(() => {
        if (overlay) overlay.remove();
      }, 750);
    }
  }

  // Hook into Real Page Loading Lifecycle
  function initLifecycle() {
    createIntroDOM();

    // Start 60FPS loop immediately
    animationFrameId = requestAnimationFrame(loop);

    // Real Window Loading Event
    if (document.readyState === 'complete') {
      onResourceLoaded();
    } else {
      window.addEventListener('load', onResourceLoaded);
      // Fallback timer to guarantee site reveals even if external CDN is slow
      setTimeout(onResourceLoaded, 3500);
    }
  }

  function onResourceLoaded() {
    isPageFullyLoaded = true;
    // Advance step to complete
    currentStepIndex = LOADING_STEPS.length - 1;
    if (textBadge) textBadge.textContent = LOADING_STEPS[currentStepIndex].badge;
    if (textTitle) textTitle.textContent = LOADING_STEPS[currentStepIndex].title;
    if (textSub) textSub.textContent = LOADING_STEPS[currentStepIndex].sub;
    if (textFill) textFill.style.width = '100%';
  }

  // Execute on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLifecycle);
  } else {
    initLifecycle();
  }

})();
