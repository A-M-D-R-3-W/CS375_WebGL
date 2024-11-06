import * as THREE from 'three';

// Addons
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/*
// importing addons
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// using the addons
const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();
*/



// create a scene
const scene = new THREE.Scene();



// create a camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); // field of view, aspect ratio, near, far



// create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setClearColor(0xffffff, 1); // set background color to white
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );




// add a directional light (required for the model to be visible)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);




// load a model

const loader = new GLTFLoader();
let model; // variable to store the loaded model (allows for manipulation of the model)

loader.load( 'test.glb', function ( gltf ) {
    model = gltf.scene;
	scene.add( model );
}, undefined, function ( error ) {
	console.error( error );
} );



// set the camera position
camera.position.z = 5;


function animate() {

    if (model) {
        model.rotation.x += 0.01;
        model.rotation.y += 0.01;
    }

	renderer.render( scene, camera );

}
