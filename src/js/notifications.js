export const deleteNotification = (id, context, token) => {
  clearTimeout(token);
  const el = document.querySelector(`[data-id='${id}']`);
  if (el) {
    context.removeChild(el);
  }
};

export const createNotification = (
  message,
  collection,
  context,
  pushEvent,
  popEvent
) => {
  const id = "N" + (Math.random() * 10000).toFixed(0);
  collection.push({ id, message });
  context.dispatchEvent(pushEvent);
  setTimeout(() => {
    collection = collection.filter((n) => n.id !== id);
    context.dispatchEvent(popEvent);
  }, 4000);
};
