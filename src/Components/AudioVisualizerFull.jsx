import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useAudioVisual } from '../Musique/AudioManager';

const AudioVisualizer = () => {
  const containerRef = useRef(null);
  const visualInfos = useAudioVisual(); // Hook from your audio manager

  useEffect(() => {
    let scene, camera, renderer, geometry, material, cubes;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      geometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);
      material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

      cubes = Array.from({ length: 64 }, () => new THREE.Mesh(geometry, material));
      cubes.forEach((cube, index) => {
        cube.position.x = (index % 8) * 1.5 - 6;
        scene.add(cube);
      });

      const animate = () => {
        requestAnimationFrame(animate);

        cubes.forEach((cube, index) => {
          const value = visualInfos[index] / 255;
          cube.scale.y = 1 + value * 5;
        });

        renderer.render(scene, camera);
      };

      animate();
    };

    init();

    return () => {
      // Clean up Three.js scene
      if (scene && cubes) {
        cubes.forEach(cube => {
          scene.remove(cube);
          cube.geometry.dispose();
          cube.material.dispose();
        });
      }

      if (renderer) {
        renderer.dispose();
      }
    };
  }, [visualInfos]);

  return <div ref={containerRef} />;
};

export default AudioVisualizer;
