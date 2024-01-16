import { MdOutlinePublic, MdCampaign, MdGroups } from "react-icons/md";
import { RiLock2Fill, RiArchiveFill } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";
import { useRef, useState } from "react";
const FilterBar = ({ onFilterChange }: any) => {
  const [activeType, setActiveType] = useState("all");
  const containerRef = useRef(null);

  const channelTypes = [
    { type: "PUBLIC", icon: <MdOutlinePublic siz={24} /> },
    { type: "DIRECT", icon: <FaUserGroup /> },
    { type: "GROUP", icon: <MdGroups size={20} /> },
    { type: "BROADCAST", icon: <MdCampaign /> },
    { type: "PRIVATE", icon: <RiLock2Fill /> },
    { type: "ARCHIVE", icon: <RiArchiveFill /> },
  ];

  const handleClick = (type: string) => {
    setActiveType(type);
    onFilterChange(type);
    centerButton(type);
  };

  const centerButton = (type: string) => {
    const container = containerRef?.current as HTMLDivElement | null;
    const button = container?.querySelector(`button[data-type="${type}"]`) as HTMLButtonElement;
    if (!button || !container) return;

    const containerWidth = container.offsetWidth;
    const buttonLeft = button.offsetLeft;
    const buttonWidth = button.offsetWidth;

    const scrollPosition = buttonLeft - containerWidth / 2 + buttonWidth / 2;
    container?.scroll({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={containerRef}
      className="scrollable-container mb-2 flex flex-row space-x-2 overflow-x-auto overflow-y-hidden p-2 pb-3 "
    >
      <button
        key="all"
        data-type="all"
        onClick={() => handleClick("all")}
        className={`btn btn-outline btn-sm shadow hover:shadow-md ${activeType === "all" ? "btn-active" : ""}`}
      >
        All
      </button>
      {channelTypes.map(({ type, icon }) => (
        <button
          key={type}
          data-type={type}
          onClick={() => handleClick(type)}
          className={`btn btn-outline btn-sm shadow hover:shadow-md ${activeType === type ? "btn-active" : ""}`}
        >
          {icon}
          {type}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
