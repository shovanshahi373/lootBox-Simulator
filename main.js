import { idGenerator } from "./src/js/helpers.js";
import { generatePool as cardPool } from "./src/js/card.js";
import { generatePool as chestPool, Buffers } from "./src/js/chest.js";
import { createPushEvent, createPopEvent } from "./src/js/events.js";
let NOTIFICATIONS = [];
const pushEvent = createPushEvent(NOTIFICATIONS);
const popEvent = createPopEvent(NOTIFICATIONS);
createPopEvent(NOTIFICATIONS);
import {
  deleteNotification,
  createNotification,
} from "./src/js/notifications.js";

const myImages = Buffers();
let myRecievedCards = [];
let chestBeingUnlocked = false;

//elements
const $msg = document.querySelector(".msg");
const $reqBtn = document.querySelector(".req-chest-btn");
const $slotss = document.querySelectorAll(".slot");
const $notifications = document.querySelector(".notification-container");
const $COLLECTION = document.querySelector(".collection");
const $TIMER = document.querySelector(".timer");
const $progressBar = document.querySelector(".timer-progress");

//inits
let slots = [];
let chestHolders = {};
let myCollection = {
  common: 0,
  rare: 0,
  epic: 0,
  legendary: 0,
};

const loadCardsToCollection = (collection) => {
  const common = document.querySelector("span.common");
  const rare = document.querySelector("span.rare");
  const epic = document.querySelector("span.epic");
  const legendary = document.querySelector("span.legendary");

  common.textContent = collection.common;
  rare.textContent = collection.rare;
  epic.textContent = collection.epic;
  legendary.textContent = collection.legendary;
};

const insertCardsToCollection = (collection) => {
  const common = document.querySelector("span.common");
  const rare = document.querySelector("span.rare");
  const epic = document.querySelector("span.epic");
  const legendary = document.querySelector("span.legendary");
  collection.forEach(({ type, amount }) => {
    myCollection[type] += amount;
  });
  common.textContent = myCollection.common;
  rare.textContent = myCollection.rare;
  epic.textContent = myCollection.epic;
  legendary.textContent = myCollection.legendary;
  localStorage.setItem("MYCARDS", JSON.stringify(myCollection));
};

const removeChestLock = (data) => {
  data.isLocked = !data.isLocked;
  const index = slots.findIndex((s) => !s.isEmpty && s.slotId === data.slotId);
  slots[index] = data;
  // chestHolders.set(data.slotId, data);
  chestHolders[data.slotId] = data;
  localStorage.setItem("MYSLOTS", JSON.stringify(chestHolders));
  const parent = document.querySelector(`[data-id="${data.id}"]`);
  const targetBtn = parent.querySelector(".unlock-chest-btn");
  targetBtn.style.animationPlayState = "paused";
  targetBtn.style.transformOrigin = "bottom center";
  targetBtn.style.transform = "scale(0)";
  setTimeout(() => {
    parent.removeChild(targetBtn);
    parent.style.border = "3px solid var(--purple)";
  }, 2000);
};

const unlockChest = (e, data) => {
  e.stopPropagation();
  if (chestBeingUnlocked) {
    const msg = "another chest is currently being unlocked!";
    createNotification(msg, NOTIFICATIONS, $notifications, pushEvent, popEvent);
    return;
  }
  const timeLimit = Date.now() + data.unlockTime * 1000;
  const initialSecond = timeLimit / 1000 - Math.floor(Date.now() / 1000);
  chestBeingUnlocked = true;
  let isExpired = false;
  let percentage;
  const id = setInterval(() => {
    const seconds = (timeLimit / 1000 - Math.floor(Date.now() / 1000)).toFixed(
      0
    );
    isExpired = seconds <= 0;
    if (isExpired) {
      clearInterval(id);
      const message = "chest unlocked!";
      chestBeingUnlocked = false;
      createNotification(
        message,
        NOTIFICATIONS,
        $notifications,
        pushEvent,
        popEvent
      );
      console.log(data);
      $progressBar.style.width = 0 + "%";
      $TIMER.innerHTML = "no chest being opened...";
      removeChestLock(data);
      return;
    } else {
      $TIMER.innerHTML = seconds + "s remaining...";
    }
    percentage = ((initialSecond - seconds) / initialSecond) * 100;
    $progressBar.style.width = percentage + "%";
  }, 1000);
};

