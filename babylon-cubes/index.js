// Copyright (c) 2022 Tobias Briones. All rights reserved.
// SPDX-License-Identifier: MIT
//
// This source code is part of
// https://github.com/tobiasbriones/cp-unah-is910-simulation-theory and is
// licensed under the MIT License found in the LICENSE file in the root
// directory of this source tree or at https://opensource.org/licenses/MIT

document.addEventListener('DOMContentLoaded', init);

const BOX_SIZE = 50;

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
  const initCamera = (canvasEl) => {
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvasEl, true);
  };
  const initLight = () => {
    const light = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.groundColor = new BABYLON.Color3(0.4, 0.4, 0.4);
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
      camera = newCamera(scene, canvasEl);

      initCamera(canvasEl);
      initLight();
      runRenderLoop();

      window.addEventListener('reBOX_SIZE', () => {
        engine.reBOX_SIZE();
      });
    },
    draw() {
      newBox(scene, 'box1', { x: 0, y: 0, z: 0 });
      newBox(scene, 'box2', { x: 0, y: BOX_SIZE, z: BOX_SIZE });
      newBox(scene, 'box3', { x: BOX_SIZE, y: 0, z: BOX_SIZE });
      newBox(scene, 'box4', { x: BOX_SIZE, y: BOX_SIZE, z: BOX_SIZE * 2 });
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

function newBox(scene, name, pos) {
  const BOX_SIZE = 50;
  const gizmo = BABYLON.Mesh.CreateBox(name, 10, scene, true);
  const addEdges = i => {
    gizmo.slaves[i].enableEdgesRendering();
    gizmo.slaves[i].edgesWidth = 25.0;
    gizmo.slaves[i].edgesColor = new BABYLON.Color4(0, 0, 0, 1);
  };

  gizmo.isPickable = false;
  gizmo.slaves = [];
  for (let i = 0; i < 6; i++) {
    gizmo.slaves[i] = BABYLON.Mesh.CreatePlane(name + i, BOX_SIZE, scene, true);
    gizmo.slaves[i].parent = gizmo;
    addEdges(i);
    gizmo.slaves[i].material = new BABYLON.StandardMaterial('mat', scene);
    gizmo.slaves[i].material.diffuseColor = BABYLON.Color3.Random();
    gizmo.slaves[i].material.alpha = 1;
  }
  gizmo.slaves[0].position = new BABYLON.Vector3(
    pos.x - BOX_SIZE / 2,
    pos.y,
    pos.z
  );
  gizmo.slaves[0].rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
  gizmo.slaves[1].position = new BABYLON.Vector3(
    pos.x,
    pos.y,
    pos.z + BOX_SIZE / 2
  );
  gizmo.slaves[1].rotation = new BABYLON.Vector3(0, Math.PI, 0);
  gizmo.slaves[2].position = new BABYLON.Vector3(
    pos.x + BOX_SIZE / 2,
    pos.y,
    pos.z
  );
  gizmo.slaves[2].rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
  gizmo.slaves[3].position = new BABYLON.Vector3(
    pos.x,
    pos.y + BOX_SIZE / 2,
    pos.z
  );
  gizmo.slaves[3].rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
  gizmo.slaves[4].position = new BABYLON.Vector3(
    pos.x,
    pos.y - BOX_SIZE / 2,
    pos.z
  );
  gizmo.slaves[4].rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0);
  gizmo.slaves[5].position = new BABYLON.Vector3(
    pos.x,
    pos.y,
    pos.z - BOX_SIZE / 2
  );
  gizmo.slaves[5].rotation = new BABYLON.Vector3(0, 0, 0);
  return gizmo;
}