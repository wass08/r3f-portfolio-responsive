import dayjs from "dayjs";

import useWindowStore from "#store/window";
import { navLinks, navIcons } from "#constants";
import Theme from "./Theme";

const Navbar = () => {
  const { openWindow } = useWindowStore();

  return (
    <nav>
      <div>
        <img src="/images/logo.svg" className="dark:invert" />
        <p className="font-bold">Arhan's Portfolio</p>

        <ul>
          {navLinks.map(({ id, type, name }) => (
            <li key={id}>
              <p onClick={() => openWindow(type)}>{name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map((icon) => (
            <li key={icon.id}>
              {icon.id === 4 ? (
                <Theme />
              ) : (
                <img
                  src={icon.img}
                  className="icon dark:invert dark:hover:bg-dark-500!"
                />
              )}
            </li>
          ))}
        </ul>

        <time>{dayjs().format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>
  );
};

export default Navbar;
