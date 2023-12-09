import { Link } from "react-router-dom";
import './Header.css';
import { useUser } from "../Context/UserContext";

const NavBar = ({ links, onToggleNotifications }) => {

  const { isExpanded, setIsExpanded } = useUser();

  const handleLinkClick = () => {
    setIsExpanded(false);
  };

  return (
    <ul className="flex flex-row justify-around items-center text-4xl w-full md:w-9/12 ulMenu">
      {links.map(({ url, name, icon, onClick, title }) => {
        return (
          <li key={name}>
            {onClick ? (
              <button onClick={onClick} title={title}>
                {icon}
              </button>
            ) : (
              <Link to={url} title={title} onClick={handleLinkClick}>
                {icon}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NavBar;
