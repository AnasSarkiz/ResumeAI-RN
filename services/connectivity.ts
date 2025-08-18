let online = false; // conservative default on cold start; NetworkProvider will update

export const setOnline = (v: boolean) => {
  online = v;
};

export const isOnline = () => online;
