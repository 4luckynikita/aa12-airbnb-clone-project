import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='navbar'>
      <li className='navbar-home'>
      
      <NavLink to="/"><img src='https://static-00.iconduck.com/assets.00/airbnb-icon-951x1024-p6tdpuhu.png' className='navbar-logo'/></NavLink>
      <NavLink to="/" className={'nav-a'}>BNB4Me</NavLink>
      </li>
      {isLoaded && (
        <li  className='navbar-right'>
          {sessionUser && <NavLink className='new-spot-button' to={`spots/new`}>Create a New Spot</NavLink>}
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
