export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getCurrentTimestamp() {
  return Math.ceil(new Date().getTime() / 1000);
}

export function limitText(str: string, limit: number): string {
  if (str.length > limit) {
    return str.substring(0, limit) + "…";
  } else {
    return str;
  }
}
