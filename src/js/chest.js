import { chestPoolSize, chest } from "./variables.js";
import { shuffleCards } from "./helpers.js";

export const generatePool = () => {
  const woodChests = Array(
    Math.floor(chestPoolSize * chest.WOOD.baseRarity)
  ).fill(chest.WOOD);
  const bronzeChests = Array(
    Math.floor(chestPoolSize * chest.BRONZE.baseRarity)
  ).fill(chest.BRONZE);
  const silverChests = Array(
    Math.floor(chestPoolSize * chest.SILVER.baseRarity)
  ).fill(chest.SILVER);
  const platinumChests = Array(
    Math.floor(chestPoolSize * chest.PLATINUM.baseRarity)
  ).fill(chest.PLATINUM);
  const lifeChests = Array(
    Math.floor(chestPoolSize * chest.LIFE.baseRarity)
  ).fill(chest.LIFE);
  const legendaryChests = Array(
    Math.floor(chestPoolSize * chest.LEGENDARY.baseRarity)
  ).fill(chest.LEGENDARY);
  return shuffleCards([
    ...woodChests,
    ...bronzeChests,
    ...silverChests,
    ...platinumChests,
    ...lifeChests,
    ...legendaryChests,
  ]);
};

export const Buffers = () => {
  const w = new Map();
  Object.keys(chest).forEach((cname) => {
    const img = document.createElement("img");
    img.src = `./images/${chest[cname].name}.png`;
    img.classList.add("slot-image");
    w.set(cname, img);
  });
  return w;
};
