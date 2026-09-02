// =========================================
// UNIVERSE SMASH
// STAR OBJECT SYSTEM
// =========================================


// Star definitions

export const STAR_TYPES = {

  yellow: {
    name: "Yellow Star",

    size: 100,

    mass: 5000,

    color: "#ffcc33",

    glow: "#ff9900",

    description:
      "A stable yellow main-sequence star."
  },


  redGiant: {
    name: "Red Giant",

    size: 160,

    mass: 9000,

    color: "#ff6433",

    glow: "#ff2200",

    description:
      "A massive expanded red giant star."
  },


  blueGiant: {
    name: "Blue Giant",

    size: 180,

    mass: 12000,

    color: "#55aaff",

    glow: "#2288ff",

    description:
      "A hot and extremely luminous blue giant."
  },


  blueHypergiant: {
    name: "Blue Hypergiant",

    size: 250,

    mass: 25000,

    color: "#aaddff",

    glow: "#4488ff",

    description:
      "One of the largest fictional star types available."
  },


  whiteDwarf: {
    name: "White Dwarf",

    size: 45,

    mass: 7000,

    color: "#ffffff",

    glow: "#aaddff",

    description:
      "A small but extremely dense stellar remnant."
  },


  neutronStar: {
    name: "Neutron Star",

    size: 35,

    mass: 18000,

    color: "#bdeaff",

    glow: "#3366ff",

    description:
      "An extremely dense stellar remnant."
  },


  pulsar: {
    name: "Pulsar",

    size: 40,

    mass: 20000,

    color: "#ffffff",

    glow: "#7755ff",

    description:
      "A rapidly rotating neutron star."
  }

};


// =========================================
// CREATE STAR
// =========================================

export function createStar(

  type = "yellow",

  x = 500,

  y = 300

) {

  const starType =
    STAR_TYPES[type] ||
    STAR_TYPES.yellow;


  const star = {

    id:
      `star-${Date.now()}-${Math.random()}`,

    type:
      "star",

    starType:
      type,


    // Position

    position: {

      x: x,

      y: y

    },


    // Velocity

    velocity: {

      x: 0,

      y: 0

    },


    // Physics

    mass:
      starType.mass,

    radius:
      starType.size / 2,


    // Visual information

    size:
      starType.size,

    color:
      starType.color,

    glow:
      starType.glow,


    description:
      starType.description,


    // Stars normally stay in place

    fixed:
      true,


    destroyed:
      false

  };


  return star;

}


// =========================================
// CONTACT BINARY STARS
// =========================================

export function createContactBinary(

  x = 500,

  y = 300

) {

  const starA =
    createStar(

      "blueGiant",

      x - 70,

      y

    );


  const starB =
    createStar(

      "blueGiant",

      x + 70,

      y

    );


  // Allow the system to identify
  // these two stars as a pair

  starA.binaryPartner =
    starB.id;

  starB.binaryPartner =
    starA.id;


  starA.fixed =
    false;

  starB.fixed =
    false;


  starA.velocity.y =
    -0.5;

  starB.velocity.y =
    0.5;


  return {

    type:
      "contact-binary",

    stars:
      [

        starA,

        starB

      ]

  };

}


// =========================================
// GET STAR TYPES
// =========================================

export function getStarTypes() {

  return Object.keys(
    STAR_TYPES
  );

}
