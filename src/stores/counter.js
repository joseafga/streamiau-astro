import { atom, map } from "nanostores";

// current username
export const $username = atom("");
// current uuid
export const $uuid = atom("");
// default style options
export const $style = map({
    font_family: "Inter",
    prefix: "Prefixo:",
    font_color: "rgb(112, 85, 189)",
    font_size_prefix: 42,
    font_size_counter: 100,
    fixed_style: false,
});
