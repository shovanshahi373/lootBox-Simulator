import { rarity, cardPoolSize as pool } from "./variables.js";
import { shuffleCards } from "./helpers.js";

// const commonCards = Array(1000).fill(rarity.COMMON);
// const rareCards = Array(100).fill(rarity.RARE);
// const epicCards = Array(10).fill(rarity.EPIC);
// const legendaryCards = Array(3).fill(rarity.LEGENDARY);

// const cardsPool = [
//   ...commonCards,
//   ...rareCards,
//   ...epicCards,
//   ...legendaryCards,
// ];

//depending on the chest type,
// we will have different pool
// the pool have better amount of cards
// the better the chest type is
export const generatePool = (chestType) => {
  const commonCards = Array(
    Math.floor(pool * chestType.luckyDrawProbability.common)
  ).fill(rarity.COMMON);
  const rareCards = Array(
    Math.floor(pool * chestType.luckyDrawProbability.rare)
  ).fill(rarity.RARE);
  const epicCards = Array(
    Math.floor(pool * chestType.luckyDrawProbability.epic)
  ).fill(rarity.EPIC);
  const legendaryCards = Array(
    Math.floor(pool * chestType.luckyDrawProbability.legendary)
  ).fill(rarity.LEGENDARY);
  return shuffleCards([
    ...commonCards,
    ...rareCards,
    ...epicCards,
    ...legendaryCards,
  ]);
};
