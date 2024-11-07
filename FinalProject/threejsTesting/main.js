import * as THREE from 'three';

// Addons
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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



// create a scene
scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd); // set background color to light grey


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
hemiLight = new THREE.HemisphereLight( 0xffeeb1, 0x080820, 4 );
scene.add( hemiLight );


// add a spot light to simulate the main light source
spotLight = new THREE.SpotLight( 0xffa95c, 10 );
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
spotLight.shadow.mapSize.width = 1024*4;
spotLight.shadow.mapSize.height = 1024*4;
scene.add( spotLight );





// create a floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // rotate the plane to lie on the XY plane
floor.position.z = -0.01; // slightly offset to avoid z-fighting
floor.receiveShadow = true;
scene.add(floor);



// load a model

loader = new GLTFLoader();

let modelScale = 0.02;

loader.load( 'motocycle.glb', function ( gltf ) {
    model = gltf.scene;
    model.position.set(0,0,0);

    model.scale.set(modelScale, modelScale, modelScale);

    model.traverse(n => {
        if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
            if (n.material.map) {
                n.material.map.anisotropy = 16;
            }
        }
    });


	scene.add( model );
}, undefined, function ( error ) {
	console.error( error );
} );





// add axes
axesHelper = new THREE.AxesHelper( 10 );

scene.add( axesHelper );




function animate() {

    controls.update();

    spotLight.position.set( camera.position.x + 10, camera.position.y + 10, camera.position.z + 10 ); // set the spot light position to the camera position

    /*if (model) {
        model.rotation.x += 0.01;
        model.rotation.y += 0.01;
    }*/

	renderer.render( scene, camera );

}
