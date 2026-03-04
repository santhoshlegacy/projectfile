// ⚠️ Update this with your actual URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRBvOtEB06Ds6zFbU20inx0PmQY_fWqKE32ciydVdBL9mIKwqcATSPsO16YxWHFt5c/exec";

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 1000, once: true });
    
    // Session Check
    if (localStorage.getItem('gamerSession') === 'active') {
        document.getElementById('authGate').style.display = 'none';
    }
    // Initial call for full page canvas height
    resizeCanvas();
});

// --- AUTH TAB TOGGLE FIX ---
function toggleAuthTab(type) {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');

    if (type === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTab.className = "flex-1 py-5 heading-font text-[10px] tracking-widest uppercase font-bold text-cyan-400 border-b-2 border-cyan-400";
        registerTab.className = "flex-1 py-5 heading-font text-[10px] tracking-widest uppercase font-bold text-gray-500 border-none";
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        registerTab.className = "flex-1 py-5 heading-font text-[10px] tracking-widest uppercase font-bold text-purple-500 border-b-2 border-purple-500";
        loginTab.className = "flex-1 py-5 heading-font text-[10px] tracking-widest uppercase font-bold text-gray-500 border-none";
    }
}

// --- MODAL CONTROLS ---
function openContactModal() {
    document.getElementById('contactModal').classList.add('modal-active');
}
function closeContactModal() {
    document.getElementById('contactModal').classList.remove('modal-active');
}

// --- NEW: MOBILE MENU TOGGLE ---
function toggleMobileMenu() {
    console.log("Menu clicked!"); // Check panna console-la idhu varudha-nu paarunga
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
        // Scroll lock logic
        if (menu.classList.contains('flex')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
}
// --- LOGIN LOGIC ---
document.getElementById('form-login').onsubmit = async (e) => {
    e.preventDefault();
    const status = document.getElementById('authStatus');
    const btn = e.target.querySelector('button');
    status.innerHTML = "<span class='animate-pulse text-cyan-400'>AUTHENTICATING...</span>";
    btn.disabled = true;

    const formData = new URLSearchParams();
    formData.append('action', 'login');
    formData.append('tag', document.getElementById('login-tag').value.trim());
    formData.append('key', document.getElementById('login-key').value);

    try {
        const response = await fetch(SCRIPT_URL, { method: 'POST', body: formData });
        const result = await response.text();
        if (result.trim() === "Valid") {
            localStorage.setItem('gamerSession', 'active');
            window.location.reload();
        } else {
            status.innerHTML = "<span class='text-red-500'>INVALID TAG OR KEY</span>";
            btn.disabled = false;
        }
    } catch (err) {
        status.innerHTML = "<span class='text-red-500'>SERVER ERROR</span>";
        btn.disabled = false;
    }
};

// --- REGISTER LOGIC ---
document.getElementById('form-register').onsubmit = async (e) => {
    e.preventDefault();
    const status = document.getElementById('authStatus');
    const btn = e.target.querySelector('button');
    btn.innerText = "REGISTERING...";
    btn.disabled = true;

    const formData = new URLSearchParams();
    formData.append('action', 'register');
    formData.append('name', document.getElementById('reg-name').value);
    formData.append('email', document.getElementById('reg-email').value);
    formData.append('tag', document.getElementById('reg-tag').value);
    formData.append('key', document.getElementById('reg-pass').value);

    try {
        await fetch(SCRIPT_URL, { method: 'POST', body: formData });
        status.innerHTML = "<span class='text-green-500'>REGISTERED! SWITCHING TO LOGIN...</span>";
        setTimeout(() => toggleAuthTab('login'), 2000);
    } catch (err) {
        status.innerHTML = "<span class='text-red-500'>ERROR SAVING DATA</span>";
    } finally {
        btn.innerText = "Complete Registration";
        btn.disabled = false;
    }
};

// --- MAIL AUTOMATION (BOOKING) ---
document.getElementById('form-booking').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "TRANSMITTING...";
    btn.disabled = true;

    const formData = new URLSearchParams();
    formData.append('action', 'booking');
    formData.append('name', e.target[0].value);
    formData.append('email', e.target[1].value);
    formData.append('message', e.target[2].value);

    try {
        await fetch(SCRIPT_URL, { method: 'POST', body: formData });
        alert("Success! Confirmation mail has been sent.");
        e.target.reset();
        closeContactModal();
    } catch (err) {
        alert("Failed to send request.");
    } finally {
        btn.innerText = "Send Request";
        btn.disabled = false;
    }
};

