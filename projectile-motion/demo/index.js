// Copyright (c) 2022 Tobias Briones. All rights reserved.
// SPDX-License-Identifier: MIT
//
// This source code is part of
// https://github.com/tobiasbriones/cp-unah-is910-simulation-theory and is
// licensed under the MIT License found in the LICENSE file in the root
// directory of this source tree or at https://opensource.org/licenses/MIT

document.addEventListener('DOMContentLoaded', init);

const WIDTH = 160;
const HEIGHT = 160;
const OX = -WIDTH / 2;
const OY = -HEIGHT / 2;

function init() {
  const canvasEl = document.getElementById('canvas');
  const main = Main();

  main.init(canvasEl);
}

function Main() {
  let engine;
  let scene;
  let camera;
  const initCamera = (canvasEl) => {
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvasEl, true);
  };
  const initLight = () => {
    const light = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(OX + WIDTH / 2, OY + HEIGHT / 2, 0),
      scene
    );
    light.groundColor = new BABYLON.Color3(0, 0, 0);
    light.intensity = 0.7;
    scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.9);
  };
  const runRenderLoop = () => {
    engine.runRenderLoop(() => {
      scene.render();
    });
  };

  return {
    init(canvasEl) {
      engine = newEngine(canvasEl);
      scene = newScene(engine);
      camera = newCamera(scene, canvasEl);

      initCamera(canvasEl);
      initLight();
      runRenderLoop();
      window.addEventListener('resize', () => {
        engine.resize();
      });
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
  return new BABYLON.ArcRotateCamera(
    'camera1',
    -Math.PI / 2,
    1.2,
    300,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
}

function newScene(engine) {
  return new BABYLON.Scene(engine);
}
