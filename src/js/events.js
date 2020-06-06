export const createPushEvent = (data) => {
  return new CustomEvent("pushNotification", {
    detail: data,
  });
};

export const createPopEvent = (data) => {
  return new CustomEvent("popNotification", {
    detail: data,
  });
};
