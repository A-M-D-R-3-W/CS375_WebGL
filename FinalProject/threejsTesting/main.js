import * as THREE from 'three';

// Addons
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';


// todo: add auto resize window event listener



// demos
// https://threejs.org/examples/#webgl_lights_rectarealight
// https://threejs.org/examples/#webgl_loader_3ds
// https://threejs.org/examples/#webgl_loader_collada_kinematics
// floor setup https://threejs.org/examples/#webgl_loader_fbx
// optimization https://threejs.org/examples/#webgl_loader_gltf_compressed
// https://threejs.org/examples/#webgl_loader_gltf_sheen
// vox loader https://threejs.org/examples/#webgl_loader_vox


let scene, camera, renderer, controls, model, axesHelper, light, loader, hemiLight, spotLight;

let debug = true;


// create a scene
scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd); // set background color to light grey
scene.fog = new THREE.Fog( 0xcccccc, 10, 50 ); // add fog to the scene (color, near, 50)


// create a renderer
renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ReinhardToneMapping; // tone mapping
renderer.toneMappingExposure = 2.3; // tone mapping exposure, because the default is too dark
renderer.shadowMap.enabled = true; // enable shadows
//renderer.setClearColor(0xffffff, 1); // set background color to white
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );





// Camera stuff

// create a camera
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); // field of view, aspect ratio, near, far

// set the camera position
camera.position.set(0,5,5); // x, y, z

// add orbit controls
controls = new OrbitControls( camera, renderer.domElement );









// add a directional light (required for the model to be visible)
//light = new THREE.DirectionalLight(0xffffff, 1);
//light.position.set(1, 1, 1).normalize();
//scene.add(light);


// add a hemisphere light simulating the sun
hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 5 );
//hemiLight = new THREE.HemisphereLight( 0xffeeb1, 0x080820, 4 );
hemiLight.position.set(0, 50, 0);
scene.add( hemiLight );


// add a spot light to simulate the main light source
spotLight = new THREE.DirectionalLight( 0xffffff, 5 );
//spotLight = new THREE.SpotLight( 0xffa95c, 10 );
spotLight.position.set( 10, 10, 10 );
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
spotLight.shadow.mapSize.width = 1024*4;
spotLight.shadow.mapSize.height = 1024*4;
scene.add( spotLight );





// floor - these should be declared at the top

const floorSize = 1000;

// create a floor
const floor = new THREE.Mesh( new THREE.PlaneGeometry( floorSize, floorSize ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
floor.rotation.x = - Math.PI / 2;
floor.receiveShadow = true;
scene.add( floor );

// add a grid to the floor
const grid = new THREE.GridHelper( floorSize, (floorSize/2), 0x000000, 0x000000 ); // size, divisions, colorCenterLine, colorGrid
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add( grid );










let pivot;



// load a model

loader = new GLTFLoader();

let targetSize = 5;


controls.target.set(0, targetSize/2, 0);
controls.update();


loader.load('motocycle.glb', function (gltf) {
    model = gltf.scene;
    model.position.set(0, 0, 0);

    // compute the bounding box of the model
    const box = new THREE.Box3().setFromObject(model);

    // compute and log the original model size
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log("Original Model Size: ", size);

    // calculate the scale factor to fit with a 5x5x5 box
    const scaleFactor = targetSize / Math.max(size.x, size.y, size.z);

    // apply the scale factor to the model
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // recompute the bounding box after scaling
    const scaledBox = new THREE.Box3().setFromObject(model);
    const minY = scaledBox.min.y;

    // compute and log the scaled model size
    const scaledSize = new THREE.Vector3();
    scaledBox.getSize(scaledSize);
    console.log("Scaled Model Size: ", scaledSize);

    // adjust the model's position so that it sits on the floor
    model.position.y -= minY;





    // calculate the center of the bounding box
    let boxCenter = new THREE.Vector3();
    scaledBox.getCenter(boxCenter);

    // offset the model so that the center of the bounding box is at the origin
    const offsetX = boxCenter.x;
    const offsetZ = boxCenter.z;
    model.position.z -= offsetZ;
    model.position.x -= offsetX;

    


    //scene.add(model);

    
    // add shadows to the model
    model.traverse(n => {
        if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
            if (n.material.map) {
                n.material.map.anisotropy = 16;
            }
        }
    });



    
    if (debug) {
        // create and add the bounding box helper
        const boxHelper = new THREE.BoxHelper(model, 0xffff00);
        scene.add(boxHelper);

        // create a (target size) box around the model to verify the scaling
        const boxGeometry = new THREE.BoxGeometry(targetSize, targetSize, targetSize);
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.position.y += targetSize / 2;
        scene.add(boxMesh);
    }



    // create a pivot point for the model, so that it rotates around the center of its bounding box

    let pivotBox = new THREE.Box3().setFromObject(model);
    let pivotCenter = new THREE.Vector3();
    pivotBox.getCenter(pivotCenter);
    pivot = new THREE.Object3D();
    pivot.position.copy(pivotCenter);
    model.position.sub(pivotCenter);
    pivot.add(model);
    scene.add(pivot);


}, undefined, function (error) {
    console.error(error);
});








// helpers

let stats;

if (debug) {
    // add axes
    axesHelper = new THREE.AxesHelper( 10 );
    scene.add( axesHelper );

    // Initialize Stats
    stats = new Stats();
    document.body.appendChild(stats.dom);
}





window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
    // borrowed from https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_gltf_compressed.html

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    animate();

}








let rotate = true;

function animate() {

    //controls.update();

    if (debug) {
        stats.update();
    }

    if (pivot && rotate) {
        
        pivot.rotation.y += 0.001;
    }



	renderer.render( scene, camera );

}
