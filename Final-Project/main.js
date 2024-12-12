import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { API_KEY } from './apikeys.js';

const headers = { Authorization: `Bearer ${API_KEY}` };

let targetSize, pivot, stats, scene, camera, renderer, controls, model, axesHelper, loader, hemiLight, spotLight;

let debug = true;
let rotate = true;

init();

function init() {
    // create a scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd); // set background color to light grey
    scene.fog = new THREE.Fog(0xcccccc, 10, 50); // add fog to the scene (color, near, 50)

    // create a renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping; // tone mapping
    renderer.toneMappingExposure = 2.3; // tone mapping exposure, because the default is too dark
    renderer.shadowMap.enabled = true; // enable shadows
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    // Camera stuff

    // create a camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // field of view, aspect ratio, near, far

    // set the camera position
    camera.position.set(0, 5, 5); // x, y, z

    // add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);

    // add a hemisphere light simulating the sun
    hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    // add a spot light to simulate the main light source
    spotLight = new THREE.DirectionalLight(0xffffff, 5);
    spotLight.position.set(10, 10, 10);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize.width = 1024 * 4;
    spotLight.shadow.mapSize.height = 1024 * 4;
    scene.add(spotLight);

    // floor - these should be declared at the top
    const floorSize = 1000;

    // create a floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(floorSize, floorSize), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // add a grid to the floor
    const grid = new THREE.GridHelper(floorSize, (floorSize / 2), 0x000000, 0x000000); // size, divisions, colorCenterLine, colorGrid
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    loader = new GLTFLoader();

    targetSize = 5;

    controls.target.set(0, targetSize / 2, 0);
    controls.update();

    if (debug) {
        // add axes
        axesHelper = new THREE.AxesHelper(10);
        scene.add(axesHelper);

        // initialize stats
        stats = new Stats();
        document.body.appendChild(stats.dom);
    }

    window.addEventListener('resize', onWindowResize);
}

function animate() {
    if (debug) {
        stats.update();
    }

    if (pivot && rotate) {
        pivot.rotation.y += 0.001;
    }

    renderer.render( scene, camera );
}

function loadModel(url) {
    loader.load(url, function (gltf) {
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

            const debugToggle = document.getElementById('debugToggle');
            debugToggle.style.display = 'block';

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
}

function unloadModel() {
    if (model) {

        pivot.remove(model);
        scene.remove(pivot);

        model.traverse(n => {
            if (n.isMesh) {
                n.geometry.dispose();
                if (n.material.isMaterial) {
                    cleanMaterial(n.material);
                } else {
                    for (const material of n.material) cleanMaterial(material);
                }
            }
        });

        model = null;
        pivot = null;
    }
}

function cleanMaterial(material) {
    material.dispose();

    for (const key in material) {
        if (material[key] && material[key].isTexture) {
            material[key].dispose();
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


// Meshy API ----------------------------------------------------------------------------


async function meshy_main() {
    const prompt = document.getElementById('promptInput').value;
    console.log('Prompt:', prompt);
    document.getElementById('taskStatus').innerText = 'Creating task...';
    const taskId = await createTask(prompt);
    if (!taskId) return;

    const intervalId = setInterval(async () => {
        const data = await checkTaskStatus(taskId);
        const status = data.status;
        const progress = data.progress;
        document.getElementById('taskStatus').innerText = `Preview: ${status}`;
        if (status === 'IN_PROGRESS') {
            document.getElementById('taskStatus').innerText += ` (${progress}%)`;
        }
        if (status === 'SUCCEEDED') {
            console.log('Task succeeded');
            clearInterval(intervalId);
            document.getElementById('taskStatus').innerText = 'Preview: Succeeded';
            unloadModel();
            loadModel(data.model_urls.glb);
            showRefineButton(taskId); // show the refine button
        }
        if (status === 'FAILED') {
            console.log('Task failed');
            clearInterval(intervalId);
            document.getElementById('taskStatus').innerText = 'Preview: Failed';
        }
    }, 1000); // check every second
}

async function checkTaskStatus(taskId) {
    try {
        const response = await axios.get(
            `https://api.meshy.ai/v2/text-to-3d/${taskId}`,
            { headers }
        );
        console.log('Task status:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error checking task status:', error);
    }
}

async function createTask(prompt) {
    const payload = {
        mode: 'preview',
        prompt: prompt,
        ai_model: 'meshy-4',
        topology: 'quad',
        negative_prompt: 'low quality, low resolution, low poly, ugly',
    };

    try {
        const response = await axios.post(
            'https://api.meshy.ai/v2/text-to-3d',
            payload,
            { headers }
        );
        console.log('Task created:', response.data);
        return response.data.result;
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

async function refineTask(previewTaskId) {
    const refinePayload = {
        mode: 'refine',
        preview_task_id: previewTaskId,
    };

    try {
        const response = await axios.post(
            'https://api.meshy.ai/v2/text-to-3d',
            refinePayload,
            { headers }
        );
        console.log('Refine task created:', response.data);
        const refineTaskId = response.data.result;

        const intervalId = setInterval(async () => {
            const data = await checkTaskStatus(refineTaskId);
            const status = data.status;
            const progress = data.progress;
            document.getElementById('taskStatus').innerText = `Refine: ${status}`;
            if (status === 'IN_PROGRESS') {
                document.getElementById('taskStatus').innerText += ` (${progress}%)`;
            }
            if (status === 'SUCCEEDED') {
                console.log('Refine task succeeded');
                clearInterval(intervalId);
                unloadModel();
                loadModel(data.model_urls.glb);
                document.getElementById('taskStatus').innerText = 'Refine: Succeeded';
                showDownloadButton(data.model_urls.glb); // show the download button
            }
            if (status === 'FAILED') {
                console.log('Refine task failed');
                clearInterval(intervalId);
                document.getElementById('taskStatus').innerText = 'Refine: Failed';
            }
        }, 1000); // check every second
    } catch (error) {
        console.error('Error creating refine task:', error);
    }
}

function showRefineButton(previewTaskId) {
    const refineButton = document.getElementById('refine');
    refineButton.style.display = 'block';
    refineButton.addEventListener('click', () => refineTask(previewTaskId));
}

function showDownloadButton(modelUrl) {
    const downloadButton = document.getElementById('download');
    downloadButton.style.display = 'block';
    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = modelUrl;
        link.download = 'refined_model.glb';
        link.click();
    });
}



document.getElementById('generate').addEventListener('click', meshy_main);