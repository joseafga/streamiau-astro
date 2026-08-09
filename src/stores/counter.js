import { atom, map } from "nanostores";

// current username
export const $username = atom("");
// current uuid
export const $uuid = atom("");
// default style options
export const $style = map({
    fontFamily: "Inter",
    prefix: "Prefixo:",
    fontColor: "rgb(112, 85, 189)",
    fontSizePrefix: 42,
    fontSizeCounter: 100,
    fixedStyle: false,
});