// --- LOGOUT ---
function handleLogout() {
    if(confirm("Terminate session?")) {
        localStorage.removeItem('gamerSession');
        window.location.reload();
    }
}

// --- NEW: SCROLL TO TOP LOGIC ---
window.addEventListener('scroll', () => {
    const btn = document.getElementById("scrollTop");
    if (btn) {
        if (window.scrollY > 500) {
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
        } else {
            btn.style.opacity = "0";
            btn.style.pointerEvents = "none";
        }
    }
});

// Window click controls for modals
window.onclick = (e) => {
    if (e.target.id === 'contactModal') closeContactModal();
    if (e.target.id === 'memberModal') closeMemberModal();
};

function openMemberModal(plan) {
    document.getElementById('m-plan').value = plan;
    document.getElementById('planNameDisplay').innerText = plan + " MEMBERSHIP TIER";
    document.getElementById('memberModal').classList.add('modal-active');
}

function closeMemberModal() {
    document.getElementById('memberModal').classList.remove('modal-active');
}

// Membership Automation Trigger
const memberForm = document.getElementById('form-membership');
if (memberForm) {
    memberForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "PROCESSING...";
        btn.disabled = true;

        const formData = new URLSearchParams();
        formData.append('action', 'membership');
        formData.append('plan', document.getElementById('m-plan').value);
        formData.append('name', document.getElementById('m-name').value);
        formData.append('email', document.getElementById('m-email').value);

        try {
            await fetch(SCRIPT_URL, { method: 'POST', body: formData });
            alert("Enrollment Request Received! We will contact you for payment verification.");
            e.target.reset();
            closeMemberModal();
        } catch (err) {
            alert("System Error during enrollment.");
        } finally {
            btn.innerText = "Process Enrollment";
            btn.disabled = false;
        }
    };
}

// --- UPDATED PARTICLE ENGINE ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Indha function thaan particles-ah footer varaikkum extend panna vekkum
function resizeCanvas() {
    canvas.width = window.innerWidth;
    // Window height mattum illama, page-oda motha height-ahyum calculate pannuvom
    canvas.height = Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight, 
        document.documentElement.clientHeight, 
        document.documentElement.scrollHeight, 
        document.documentElement.offsetHeight
    );
    init(); // Height maarum pothu particles-ah marupadiyum spread panna
}
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; // Full scroll height venaam, innerHeight-ae podhum
    init(); 
}

// Window clear panna:
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

let particlesArray;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    // Particles density-ah adjust panna height x width calculation
    let numberOfParticles = (canvas.height * canvas.width) / 12000; 
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * (canvas.height - size * 2)); 
        let directionX = (Math.random() * 1.5) - 0.75; // Speed konjam koraichurukaen subtle-ah irukka
        let directionY = (Math.random() * 1.5) - 0.75;
        let color = '#ffffff';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    // Dynamic canvas size-ku yetha maari clear pannanum
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

// Window resize aagum pothu marupadiyum height calculate panna
window.addEventListener('resize', resizeCanvas);

// Page mothama load aanathum canvas-ah stretch panna
window.onload = resizeCanvas;

resizeCanvas();
animate();
// Manual event listener for the menu button
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Default behavior stop panna
            toggleMobileMenu();
        });
    }
});
// script.js kadaisila idhai add pannu macha
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            console.log("Menu button touched!"); // Console-la check panna
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });
    }
});

// Close panna indha function
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}
// Function to close any modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex', 'modal-active');
        document.body.style.overflow = 'auto'; // Re-enable scroll
    }
}

// Background touch panna modal close aaga (Optional but helpful)
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            closeModal(modal.id);
        }
    });
}
// Smooth Scroll Function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        // Menu open-ah irundha close panniduvom
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
        
        // Smooth scroll logic
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile Menu Toggle Fix
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
        // Body scroll block
        document.body.style.overflow = menu.classList.contains('flex') ? 'hidden' : 'auto';
    }
}