const pushChestToSlot = (chest) => {
  const img = document.createElement("img");
  img.src = `./images/${chest.name}.png`;
  img.title = `${chest.name}`;
  img.alt = `${chest.name}`;
  img.classList.add("slot-image");
  const unlock = document.createElement("div");
  unlock.classList.add("unlock-chest-btn");
  unlock.addEventListener("click", (e) =>
    // unlockChest(e, chest.cards, chest.unlockTime)
    unlockChest(e, chest)
  );
  const text = "UNLOCK";
  unlock.textContent = text;
  const toolTip = document.createElement("div");
  toolTip.classList.add("chest-toolTip");
  toolTip.innerHTML += `<p>unlock time: ${chest.unlockTime} seconds</p>`;
  toolTip.innerHTML += `contains at least:<br> ${chest.toolTipData}`;
  const context = document.querySelector(`.slot.slot-${chest.slotId}`);
  context.appendChild(img);
  context.setAttribute("data-id", chest.id);
  context.appendChild(unlock);
  context.appendChild(toolTip);
};

document.addEventListener("DOMContentLoaded", () => {
  //checking slot statuses
  let isNull = localStorage.getItem("MYSLOTS") === null;
  if (!isNull) {
    const mySlots = localStorage.getItem("MYSLOTS");
    console.log("fetched from localStorage");
    chestHolders = JSON.parse(mySlots);
    console.log("myChestHolders:", chestHolders);
    slots = Object.values(chestHolders);
    console.log("slots:", slots);
    slots.forEach((slot) => {
      if (!slot.isEmpty) {
        slot.isLocked && pushChestToSlot(slot);
        // insertCardsToCollection(slot.cards);
      }
    });
  } else {
    console.log("save data not found..");
    const v = {
      1: {
        isEmpty: true,
      },
      2: {
        isEmpty: true,
      },
      3: {
        isEmpty: true,
      },
      4: {
        isEmpty: true,
      },
    };
    const cc = JSON.stringify(v, null, 4);
    console.log(cc);
    slots = Object.values(v);
    chestHolders = v;
    console.log("moi slots", slots);
    localStorage.setItem("MYSLOTS", cc);
  }
  //create card collection data
  isNull = localStorage.getItem("MYCARDS") === null;
  if (!isNull) {
    const data = localStorage.getItem("MYCARDS");
    myCollection = JSON.parse(data);
    loadCardsToCollection(myCollection);
  } else {
    localStorage.setItem("MYCARDS", JSON.stringify(myCollection));
  }
});

const chestsArr = chestPool();

const openChest = (pool, tries = 5) => {
  const pulledCards = [];
  const messages = [];
  for (let i = 0; i < tries; i++) {
    const randomNumber = Math.floor(Math.random() * pool.length);
    const pulledCard = pool[randomNumber];
    messages.push(`<p>you pulled a ${pulledCard} card!(${i + 1}/${tries})</p>`);
    console.log(`you pulled a ${pulledCard} card!(${i + 1}/${tries})`);
    pulledCards.push(pulledCard);
  }
  return [pulledCards, messages];
  // return messages;
};

$notifications.addEventListener("pushNotification", (e) => {
  if (e.detail.length) {
    let timerToken = null;
    const mes = e.detail.pop();
    const div = document.createElement("div");
    const cross = document.createElement("span");
    cross.classList.add("cross");
    cross.addEventListener("click", () => {
      div.classList.add("phaseOut");
      setTimeout(() => {
        deleteNotification(mes.id, $notifications, timerToken);
      }, 500);
      // deleteNotification(mes.id, $notifications);
    });
    cross.textContent = "X";
    div.classList.add("notification");
    div.setAttribute("data-id", mes.id);
    const text = mes.message;
    div.innerHTML = text;
    div.appendChild(cross);
    $notifications.appendChild(div);
    timerToken = setTimeout(() => {
      document
        .querySelector(`[data-id="${mes.id}"]`)
        .querySelector("span.cross")
        .click();
      // deleteNotification(mes.id, $notifications);
    }, 5000);
  }
});

$notifications.addEventListener("popNotification", (e) => {
  console.log("after popping", e.detail);
});

