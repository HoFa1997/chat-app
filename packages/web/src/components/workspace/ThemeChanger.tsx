import React, { useState, useEffect } from "react";
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

const ThemeChanger = () => {
  // State to hold the selected theme
  const [selectedTheme, setSelectedTheme] = useState("default");

  useEffect(() => {
    // Apply the saved theme on load
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("selectedTheme", theme);
  };

  return (
    <div className="dropdown dropdown-top">
      <div className="tooltip tooltip-right" data-tip="Theme">
        <div tabIndex={0} role="button" className="btn btn-sm m-1">
          <IoColorPaletteOutline size={22} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] size-52 overflow-auto rounded-box bg-base-300 p-2 shadow-2xl"
      >
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-ghost btn-sm btn-block justify-start"
            aria-label="Default"
            value="default"
            checked={selectedTheme === "default"}
            onChange={() => handleThemeChange("default")}
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
              checked={selectedTheme === theme}
              onChange={() => handleThemeChange(theme)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeChanger;
