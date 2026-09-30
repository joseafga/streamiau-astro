import { atom, map } from "nanostores";

// current uuid
export const $uuid = atom("");
// default style options
export const $style = map({
  font_family: "Inter",
  prefix: "Prefixo:",
  font_color: "#7055BD",
  font_size_prefix: 42,
  font_size_counter: 100,
  fixed_style: false,
});
