import { IoColorPaletteOutline } from "react-icons/io5";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];
const ThemChanger = () => {
  return (
    <div className="dropdown dropdown-top">
      <div className="tooltip  tooltip-right" data-tip="Theme">
        <div tabIndex={0} role="button" className="btn btn-sm m-1">
          <IoColorPaletteOutline size={22} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] h-52 w-52 overflow-auto rounded-box bg-base-300 p-2 shadow-2xl"
      >
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-ghost btn-sm btn-block justify-start"
            aria-label="Default"
            value="default"
          />
        </li>
        {themes.map((theme) => (
          <li key={theme}>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-ghost btn-sm btn-block justify-start capitalize"
              aria-label={theme}
              value={theme}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemChanger;
