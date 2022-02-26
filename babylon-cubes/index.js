// Copyright (c) 2022 Tobias Briones. All rights reserved.
// SPDX-License-Identifier: MIT
//
// This source code is part of
// https://github.com/tobiasbriones/cp-unah-is910-simulation-theory and is
// licensed under the MIT License found in the LICENSE file in the root
// directory of this source tree or at https://opensource.org/licenses/MIT

document.addEventListener('DOMContentLoaded', init);

function init() {
  const canvasEl = document.getElementById('canvas');
  const main = Main();

  main.init(canvasEl);
  main.draw();
}

function Main() {
  let engine;
  let scene;
  let camera;
  const initCamera = () => {
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
  };
  const runRenderLoop = () => {
    engine.runRenderLoop(() => {
      scene.render();
    });
  };

  return {
    init: (canvasEl) => {
      engine = newEngine(canvasEl);
      scene = newScene(engine);
      camera = newCamera(scene);

      initCamera();
      runRenderLoop();

      window.addEventListener('resize', () => {
        engine.resize();
      });
    },
    draw() {
      // Sample scene I copied from internet for PoC //

      // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
      const light = new BABYLON.HemisphericLight(
        'light1',
        new BABYLON.Vector3(0, 1, 0),
        scene
      );
      // Create a built-in "sphere" shape; its constructor takes 6 params:
      // name, segment, diameter, scene, updatable, sideOrientation
      const sphere = BABYLON.Mesh.CreateSphere(
        'sphere1',
        16,
        2,
        scene,
        false,
        BABYLON.Mesh.FRONTSIDE
      );
      // Move the sphere upward 1/2 of its height
      sphere.position.y = 1;
      // Create a built-in "ground" shape; its constructor takes 6 params :
      // name, width, height, subdivision, scene, updatable
      BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
    }
  };
}

function newEngine(canvasEl) {
  return new BABYLON.Engine(canvasEl, true, {
    preserveDrawingBuffer: true,
    stencil: true
  });
}

function newCamera(scene) {
  return new BABYLON.FreeCamera(
    'camera1',
    new BABYLON.Vector3(0, 5, -10),
    scene
  );
}

function newScene(engine) {
  return new BABYLON.Scene(engine);
}