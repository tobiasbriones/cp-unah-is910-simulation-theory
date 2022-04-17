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
const TY_MAX = 4;

function init() {
  const canvasEl = document.getElementById('canvas');
  const main = Main();

  main.init(canvasEl);
}

function Main() {
  let engine;
  let scene;
  let camera;
  let lastMesh;
  const state = newState();
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
  const baseDraw = () => {
    newAxes(scene);
    newCurve(scene);
  };
  const draw = () => {
    if (lastMesh) {
      lastMesh.dispose();
    }
    lastMesh = newSphere(scene, state);
    state.nextTick();
  };
  const runRenderLoop = () => {
    engine.runRenderLoop(() => {
      scene.render();
      draw();
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
      baseDraw();
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

function newState() {
  let t = 0;
  let direction = 1;
  let time = performance.now();
  return {
    pos() {
      return toPixels(t);
    },
    nextTick() {
      const newTime = performance.now();
      const deltaSec = (newTime - time) / 1000;
      t += direction * deltaSec;
      time = newTime;

      if (t < 0 || t > TY_MAX) {
        direction *= -1;

        if (t < 0) {
          t = 0;
        }
        else if (t > TY_MAX) {
          t = TY_MAX;
        }
      }
    }
  };
}

function newAxes(scene) {
  line2D('y-axis', {
    path: [
      new BABYLON.Vector3(OX, OY, 0),
      new BABYLON.Vector3(OX, OY + HEIGHT, 0)
    ],
    width: 0.5,
    scene
  });
  line2D('x-axis', {
    path: [
      new BABYLON.Vector3(OX, OY, 0),
      new BABYLON.Vector3(OX + WIDTH, OY, 0)
    ],
    width: 0.5,
    scene
  });
}

function newCurve(scene) {
  // Domain from 0 to 4
  const steps = 40;
  const axisStep = WIDTH / steps;

  for (let i = 0; i < WIDTH; i += axisStep) {
    const t = toDomain(i);
    const y = evalFn(t);
    const tEnd = toDomain(i + axisStep / 2);
    const yEnd = evalFn(tEnd);

    line2D(`step-${ i }`, {
      path: [
        new BABYLON.Vector3(OX + i, OY + toPixels(y), 0),
        new BABYLON.Vector3(OX + toPixels(tEnd), OY + toPixels(yEnd), 0)
      ],
      width: 0.5,
      scene
    });
  }
}

function newSphere(scene, state) {
  const i = state.pos();
  const x = toDomain(i);
  const y = evalFn(x);
  const mesh = new BABYLON.MeshBuilder.CreateCapsule(
    'capsule',
    { radius: 4 },
    scene
  );
  mesh.position = new BABYLON.Vector3(OX + i, OY + toPixels(y), 0);
  return mesh;
}

function evalFn(x) {
  return -Math.pow(x - 2, 2) + 4;
}

function toDomain(i) {
  return (i / WIDTH) * TY_MAX;
}

function toPixels(w) {
  return (w / TY_MAX) * WIDTH;
}
