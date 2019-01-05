import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-full';
import * as _ from 'lodash';
import TWEEN from '@tweenjs/tween.js';


const calculateRGB = ({ xi, yi, zi, x, y, z, offset = 0 }) => {
  const r = Math.max(Math.sin(Math.PI * (xi / x) + offset), 0);
  const g = Math.max(Math.sin(Math.PI * (yi / y) + offset), 0);
  const b = Math.max(Math.sin(Math.PI * (zi / z) + offset), 0);
  const a = r * g * b;
  return { r, g, b, a };
};

const generateGrid = ({ edgeSize, x, y, z }) => (group) => (
  _.range(x).map(xi =>
    _.range(y).map(yi =>
      _.range(z).map(zi => {
        const box = new THREE.BoxBufferGeometry(1, 1, 1);
        const { r, g, b, a } = calculateRGB({ xi, yi, zi, x, y, z });

        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(r, g, b),
          transparent: true,
          opacity: a
        });
        const cube = new THREE.Mesh(box, material);

        cube.position.set(
          xi * (edgeSize / x),
          yi * (edgeSize / y),
          zi * (edgeSize / z),
        );
        group.add(cube);
        return { cube, xi, yi, zi, x, y, z };
      })
    )
  )
)

class App extends Component {
  constructor(props) {
    super(props);

    this.mouse = new THREE.Vector2();
  }

  componentDidMount() {
    if (!this.root) return;

    const renderer = new THREE.WebGLRenderer();
    this.renderer = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    this.root.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera = camera;
    camera.position.set(75, 75, 75);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const scene = new THREE.Scene();
    this.scene = scene;
    scene.background = new THREE.Color(0xffffff);

    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    light.castShadow = true;
    light.position.set(1, 0.9, 0);
    scene.add(light);

    // const gridHelper = new THREE.GridHelper(100, 100);
    // scene.add(gridHelper);

    this.group = new THREE.Group();
    const grid = generateGrid({ edgeSize: 50, x: 20, y: 20, z: 20 })(this.group);
    this.group.position.set(-25, -25, -25);

    scene.add(this.group);

    this.orbitControl = new OrbitControls(camera);
    this.orbitControl.autoRotate = true;

    document.addEventListener('mousemove', this.onMouseMove, false);

    // const obj = { x: 0 };
    // const tween = new TWEEN.Tween(obj)
    //   .to({ x: Math.PI }, 10000)
    //   .easing(TWEEN.Easing.Quadratic.Out)
    //   .onUpdate(() => {
    //     grid.forEach(xx => {
    //       xx.forEach(yy => {
    //         yy.forEach(({ cube, xi, yi, zi, x, y, z }) => {
    //           const { opacityX, opacityY, opacityZ } = calculateOpacity({ xi, yi, zi, x, y, z, offset: 0 });
    //           cube.material.color.setRGB(opacityX, opacityY, opacityZ);
    //         })
    //       })
    //     })
    //   })
    //   // .start();
    //
    // tween.onComplete(() => {
    //   tween.start()
    // });

    // begin
    requestAnimationFrame(this.animate);
  }

  registerGamepad() {
    window.addEventListener('gamepadconnected', e => {
      this.gamepad = navigator.getGamepads()[e.gamepad.index];
    });
  }

  onMouseMove = (event) => {
    event.preventDefault();
    this.mouse = this.mouse || new THREE.Vector2();
    this.mouse.x = (event.clientX / window.innerWidth) * 2;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.mouse, this.camera);
    // [this.intersects] = raycaster.intersectObjects([this.object]);
  }

  animate = (time) => {
    this.update();
    this.orbitControl.update();

    this.renderScene();

    requestAnimationFrame(this.animate);
    // TWEEN.update(time)
    // stats.update();
  }

  update = () => {
    // this.group.position.add(0, 0, 0);
    // if (!this.gamepad) return;
    // const gamepad = navigator.getGamepads()[0];
    // const translateX = gamepad.axes[AXES.LEFT.X];
    // const translateY = -1 * gamepad.axes[AXES.LEFT.Y];
    // this.cube.position.set(10, 0, 0);
  }

  renderScene = () => {
    // if (this.intersects && this.intersects.object === this.object) {
    //   this.object.material = defaultMaterial;
    // } else if (this.object) {
    //   this.object.material = outlineMaterial;
    // }

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div ref={ref => { this.root = ref; }} />
    );
  }
}

export default App;
