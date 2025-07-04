const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Node Class
class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.glowTimer = 0;
    }
  
    update() {
      this.x += this.vx;
      this.y += this.vy;
  
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
  
      // Decrease glowTimer if active
      if (this.glowTimer > 0) {
        this.glowTimer -= 1;
      }
    }
  
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + (this.glowTimer > 0 ? 3 : 0), 0, Math.PI * 2);
      ctx.fillStyle = this.glowTimer > 0 ? '#00ffff' : '#0e5d77';
      ctx.shadowColor = this.glowTimer > 0 ? '#00ffff' : 'transparent';
      ctx.shadowBlur = this.glowTimer > 0 ? 20 : 0;
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow blur for next draw
    }
  
    glow() {
      this.glowTimer = 120; // will glow for ~30 frames (~0.5s)
    }
  }
  

const nodes = [];
for (let i = 0; i < 150; i++) {
  nodes.push(new Node());
}

// Animate Function
function animate() {
  ctx.clearRect(0, 0, width, height);
  
  // Draw links
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(29, 100, 120, 0.2)';
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // Update and draw nodes
  nodes.forEach(node => {
    node.update();
    node.draw();
  });

  requestAnimationFrame(animate);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

// Floating Data Logic
const floatingContainer = document.getElementById('floatingDataContainer');

// Simulated Real-World Growth Rates
const dataStats = [
  // 1–5: Human biology
  { label: 'World Heartbeats',       ratePerSecond: 1300000000 },  // ≈ 70 bpm × 7.8 B people
  { label: 'Breaths Taken',          ratePerSecond: 1900000000 },  // ≈ 24 breaths/min × 7.8 B
  { label: 'Neurons Firing',         ratePerSecond: 100000000000 },// ≈ 10¹¹ firings/sec
  { label: 'Smiles Shared',          ratePerSecond: 50000 },       // rough estimate
  { label: 'Steps Walked',           ratePerSecond: 120000000 },   // ≈ 5 steps/person/sec

  // 6–10: Cosmic & natural
  { label: 'Stars Forming',          ratePerSecond: 1 },           // ≈ 1 new star every sec
  { label: 'Meteor Hits',            ratePerSecond: 50 },          // tiny meteors hitting Earth
  { label: 'Tidal Water Moved (m³)', ratePerSecond: 5000000 },     // cubic meters shifting
  { label: 'Volcanic Ash Emitted (kg)', ratePerSecond: 200000 },   // rough estimate
  { label: 'Lightning Strikes',      ratePerSecond: 100 },         // global

  // 11–15: Industrial & mechanical
  { label: 'Cars Manufactured',      ratePerSecond: 4 },           // global factories
  { label: '3D-Printed Parts',       ratePerSecond: 20 },          // estimated
  { label: 'Wind Turbine Revolutions', ratePerSecond: 200000 },    // all turbines spinning
  { label: 'Elevator Rides Started', ratePerSecond: 300 },         // urban high-rises
  { label: 'Solar Panels Installed', ratePerSecond: 2 },           // new capacity

  // 16–20: Food & culture
  { label: 'Coffee Cups Brewed',     ratePerSecond: 2000 },
  { label: 'Pizzas Baked',           ratePerSecond: 1500 },
  { label: 'Books Opened',           ratePerSecond: 8000 },
  { label: 'Paintbrush Strokes',     ratePerSecond: 100000 },      // global art studios
  { label: 'Songs Hummed',           ratePerSecond: 50000 },

  // 21–25: Environment & health
  { label: 'Plastic Bottles Produced', ratePerSecond: 10000 },
  { label: 'kWh Consumed',           ratePerSecond: 150000 },      // worldwide
  { label: 'Trees Planted',          ratePerSecond: 5 },
  { label: 'Vaccinations Administered', ratePerSecond: 20 },
  { label: 'Fish Caught',            ratePerSecond: 3000 },

  // 26–30: Quirky & fun
  { label: 'Dad Jokes Told',         ratePerSecond: 10 },
  { label: 'Magic Tricks Attempted', ratePerSecond: 8 },
  { label: 'Lost Socks',             ratePerSecond: 12 },          // laundry machines
  { label: 'Left Turns in Traffic',  ratePerSecond: 400 },
  { label: 'Amazon Packages Shipped', ratePerSecond: 1500 },
];


const baseTime = Date.now();
const baseStats = dataStats.map(ds => ({ ...ds, baseValue: Math.floor(Math.random() * 1000000) }));

function getCurrentStat(label) {
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - baseTime) / 1000);
  const stat = baseStats.find(s => s.label === label);
  return stat.baseValue + (stat.ratePerSecond * elapsedSeconds);
}

function createFloatingData() {
  const dataItem = document.createElement('div');
  dataItem.className = 'floating-data';
  
  const randomStat = dataStats[Math.floor(Math.random() * dataStats.length)];
  const currentNumber = getCurrentStat(randomStat.label);
  dataItem.innerText = `${currentNumber.toLocaleString()} ${randomStat.label}`;

  // Pick a random node
  const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
  randomNode.glow();
  
  dataItem.style.left = `${randomNode.x}px`;
  dataItem.style.top = `${randomNode.y}px`;  


  floatingContainer.appendChild(dataItem);

  // Remove after animation
  setTimeout(() => {
    floatingContainer.removeChild(dataItem);
  }, 4000);
}

// Create new floating data every 2 seconds
setInterval(createFloatingData, 2000);
