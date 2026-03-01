import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";

const PolygonNetworkBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0802, 0.025);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000,
    );

    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x0a0802, 1);
    container.appendChild(renderer.domElement);

    const baseGeometry = new THREE.SphereGeometry(
      35,
      10,
      2,
      3,
      Math.PI * 2,
      0.5,
      1.5,
    );

    const posAttribute = baseGeometry.getAttribute("position");
    const vertex = new THREE.Vector3();

    for (let i = 0; i < posAttribute.count; i++) {
      vertex.fromBufferAttribute(posAttribute, i);
      const distortion = 1 + (Math.random() - 0.5) * 0.8;
      vertex.multiplyScalar(distortion);
      vertex.x += (Math.random() - 0.5) * 3;
      vertex.y += (Math.random() - 0.5) * 3;
      vertex.z += (Math.random() - 0.5) * 3;
      posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    baseGeometry.computeVertexNormals();

    const wireframeGeo = new THREE.WireframeGeometry(baseGeometry);
    const lineGeometry = new LineSegmentsGeometry();
    lineGeometry.fromWireframeGeometry(wireframeGeo);

    const lineMaterial = new LineMaterial({
      color: 0xe9d48b,
      linewidth: 2.5,
      transparent: true,
      opacity: 0.2,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    });

    const wireMesh = new Line2(lineGeometry, lineMaterial);
    wireMesh.rotation.x = -Math.PI / 1.8;

    const tunnelMeshes = [];
    const TUNNEL_LENGTH = 35;
    const MESH_COUNT = 4;

    for (
      let i = -Math.floor(MESH_COUNT / 2);
      i < Math.ceil(MESH_COUNT / 2);
      i++
    ) {
      const clone = wireMesh.clone();
      clone.position.z = i * TUNNEL_LENGTH;
      scene.add(clone);
      tunnelMeshes.push(clone);
    }

    const updateCameraOnScroll = () => {
      if (!container.parentElement) return;

      const rect = container.parentElement.getBoundingClientRect();
      const heroHeight = rect.height;
      const heroTop = rect.top;

      let scrollFraction = -heroTop / heroHeight;
      scrollFraction = Math.min(Math.max(scrollFraction, 0), 1);

      const zOffset = scrollFraction * 120;
      camera.position.z = zOffset;

      scene.fog.density = 0.035 - scrollFraction * 0.03;
    };

    window.addEventListener("scroll", updateCameraOnScroll, { passive: true });

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      tunnelMeshes.forEach((m) => {
        m.rotation.y += 0.0015;


        if (camera.position.z - m.position.z > TUNNEL_LENGTH * 0.6) {
          m.position.z += TUNNEL_LENGTH * MESH_COUNT;
        }

        // User scrolling backward (up)
        if (m.position.z - camera.position.z > TUNNEL_LENGTH * 0.6) {
          m.position.z -= TUNNEL_LENGTH * MESH_COUNT;
        }
      });

      renderer.render(scene, camera);
    };

    animate();
    updateCameraOnScroll();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      lineMaterial.resolution.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", updateCameraOnScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      container.removeChild(renderer.domElement);
      baseGeometry.dispose();
      wireframeGeo.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-20 w-full h-full overflow-hidden"
    />
  );
};

export default PolygonNetworkBackground;
