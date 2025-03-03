import * as THREE from './three.module.jpg';
import { GLTFLoader } from './three.module.jpg';
import { DRACOLoader } from './three.module.jpg';
import { OrbitControls } from './three.module.jpg';

// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
// Adjust Camera Position
camera.position.set(20, -18, -50); // Move closer (Z), lower (Y)

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Load Draco-Compressed Model
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);

loader.load(
    './models/moon.gltf',
    (gltf) => {
        console.log("Model loaded successfully!");
        const moon = gltf.scene;
        moon.position.set(-10, -20, -10); // Adjust X (left), Y (up), Z (back)
        moon.scale.set(3, 3, 3);
        moon.rotation.y = Math.PI / 3;

        // Darken the material
        moon.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(0x999990);
            }
        });

        scene.add(moon);
    },
    (xhr) => {
        console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (error) => {
        console.error("Error loading model:", error);
    }
);

// ⭐ Function to Add Random Stars in Background
function addStars() {
    const starGeometry = new THREE.SphereGeometry(THREE.MathUtils.randFloat(0.02, 0.08), 8, 8); // Small stars
    const starMaterials = [
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // White
        new THREE.MeshBasicMaterial({ color: 0xffd700 }), // Gold
        new THREE.MeshBasicMaterial({ color: 0xff69b4 }), // Pink
        new THREE.MeshBasicMaterial({ color: 0xadd8e6 }), // Light Blue
        new THREE.MeshBasicMaterial({ color: 0xff4500 })  // Orange Red
    ];

    for (let i = 0; i < 2000; i++) { // Keep or increase star count
        const material = starMaterials[Math.floor(Math.random() * starMaterials.length)]; // Random colors
        const star = new THREE.Mesh(starGeometry.clone(), material);

        // Push stars further by increasing the spread value
        const [x, y, z] = [
            THREE.MathUtils.randFloatSpread(200), // Increase spread from 200 → 500
            THREE.MathUtils.randFloatSpread(200),
            THREE.MathUtils.randFloatSpread(200)
        ];
        star.position.set(x, y, z);

        // Adjust brightness randomly
        star.material.opacity = THREE.MathUtils.randFloat(0.3, 1);
        star.material.transparent = true;

        scene.add(star);
    }
}

// Add Stars to Scene
addStars();

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

controls.minDistance = 35;  // Minimum zoom-in distance (closer)
controls.maxDistance = 55; // Maximum zoom-out distance (farther)
// 🚫 Restrict Rotation Angles (Prevent full rotation)
controls.minPolarAngle = Math.PI / 1.8; // Prevent looking too far up
controls.maxPolarAngle = Math.PI / 1.68; // Prevent looking too far down

// 🚫 Restrict Horizontal Rotation (Optional)
controls.minAzimuthAngle = -Math.PI / 6; // Limit left rotation
controls.maxAzimuthAngle = Math.PI / 1;  // Limit right rotation

controls.enableDamping = true;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Smooth Scroll for Sidebar Links
document.querySelectorAll('#sidebar a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: "smooth"
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const overviewCard = document.getElementById("overview-card");
    const closeCard = document.getElementById("close-card");
    const overviewLink = document.querySelector("#sidebar a[href='#overview']");

    // Show card with animation
    overviewLink.addEventListener("click", (event) => {
        event.preventDefault();
        overviewCard.classList.add("show");
    });

    // Close card
    closeCard.addEventListener("click", () => {
        overviewCard.classList.remove("show");
    });

    // Close card when clicking outside
    document.addEventListener("click", (event) => {
        if (!overviewCard.contains(event.target) && event.target !== overviewLink) {
            overviewCard.classList.remove("show");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const experienceCard = document.getElementById("experience-card");
    const closeExperienceCard = document.getElementById("close-experience-card");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const experienceText = document.getElementById("experience-text");
    const experienceLink = document.querySelector("#sidebar a[href='#experience']");

    // Experience List
    const experiences = [
        "🚀 Software Engineer at XYZ - Worked on full-stack development.",
        "🎨 UI/UX Designer - Designed interactive interfaces.",
        "💡 Product Manager - Led multiple teams to success.",
        "📊 Data Analyst - Analyzed big data trends."
    ];

    let currentIndex = 0;

    // Show Experience Card
    experienceLink.addEventListener("click", (event) => {
        event.preventDefault();
        experienceCard.classList.add("show");
        experienceText.innerText = experiences[currentIndex];
    });

    // Close Card
    closeExperienceCard.addEventListener("click", () => {
        experienceCard.classList.remove("show");
    });

    // Navigate Left
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + experiences.length) % experiences.length;
        experienceText.innerText = experiences[currentIndex];
    });

    // Navigate Right
    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % experiences.length;
        experienceText.innerText = experiences[currentIndex];
    });

    // Close when clicking outside
    document.addEventListener("click", (event) => {
        if (!experienceCard.contains(event.target) && event.target !== experienceLink) {
            experienceCard.classList.remove("show");
        }
    });
});


// Load Texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('./images/earth.jpg');

// Create Sphere Geometry
const earthGeometry = new THREE.SphereGeometry(300, 100, 100); // Radius, Width Segments, Height Segments
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
let earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);

// Position the Sphere Inside the Card
earthSphere.position.set(100, 600, 1100); // Center it above the card
scene.add(earthSphere);

// Add Light for Better Visibility
const earthLight = new THREE.PointLight(0xffffff, 20, 10);
earthLight.position.set(2, 9, 2);
scene.add(earthLight);


