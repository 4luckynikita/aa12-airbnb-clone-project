import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const demoUserLogIn = async () => {
    const response = await dispatch(sessionActions.login({ "credential": 'Demo-lition', "password": 'password' }))
    if (response.ok) {
      closeModal();
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className='login-form'>
      <h1 className='login-text'>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className='input-boxes'>
          <div className='username-email-input'>
            <label>

              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
                placeholder='Username or Email'
                className='input'
              />
            </label>
          </div>
          <div classname='password-input'>
            <label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='Password'
                className='input'
              />
            </label>
          </div>
        </div>
        {errors.credential && <p>{errors.credential}</p>}
        <div className='button-container'>
          <button type="submit" className='login-button'>Log In</button>
          <div></div>
          <button className='demo-user-button' type='demoUser' onClick={demoUserLogIn}>Demo User</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
