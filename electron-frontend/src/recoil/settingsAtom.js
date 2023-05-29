import { atom } from "recoil";



export const settingsAtom = atom({
  key: "settingsState",
  default: {
    language: "en", // en, none
  },
});
