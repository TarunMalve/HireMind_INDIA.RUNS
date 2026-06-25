// Interactive 3D Constellation / Neural Network Background using Three.js

(function () {
  const container = document.getElementById('three-container');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 250;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Constants
  const particleCount = 80;
  const maxDistance = 75;
  const particles = [];
  const positions = new Float32Array(particleCount * 3);
  
  // Create particle objects with speeds
  const particleGeometry = new THREE.BufferGeometry();
  
  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 350;
    const y = (Math.random() - 0.5) * 250;
    const z = (Math.random() - 0.5) * 200;

    particles.push({
      x: x,
      y: y,
      z: z,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.4
    });

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Particle Material (Glowing cyan dots)
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x06b6d4,
    size: 3,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  // Points system
  const pointSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(pointSystem);

  // Line connection geometry
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending
  });

  let connectionMesh;

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
  });

  // Render loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth camera rotation based on mouse
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    camera.position.x = targetX;
    camera.position.y = -targetY;
    camera.lookAt(scene.position);

    // Update particle positions
    const posAttribute = pointSystem.geometry.attributes.position;
    const lineCoords = [];

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      // Bounce bounds
      if (Math.abs(p.x) > 200) p.vx *= -1;
      if (Math.abs(p.y) > 150) p.vy *= -1;
      if (Math.abs(p.z) > 150) p.vz *= -1;

      posAttribute.setXYZ(i, p.x, p.y, p.z);
    }
    posAttribute.needsUpdate = true;

    // Calculate connections dynamically
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dz = particles[i].z - particles[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          lineCoords.push(particles[i].x, particles[i].y, particles[i].z);
          lineCoords.push(particles[j].x, particles[j].y, particles[j].z);
        }
      }
    }

    // Rebuild line segments mesh
    if (connectionMesh) {
      scene.remove(connectionMesh);
      connectionMesh.geometry.dispose();
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
    connectionMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(connectionMesh);

    // Rotate points system slowly
    pointSystem.rotation.y += 0.0008;
    if (connectionMesh) {
      connectionMesh.rotation.y += 0.0008;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
