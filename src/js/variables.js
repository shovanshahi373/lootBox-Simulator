export const rarity = {
  COMMON: "common",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary",
};

export const cardPoolSize = 1000;
export const chestPoolSize = 1000;

export const chest = {
  WOOD: {
    name: "wooden-chest",
    numberOfCards: 5,
    baseRarity: 0.1,
    guaranteed: [
      {
        type: "common",
        amount: 4,
      },
    ],
    luckyDrawProbability: {
      common: 0.78,
      rare: 0.2,
      epic: 0.011,
      legendary: 0.009,
    },
    unlockTime: 1,
  },
  BRONZE: {
    name: "bronze-chest",
    numberOfCards: 20,
    baseRarity: 0.4,
    guaranteed: [
      {
        type: "common",
        amount: 15,
      },
      {
        type: "rare",
        amount: 4,
      },
    ],
    luckyDrawProbability: {
      common: 0.7,
      rare: 0.28,
      epic: 0.01,
      legendary: 0.01,
    },
    unlockTime: 2,
  },
  SILVER: {
    name: "silver-chest",
    numberOfCards: 40,
    baseRarity: 0.4,
    guaranteed: [
      {
        type: "common",
        amount: 22,
      },
      {
        type: "rare",
        amount: 15,
      },
      {
        type: "epic",
        amount: 2,
      },
    ],
    luckyDrawProbability: {
      common: 0.66,
      rare: 0.31,
      epic: 0.015,
      legendary: 0.015,
    },
    unlockTime: 3,
  },
  PLATINUM: {
    name: "platinum-chest",
    numberOfCards: 80,
    baseRarity: 0.05,
    guaranteed: [
      {
        type: "common",
        amount: 45,
      },
      {
        type: "rare",
        amount: 25,
      },
      {
        type: "epic",
        amount: 8,
      },
    ],
    luckyDrawProbability: {
      common: 0.5,
      rare: 0.32,
      epic: 0.1,
      legendary: 0.08,
    },
    unlockTime: 4,
  },
  LIFE: {
    name: "life-chest",
    numberOfCards: 120,
    baseRarity: 0.035,
    guaranteed: [
      {
        type: "common",
        amount: 65,
      },
      {
        type: "rare",
        amount: 30,
      },
      {
        type: "epic",
        amount: 12,
      },
      {
        type: "legendary",
        amount: 1,
      },
    ],
    luckyDrawProbability: {
      common: 0.1,
      rare: 0.2,
      epic: 0.5,
      legendary: 0.2,
    },
    unlockTime: 8,
  },
  LEGENDARY: {
    name: "legendary-chest",
    numberOfCards: 250,
    baseRarity: 0.015,
    guaranteed: [
      {
        type: "common",
        amount: 120,
      },
      {
        type: "rare",
        amount: 70,
      },
      {
        type: "epic",
        amount: 30,
      },
      {
        type: "legendary",
        amount: 10,
      },
    ],
    luckyDrawProbability: {
      common: 0.01,
      rare: 0.09,
      epic: 0.1,
      legendary: 0.8,
    },
    unlockTime: 10,
  },
};
