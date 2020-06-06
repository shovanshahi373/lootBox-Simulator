export const shuffleCards = (pool) => pool.sort((c) => Math.random() - 0.5);

export const transformWord = (string) => {
  return string.trim().split("-")[0].toUpperCase();
};

export const idGenerator = (blocks = 4) => {
  return Array(blocks)
    .fill(0)
    .map((s) => {
      return Math.floor(Math.random() * 1000000).toString(16);
    })
    .join("-");
};
