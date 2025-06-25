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

  
  let counters = dataTypes.map(dt => ({ ...dt, value: Math.floor(Math.random() * 1000000) }));
  
  function emitDataPulse() {
    const container = document.getElementById('dataPulseContainer');
    const data = counters[Math.floor(Math.random() * counters.length)];
    data.value += data.rate;
  
    const div = document.createElement('div');
    div.className = 'pulse-item';
    div.style.left = `${Math.random() * 200 - 100}px`;
    div.innerText = `${data.label}: ${data.value.toLocaleString()}`;
    container.appendChild(div);
  
    setTimeout(() => container.removeChild(div), 3000);
  }
  
  setInterval(emitDataPulse, 800);
  