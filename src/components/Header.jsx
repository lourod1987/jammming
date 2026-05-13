import { NavLink } from 'react-router';

function Header() {
  return (
    <div>
      <ul>
        <li>
          <NavLink to="/" end>Home</NavLink>
        </li>
        <li>
          <NavLink to="/authorize">Authorize</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Header;