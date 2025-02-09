// Animated counter function
function animateCounter(element, target, duration) {
    let start = parseInt(element.innerHTML);
    let current = start;
    let increment = (target - start) / (duration / 16);
    let timer = setInterval(() => {
        current += increment;
        element.innerHTML = Math.round(current);
        if (current >= target) {
            element.innerHTML = target;
            clearInterval(timer);
        }
    }, 16);
}

// Start animation when page loads
window.onload = () => {
    const supplyCounter = document.getElementById('supplyCounter');
    animateCounter(supplyCounter, 16384, 2000);
}

// Function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// API Endpoints
const ENDPOINTS = {
    burned: 'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x829d6165C7d698337E5373E4C1Ff00d90a2C4Ee0&address=0x000000000000000000000000000000000000dead&tag=latest&apikey=DSM6BP2F8BDKUZKDA399CWQ2HBN8N16S8K',
    lp: 'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x829d6165C7d698337E5373E4C1Ff00d90a2C4Ee0&address=0xEbf799B6c0e33450FA76e42F1cc4210D7D90F21f&tag=latest&apikey=DSM6BP2F8BDKUZKDA399CWQ2HBN8N16S8K',
    honeypot: 'https://api.honeypot.is/v2/IsHoneypot?address=0x829d6165C7d698337E5373E4C1Ff00d90a2C4Ee0'
};

// Function to update stats
async function updateStats() {
    try {
        const [burnedResponse, lpResponse, honeypotResponse] = await Promise.all([
            fetch(ENDPOINTS.burned),
            fetch(ENDPOINTS.lp),
            fetch(ENDPOINTS.honeypot)
        ]);

        const burnedData = await burnedResponse.json();
        const lpData = await lpResponse.json();
        const honeypotData = await honeypotResponse.json();

        const totalSupply = 16384;
        const burned = parseInt(burnedData.result);
        const lp = parseInt(lpData.result);
        const holders = parseInt(honeypotData.token.totalHolders);

        const burnedPercentage = ((burned / totalSupply) * 100).toFixed(2);
        const lpPercentage = ((lp / totalSupply) * 100).toFixed(2);
        const holdersPercalc = totalSupply - lp;
        const holdersPercentage = ((holdersPercalc / totalSupply) * 100).toFixed(2);

        document.getElementById('burnedTokens').textContent = `${burned} (${burnedPercentage}%)`;
        document.getElementById('lpTokens').textContent = `${lp} (${lpPercentage}%)`;
        document.getElementById('nextBurn').textContent = `${holders} holders (${holdersPercentage}%)`;
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Initialize Prism.js for syntax highlighting
document.addEventListener('DOMContentLoaded', () => {
    Prism.highlightAll();
    updateStats();
    setInterval(updateStats, 30000); // Update every 30 seconds
    addLoadingAnimation();
    createMatrixBackground();
    initializeTerminal();
    initializeLaunchSequence();
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) &&
        !navLinks.contains(e.target) &&
        navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        body.style.overflow = '';
    }
});

function addLoadingAnimation() {
    const loadingElements = document.querySelectorAll('[id$="Loading..."]');
    loadingElements.forEach(element => {
        element.innerHTML = 'Loading<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
    });
}

function createMatrixBackground() {
    console.log('Matrix background initializing...');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.getElementById('matrixBackground').appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Only use numbers from 16384
    const numbers = ['1', '6', '3', '8', '4'];
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function draw() {
        // Darker background for better contrast
        ctx.fillStyle = 'rgba(10, 15, 10, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Use the accent color from CSS variables
        ctx.fillStyle = '#00ff88';
        ctx.font = `${fontSize}px 'Source Code Pro', monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = numbers[Math.floor(Math.random() * numbers.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Faster animation speed
    setInterval(draw, 35);

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function initializeTerminal() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    terminalLines.forEach((line, index) => {
        line.style.setProperty('--line-index', index);
    });
}

function updateTerminalClock() {
    const clock = document.getElementById('terminal-clock');
    const now = new Date();
    clock.textContent = now.toISOString().substr(11, 8);
}

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function updateTerminalTime() {
    const timeElement = document.getElementById('terminal-time');
    const now = new Date();
    timeElement.textContent = now.toISOString().slice(11, 19) + ' UTC';
}

async function updateHolderCount() {
    try {
        const response = await fetch(ENDPOINTS.honeypot);
        const data = await response.json();
        const holders = data.token.totalHolders;
        document.getElementById('holders-count').textContent = formatNumber(holders);
    } catch (error) {
        console.error('Error fetching holder count:', error);
        document.getElementById('holders-count').textContent = 'ERROR';
    }
}

function formatStats(value, total, decimals = 2) {
    const percentage = ((value / total) * 100).toFixed(decimals);
    return `${formatNumber(value)} (${percentage}%)`;
}

async function updateAllStats() {
    await updateStats();
    await updateHolderCount();
    updateTerminalTime();
}

// Update stats every 30 seconds
setInterval(updateAllStats, 30000);

// Initial update
document.addEventListener('DOMContentLoaded', () => {
    updateAllStats();
    setInterval(updateTerminalTime, 1000);
});

function initializeLaunchSequence() {
    const launchText = document.getElementById('launchText');
    if (launchText) {
        const lines = launchText.innerHTML.split('<br>');
        launchText.innerHTML = '';

        lines.forEach((line, index) => {
            setTimeout(() => {
                launchText.innerHTML += line + '<br>';
                if (index === lines.length - 1) {
                    launchText.innerHTML += '<span class="cursor"></span>';
                }
            }, index * 1000);
        });
    }
} 