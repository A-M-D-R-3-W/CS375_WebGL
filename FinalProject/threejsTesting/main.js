import * as THREE from 'three';

// Addons
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
/*
// importing addons
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// using the addons
const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();
*/

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
renderer = new THREE.WebGLRenderer();
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

// create a floor
const floor = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
floor.rotation.x = - Math.PI / 2;
floor.receiveShadow = true;
scene.add( floor );

// add a grid to the floor
const grid = new THREE.GridHelper( 100, 50, 0x000000, 0x000000 ); // size, divisions, colorCenterLine, colorGrid
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add( grid );






// load a model

loader = new GLTFLoader();

let modelScale = 0.02;

loader.load( 'motocycle.glb', function ( gltf ) {
    model = gltf.scene;
    model.position.set(0,0,0);

    model.scale.set(modelScale, modelScale, modelScale);

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

    // compute the bounding box
    const box = new THREE.Box3().setFromObject(model);
    const minY = box.min.y;

    // move the model to the floor
    model.position.y -= minY;

    // add the model to the scene
	scene.add( model );

    if (debug) {
        // create the bounding box helper (visual representation of the bounding box)
        const helper = new THREE.Box3Helper( box, 0xffff00 );
        scene.add( helper );
    }


}, undefined, function ( error ) {
	console.error( error );
} );




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




function animate() {

    controls.update();

    if (debug) {
        stats.update();
    }

    //spotLight.position.set( camera.position.x + 10, camera.position.y + 10, camera.position.z + 10 ); // set the spot light position to the camera position

    /*if (model) {
        model.rotation.x += 0.01;
        model.rotation.y += 0.01;
    }*/

	renderer.render( scene, camera );

}
