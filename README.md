# 🌌 Universe Smash

**Universe Smash** is a browser-based cosmic sandbox and planet destruction game.

Create planets, stars, black holes, wormholes, and other celestial objects, then watch them interact in a fictional physics simulation.

---

# 🎮 Game Modes

## 🌍 Planet Mode

Choose a single planet and experiment with different fictional weapons and cosmic effects.

Features planned:

- Lasers
- Ice Laser
- Bombs
- Asteroids
- Mystery Matter Gun
- Alien Spaceships
- Antimatter effects
- Planet damage
- Explosions
- Destruction effects

---

## ☀️ Solar System Mode

Create and experiment with entire star systems.

Players can add celestial objects such as:

- Stars
- Planets
- Moons
- Asteroids
- Black Holes
- Grey Holes
- Wormholes
- Antimatter Worlds

Objects can move and interact using a simplified fictional gravity simulation.

---

# ⭐ Star Types

Universe Smash includes:

- ☀️ Yellow Stars
- 🔴 Red Giants
- 🔵 Blue Giants
- 💠 Blue Hypergiants
- ⚪ White Dwarfs
- 🔷 Neutron Stars
- ✨ Pulsars
- ⭐⭐ Contact Binary Stars

---

# 🪐 Planet Types

- 🌍 Earth-Like Planets
- 🏜️ Desert Planets
- ❄️ Ice Planets
- 🌋 Lava Planets
- 🪐 Gas Giants
- 🪨 Rocky Planets
- 🟣 Antimatter Worlds

---

# 🕳️ Special Objects

## Black Hole

Black holes can:

- Move through the simulation
- Pull nearby objects
- Absorb objects
- Gain mass
- Grow larger

---

## Grey Hole / Q-Star

A fictional interpretation inspired by theoretical compact objects.

In Universe Smash, Grey Holes:

- Have extremely strong gravity
- Have a physical surface
- Destroy objects that impact the surface
- Gain mass from impacts
- Emit a dim red glow

---

## Wormholes

Wormholes can:

- Move
- Link together
- Teleport objects
- Create shortcuts across the simulation

---

# ⚙️ Project Structure

```text
universe-smash/
│
├── index.html
├── style.css
├── README.md
│
├── assets/
│   └── audio/
│
└── src/
    ├── main.js
    ├── physics.js
    ├── camera.js
    ├── particles.js
    ├── audio.js
    ├── menu.js
    ├── startup.js
    │
    ├── modes/
    │   ├── planet-mode.js
    │   └── solar-system.js
    │
    └── objects/
        ├── antimatter-planet.js
        ├── asteroid.js
        ├── black-hole.js
        ├── grey-hole.js
        ├── moon.js
        ├── planet.js
        ├── star.js
        └── wormhole.js
