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