const getRandomChest = () => {
  const firstEmptySlot = slots.findIndex((s) => s.isEmpty);
  console.log("slot is empty at pos ", firstEmptySlot);
  if (firstEmptySlot === -1) {
    const message = "chest slots full!";
    return createNotification(
      message,
      NOTIFICATIONS,
      $notifications,
      pushEvent,
      popEvent
    );
  }

  const chest = chestsArr[Math.floor(Math.random() * chestsArr.length)];

  const m = `you recieved a ${chest.name.replace("-", " ")}`;
  createNotification(m, NOTIFICATIONS, $notifications, pushEvent, popEvent);
  const messages = [];
  const totalGuaranteedCards = chest.guaranteed.reduce((ttl, obj) => {
    messages.push(`<p>you recieved x${obj.amount} ${obj.type} cards!</p>`);
    return ttl + obj.amount;
  }, 0);

  console.log(`congrats! you recieved a ${chest.name}`);
  const notGurarenteedCards = chest.numberOfCards - totalGuaranteedCards;
  const myPool = cardPool(chest);

  const [pulledCards, myMessages] = openChest(myPool, notGurarenteedCards);

  const msg = `<span>
    ${messages}
    ${myMessages}
    </span>
  `;
  // const length = slots.length;
  const slotId = firstEmptySlot + 1;

  // const $slot = document.querySelector(`.slot.slot-${slotId}`);

  const myId = idGenerator();
  // $slot.setAttribute("data-id", myId);

  const gCards = chest.guaranteed.map(
    ({ type, amount }) => `x${amount} ${type}`
  );

  myRecievedCards.push(...chest.guaranteed);

  pulledCards.forEach((card, i) => {
    myRecievedCards = myRecievedCards.map(({ type, amount }) => {
      if (card === type) {
        return {
          type,
          amount: amount + 1,
        };
      } else {
        return {
          type,
          amount,
        };
      }
    });
  });

  const data = {
    name: chest.name,
    id: myId,
    slotId,
    isLocked: true,
    message: msg,
    cards: myRecievedCards,
    unlockTime: chest.unlockTime,
    toolTipData: gCards,
  };

  slots[firstEmptySlot] = {
    isEmpty: !slots[firstEmptySlot].isEmpty,
    ...data,
  };

  // chestHolders.set(slotId, slots[firstEmptySlot]);
  // const newChestHolder = {...chestHolders,}
  chestHolders[slotId] = slots[firstEmptySlot];
  console.log("chestHolders");
  console.log(chestHolders);

  // localStorage.setItem("MYCHESTS", JSON.stringify(slots));
  localStorage.setItem("MYSLOTS", JSON.stringify(chestHolders));

  pushChestToSlot(slots[firstEmptySlot]);
  myRecievedCards = [];
  return { chest, cards: pulledCards };
};

const getAChestOfAType = (chestType) => {
  let chest;
  let attempts = 0;
  let attemptValid = true;
  do {
    chest = getRandomChest();
    attempts += 1;
    if (attempts > 1000) {
      attemptValid = false;
      break;
    }
  } while (chest.chest.name !== chestType);
  const message = attemptValid
    ? `it took you ${attempts} attempts to open a ${chest.chest.name}`
    : "you ran out of attempts!";

  $msg.innerHTML = message;
  return message;
};

$reqBtn.addEventListener("click", getRandomChest);
$slotss.forEach((slot) => {
  slot.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const s = slots.find((s) => !s.isEmpty && s.id === id);
    if (s && !s.isLocked) {
      // alert(s.message);
      createNotification(
        s.message,
        NOTIFICATIONS,
        $notifications,
        pushEvent,
        popEvent
      );
      insertCardsToCollection(s.cards);
      const element = document.querySelector(`[data-id="${id}"]`);
      do {
        console.log(element.firstChild);
        element.removeChild(element.firstChild);
        element.style = "";
      } while (element.childNodes.length);
      const i = slots.findIndex((s) => !s.isEmpty && s.id === id);
      slots[i] = { isEmpty: true };
      // chestHolders.set(s.slotId, { isEmpty: true });
      chestHolders[s.slotId] = { isEmpty: true };
      localStorage.setItem("MYSLOTS", JSON.stringify(chestHolders));
    } else if (s && s.isLocked) {
      const message = "chest not unlocked yet.";
      createNotification(
        message,
        NOTIFICATIONS,
        $notifications,
        pushEvent,
        popEvent
      );
    } else {
      createNotification(
        "this slot is empty",
        NOTIFICATIONS,
        $notifications,
        pushEvent,
        popEvent
      );
    }
  });
});
