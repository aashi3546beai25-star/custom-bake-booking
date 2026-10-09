import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface Cake3DProps {
  frostingColor?: string; // hex string e.g. "#fff5ea"
  tierCount?: 1 | 2;
  hasBerries?: boolean;
  hasSprinkles?: boolean;
  hasDrizzle?: boolean;
  hasCandle?: boolean;
  className?: string;
  autoRotate?: boolean;
  interactive?: boolean;
}

export function Cake3DCanvas({
  frostingColor = "#fff2e6",
  tierCount = 2,
  hasBerries = true,
  hasSprinkles = true,
  hasDrizzle = true,
  hasCandle = true,
  className = "h-[480px] w-full",
  autoRotate = true,
  interactive = true,
}: Cake3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const cakeGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup with soft background fog for atmosphere
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 9.2);
    camera.lookAt(0, 0.9, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting Environment
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    // Main Studio Spotlight
    const spotLight = new THREE.SpotLight(0xfffaed, 4.5);
    spotLight.position.set(6, 10, 7);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.bias = -0.0001;
    scene.add(spotLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xffdfb3, 2.0);
    keyLight.position.set(-5, 6, 5);
    scene.add(keyLight);

    // Rim Glow Light (Backlight)
    const rimLight = new THREE.PointLight(0xffb703, 4.0, 18);
    rimLight.position.set(0, 6, -6);
    scene.add(rimLight);

    // Soft Bottom Bounce Light
    const bounceLight = new THREE.DirectionalLight(0xffd166, 0.8);
    bounceLight.position.set(0, -5, 2);
    scene.add(bounceLight);

    // 3. Cake Main Group
    const cakeGroup = new THREE.Group();
    cakeGroupRef.current = cakeGroup;
    scene.add(cakeGroup);

    // Materials Library
    const baseColor = new THREE.Color(frostingColor);
    
    // Luxurious Velvet Frosting
    const frostingMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.28,
      metalness: 0.02,
    });

    // Metallic Gold Leaf / Accents
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe5c158,
      metalness: 0.95,
      roughness: 0.15,
    });

    // High Gloss Mirror Ganache Drizzle
    const ganacheMat = new THREE.MeshStandardMaterial({
      color: 0x2b170c,
      roughness: 0.05,
      metalness: 0.2,
    });

    // White Cream Rosettes
    const creamMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.0,
    });

    // Glossy Strawberry/Berry Red
    const berryMat = new THREE.MeshStandardMaterial({
      color: 0xc1121f,
      roughness: 0.12,
      metalness: 0.05,
    });

    // Fresh Leaf Green
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x386641,
      roughness: 0.4,
    });

    // Macaron Almond Shell Colors
    const macaronPinkMat = new THREE.MeshStandardMaterial({ color: 0xf4acb7, roughness: 0.3 });
    const macaronCreamMat = new THREE.MeshStandardMaterial({ color: 0xffcad4, roughness: 0.2 });

    // 4. Ornate Glass & Gold Pedestal Stand
    // Base Plate
    const baseGeo = new THREE.CylinderGeometry(2.8, 3.2, 0.2, 64);
    const baseStand = new THREE.Mesh(baseGeo, goldMat);
    baseStand.position.y = -0.9;
    baseStand.receiveShadow = true;
    cakeGroup.add(baseStand);

    // Ornate Pedestal Stem
    const stemGeo = new THREE.CylinderGeometry(0.7, 1.6, 0.7, 32);
    const stem = new THREE.Mesh(stemGeo, goldMat);
    stem.position.y = -0.45;
    cakeGroup.add(stem);

    // Marble Top Platter
    const platterGeo = new THREE.CylinderGeometry(2.9, 2.9, 0.22, 64);
    const platterMat = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.1, metalness: 0.1 });
    const platter = new THREE.Mesh(platterGeo, platterMat);
    platter.position.y = -0.05;
    platter.receiveShadow = true;
    cakeGroup.add(platter);

    // Gold Platter Rim
    const rimRingGeo = new THREE.TorusGeometry(2.92, 0.06, 16, 64);
    const rimRing = new THREE.Mesh(rimRingGeo, goldMat);
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = -0.05;
    cakeGroup.add(rimRing);

    // 5. Tier 1 (Bottom Tier)
    const bottomRadius = 2.2;
    const bottomHeight = 1.35;
    const bottomY = 0.72;

    const bottomGeo = new THREE.CylinderGeometry(bottomRadius, bottomRadius, bottomHeight, 64);
    const bottomTier = new THREE.Mesh(bottomGeo, frostingMat);
    bottomTier.position.y = bottomY;
    bottomTier.castShadow = true;
    bottomTier.receiveShadow = true;
    cakeGroup.add(bottomTier);

    // Bottom Tier Ornate Piped Cream Border (Pearl Bead String)
    const pearlCount = 36;
    for (let i = 0; i < pearlCount; i++) {
      const angle = (i / pearlCount) * Math.PI * 2;
      const px = Math.cos(angle) * (bottomRadius + 0.02);
      const pz = Math.sin(angle) * (bottomRadius + 0.02);
      const pearlGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const pearl = new THREE.Mesh(pearlGeo, creamMat);
      pearl.position.set(px, 0.09, pz);
      cakeGroup.add(pearl);
    }

    // Gold Leaf Flakes on Bottom Tier
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const hy = 0.2 + Math.random() * 1.0;
      const gx = Math.cos(angle) * (bottomRadius + 0.01);
      const gz = Math.sin(angle) * (bottomRadius + 0.01);
      const flakeGeo = new THREE.PlaneGeometry(0.08, 0.12);
      const flake = new THREE.Mesh(flakeGeo, goldMat);
      flake.position.set(gx, hy, gz);
      flake.rotation.set(Math.random(), angle + Math.PI / 2, Math.random());
      cakeGroup.add(flake);
    }

    let topY = 1.4;

    // 6. Tier 2 (Top Tier)
    if (tierCount === 2) {
      const topRadius = 1.45;
      const topHeight = 1.25;
      topY = bottomY + bottomHeight / 2 + topHeight / 2;

      const topGeo = new THREE.CylinderGeometry(topRadius, topRadius, topHeight, 64);
      const topTier = new THREE.Mesh(topGeo, frostingMat);
      topTier.position.y = topY;
      topTier.castShadow = true;
      topTier.receiveShadow = true;
      cakeGroup.add(topTier);

      // Top Tier Pearl Border
      const topPearlCount = 28;
      for (let i = 0; i < topPearlCount; i++) {
        const angle = (i / topPearlCount) * Math.PI * 2;
        const px = Math.cos(angle) * (topRadius + 0.02);
        const pz = Math.sin(angle) * (topRadius + 0.02);
        const pearlGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const pearl = new THREE.Mesh(pearlGeo, creamMat);
        pearl.position.set(px, topY - topHeight / 2 + 0.05, pz);
        cakeGroup.add(pearl);
      }

      // Ornate Shell Piping around Top Tier Edge
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const px = Math.cos(angle) * (topRadius - 0.08);
        const pz = Math.sin(angle) * (topRadius - 0.08);
        const shellGeo = new THREE.ConeGeometry(0.1, 0.15, 12);
        const shell = new THREE.Mesh(shellGeo, creamMat);
        shell.position.set(px, topY + topHeight / 2 + 0.04, pz);
        shell.rotation.set(Math.PI / 4, angle, 0);
        cakeGroup.add(shell);
      }

      topY = topY + topHeight / 2;
    }

    // 7. High-Gloss Ganache Drizzle
    if (hasDrizzle) {
      const targetRadius = tierCount === 2 ? 1.46 : 2.21;
      const drizzleTop = topY;

      // Top Glaze Cap
      const capGeo = new THREE.CylinderGeometry(targetRadius * 0.9, targetRadius * 0.9, 0.04, 32);
      const cap = new THREE.Mesh(capGeo, ganacheMat);
      cap.position.y = drizzleTop + 0.02;
      cakeGroup.add(cap);

      // Dripping Icicles
      const dripCount = 16;
      for (let i = 0; i < dripCount; i++) {
        const angle = (i / dripCount) * Math.PI * 2 + (Math.random() * 0.15 - 0.07);
        const dx = Math.cos(angle) * targetRadius;
        const dz = Math.sin(angle) * targetRadius;
        const dripLen = 0.25 + Math.random() * 0.5;

        const dripGeo = new THREE.CylinderGeometry(0.045, 0.015, dripLen, 12);
        const drip = new THREE.Mesh(dripGeo, ganacheMat);
        drip.position.set(dx, drizzleTop - dripLen / 2, dz);
        cakeGroup.add(drip);

        // Tear drop tip
        const tipGeo = new THREE.SphereGeometry(0.04, 12, 12);
        const tip = new THREE.Mesh(tipGeo, ganacheMat);
        tip.position.set(dx, drizzleTop - dripLen, dz);
        cakeGroup.add(tip);
      }
    }

    // 8. Gourmet Toppers (Fresh Strawberries, Macarons, Chocolate Sails)
    if (hasBerries) {
      const radiusBound = tierCount === 2 ? 0.8 : 1.3;

      // Gourmet Strawberries & Raspberries Cluster
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const dist = 0.2 + Math.random() * radiusBound;
        const bx = Math.cos(angle) * dist;
        const bz = Math.sin(angle) * dist;

        // Strawberry Heart Cone Shape
        const strawGeo = new THREE.ConeGeometry(0.18, 0.32, 16);
        const straw = new THREE.Mesh(strawGeo, berryMat);
        straw.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.PI + Math.random() * 0.3);
        straw.position.set(bx, topY + 0.18, bz);
        straw.castShadow = true;
        cakeGroup.add(straw);

        // Leaves Crown
        for (let l = 0; l < 4; l++) {
          const leafAngle = (l / 4) * Math.PI * 2;
          const leafGeo = new THREE.PlaneGeometry(0.1, 0.16);
          const leaf = new THREE.Mesh(leafGeo, leafMat);
          leaf.position.set(bx + Math.cos(leafAngle) * 0.08, topY + 0.28, bz + Math.sin(leafAngle) * 0.08);
          leaf.rotation.set(Math.PI / 3, leafAngle, 0);
          cakeGroup.add(leaf);
        }
      }

      // French Macarons on Top
      const macaronPositions = [
        { x: -0.5, z: 0.4, rot: 0.3, mat: macaronPinkMat },
        { x: 0.6, z: -0.3, rot: -0.4, mat: macaronPinkMat },
      ];

      macaronPositions.forEach((pos) => {
        const macGroup = new THREE.Group();
        const topShellGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 24);
        const topShell = new THREE.Mesh(topShellGeo, pos.mat);
        topShell.position.y = 0.07;

        const fillGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.05, 24);
        const fill = new THREE.Mesh(fillGeo, macaronCreamMat);

        const botShell = new THREE.Mesh(topShellGeo, pos.mat);
        botShell.position.y = -0.07;

        macGroup.add(topShell);
        macGroup.add(fill);
        macGroup.add(botShell);
        macGroup.rotation.set(0.5, pos.rot, 0.2);
        macGroup.position.set(pos.x, topY + 0.18, pos.z);
        macGroup.castShadow = true;
        cakeGroup.add(macGroup);
      });

      // Sculpted Chocolate Sail Accents
      for (let i = 0; i < 3; i++) {
        const sailGeo = new THREE.ConeGeometry(0.3, 0.9, 3);
        const sail = new THREE.Mesh(sailGeo, ganacheMat);
        sail.scale.set(0.1, 1, 0.8);
        sail.rotation.set(0.2, (i * Math.PI) / 1.5, 0.2);
        sail.position.set((i - 1) * 0.4, topY + 0.45, -0.2);
        sail.castShadow = true;
        cakeGroup.add(sail);
      }
    }

    // 9. Metallic Sprinkles & Gold Pearls
    if (hasSprinkles) {
      const pearlGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const sprRadius = tierCount === 2 ? 1.3 : 1.9;

      for (let i = 0; i < 35; i++) {
        const isGold = Math.random() > 0.4;
        const mat = isGold ? goldMat : creamMat;
        const pearl = new THREE.Mesh(pearlGeo, mat);

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * sprRadius;
        pearl.position.set(Math.cos(angle) * dist, topY + 0.04, Math.sin(angle) * dist);
        cakeGroup.add(pearl);
      }
    }

    // 10. Celebration Candle with Flame Light & Particles
    if (hasCandle) {
      const candleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
      });
      const candleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 16);
      const candle = new THREE.Mesh(candleGeo, candleMat);
      candle.position.set(0, topY + 0.45, 0);
      candle.castShadow = true;
      cakeGroup.add(candle);

      // Gold Stripe Spiral on Candle
      const spiralGeo = new THREE.TorusGeometry(0.052, 0.008, 8, 32);
      for (let s = 0; s < 5; s++) {
        const stripe = new THREE.Mesh(spiralGeo, goldMat);
        stripe.position.set(0, topY + 0.15 + s * 0.15, 0);
        stripe.rotation.x = Math.PI / 2;
        cakeGroup.add(stripe);
      }

      // Flame Mesh
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xffa000 });
      const flameGeo = new THREE.ConeGeometry(0.08, 0.28, 16);
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(0, topY + 1.02, 0);
      cakeGroup.add(flame);

      // Inner Flame Core
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const coreGeo = new THREE.ConeGeometry(0.04, 0.16, 12);
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(0, topY + 0.98, 0);
      cakeGroup.add(core);

      // Glowing Point Light
      const flameLight = new THREE.PointLight(0xff9e00, 3.5, 4);
      flameLight.position.set(0, topY + 1.05, 0);
      cakeGroup.add(flameLight);
    }

    // 11. Orbiting Floating Macarons / Embers (Atmospheric 3D Detail)
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    const emberGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const emberMat = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.8 });
    for (let i = 0; i < 18; i++) {
      const ember = new THREE.Mesh(emberGeo, emberMat);
      ember.position.set(
        (Math.random() - 0.5) * 6,
        Math.random() * 4,
        (Math.random() - 0.5) * 6
      );
      floatingGroup.add(ember);
    }

    // 12. Interactive Controls (Smooth Drag Inertia)
    let isDragging = false;
    let previousMouseX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      previousMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !cakeGroupRef.current) return;
      const deltaX = e.clientX - previousMouseX;
      targetRotationY += deltaX * 0.012;
      previousMouseX = e.clientX;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (!interactive || !e.touches[0]) return;
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !cakeGroupRef.current || !e.touches[0]) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      targetRotationY += deltaX * 0.012;
      previousMouseX = e.touches[0].clientX;
    };

    domElem.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onMouseUp);

    // 13. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (cakeGroupRef.current) {
        if (autoRotate && !isDragging) {
          targetRotationY += 0.006;
        }
        // Smooth rotation interpolation
        cakeGroupRef.current.rotation.y += (targetRotationY - cakeGroupRef.current.rotation.y) * 0.08;
        
        // Luxurious Floating & Wobble
        cakeGroupRef.current.position.y = Math.sin(elapsedTime * 1.8) * 0.09;
        cakeGroupRef.current.rotation.z = Math.sin(elapsedTime * 1.2) * 0.015;
      }

      // Orbiting particles
      floatingGroup.rotation.y = elapsedTime * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElem.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [frostingColor, tierCount, hasBerries, hasSprinkles, hasDrizzle, hasCandle, autoRotate, interactive]);

  return (
    <div ref={mountRef} className={`relative cursor-grab active:cursor-grabbing ${className}`}>
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-lg shadow-lg border border-white/20">
        ✨ Drag to Rotate 3D Gourmet Cake
      </div>
    </div>
  );
}
