// استيراد مكتبة Three.js وأداة التحكم في المدار من المكتبة
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// استيراد الصور التي تمثل الخلفية والكواكب والنجوم
import starsTexture from '../img/space.png';
import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import venusTexture from '../img/venus.jpg';
import earthTexture from '../img/earth.jpg';
import moonTexture from '../img/moon.png';
import phobosTexture from '../img/phobosbump.jpg';
import deimosTexture from '../img/deimosbump.jpg';
import marsTexture from '../img/mars.jpg';
import jupiterTexture from '../img/jupiter.jpg';
import saturnTexture from '../img/saturn.jpg';
import saturnRingTexture from '../img/saturn ring.png';
import uranusTexture from '../img/uranus.jpg';
import uranusRingTexture from '../img/uranus ring.png';
import neptuneTexture from '../img/neptune.jpg';
import plutoTexture from '../img/pluto.jpg';

// إنشاء كائن render لتحديث المشهد
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// إنشاء المشهد والكاميرا
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// أداة للتحكم في المدار
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

// إضافة إضاءة خافتة
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// إضافة خلفية النجوم
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([starsTexture, starsTexture, starsTexture, starsTexture, starsTexture, starsTexture]);

// تحميل مواد الكواكب
const textureLoader = new THREE.TextureLoader();

// إنشاء الشمس
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({ map: textureLoader.load(sunTexture) });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// دالة لإنشاء كوكب مع مدار منقط فقط في أول ربع
function createPlanetWithDottedOrbitFirstQuarter(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({ map: textureLoader.load(texture) });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);

    // إذا كان للكوكب حلقة
    if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
        const ringMat = new THREE.MeshBasicMaterial({ map: textureLoader.load(ring.texture), side: THREE.DoubleSide });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }

    // إنشاء مدار منقط في أول ربع
    const orbitRadius = position; // نصف القطر للمدار
    const numPoints = 16; // عدد النقاط (يمكنك تقليل العدد للحصول على شكل أوضح)
    const dotGeometry = new THREE.SphereGeometry(0.2, 16, 16); // كائن الكرة الصغيرة
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // لون النقاط

    for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * (Math.PI / 2); // حساب الزاوية من 0 إلى π/2
        const dot = new THREE.Mesh(dotGeometry, dotMaterial); // إنشاء نقطة جديدة
        dot.position.set(
            orbitRadius * Math.cos(angle), // x
            0, // y (نقطة المدار أفقية)
            orbitRadius * Math.sin(angle) // z
        );
        obj.add(dot); // إضافة النقطة إلى الكائن
    }

    scene.add(obj);
    mesh.position.x = position;
    return { mesh, obj };
}

// إنشاء الكواكب باستخدام الدالة الجديدة
const mercury = createPlanetWithDottedOrbitFirstQuarter(3.2, mercuryTexture, 28); // عطارد
const venus = createPlanetWithDottedOrbitFirstQuarter(5.8, venusTexture, 44); // الزهرة

const earthSystem = new THREE.Object3D(); // object لدمج الأرض والقمر في نظام واحد
scene.add(earthSystem);

const earth = createPlanetWithDottedOrbitFirstQuarter(6, earthTexture, 62); // الأرض
earthSystem.add(earth.obj);

const moon = createPlanetWithDottedOrbitFirstQuarter(1.5, moonTexture, 10); // القمر
earth.obj.add(moon.obj);
moon.obj.position.set(62, 0, 0);

const marsSystem = new THREE.Object3D(); // object لدمج المريخ وأقماره في نظام واحد
scene.add(marsSystem);

const mars = createPlanetWithDottedOrbitFirstQuarter(4, marsTexture, 78); // المريخ
marsSystem.add(mars.obj);

const phobosmoon = createPlanetWithDottedOrbitFirstQuarter(0.5, phobosTexture, 8); // phobos قمر 
mars.obj.add(phobosmoon.obj);
phobosmoon.obj.position.set(78, 0, 0);

const deimosmoon = createPlanetWithDottedOrbitFirstQuarter(0.4, deimosTexture, 8); // deimosقمر 
mars.obj.add(deimosmoon.obj);
deimosmoon.obj.position.set(78, 0, 0);

const jupiter = createPlanetWithDottedOrbitFirstQuarter(12, jupiterTexture, 100); // المشتري

const saturn = createPlanetWithDottedOrbitFirstQuarter(10, saturnTexture, 138, { // زحل
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
});

const uranus = createPlanetWithDottedOrbitFirstQuarter(7, uranusTexture, 176, { // أورانوس
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
});

const neptune = createPlanetWithDottedOrbitFirstQuarter(7, neptuneTexture, 200); // نبتون 

const pluto = createPlanetWithDottedOrbitFirstQuarter(2.8, plutoTexture, 216); // بلوتو



// إضافة ضوء نقطة
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

// التحريك
function animate() {
    // دوران الكواكب حول نفسها
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    moon.mesh.parent.rotateY(0.08);
    phobosmoon.mesh.parent.rotateY(0.02);
    deimosmoon.mesh.parent.rotateY(0.03);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);
    pluto.mesh.rotateY(0.008);

    // دوران الكواكب حول الشمس
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earthSystem.rotateY(0.01);
    marsSystem.rotateY(0.005);
    phobosmoon.obj.rotateY(0.06);
    deimosmoon.obj.rotateY(0.02);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);

    renderer.render(scene, camera);
}

// استدعاء دالة التحريك
function render() {
    animate();
    requestAnimationFrame(render);
}

// تحديث حجم المشهد
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// بدء التحريك
render();
