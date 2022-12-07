import React, { useState } from 'react';
import { auth, methods } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { COLORS, SIZES } from '../../constants/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const profilePic = require('../../assets/profile_picture.png');

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onLogout = async () => {
    await methods.signOut(auth);
    navigate('/');
  };
  return (
    <nav style={styles.container}>
      <ul style={styles.navBar}>
        <h3 style={styles.title}>Expense Tracker</h3>
        <img
          src={profilePic}
          alt='profile'
          onClick={() => setOpen(!open)}
          style={styles.image}
        />
        {open && (
          <div style={styles.dropdown}>
            <div onClick={onLogout} style={styles.dropDownItem}>
              Log out
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </div>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Header;

const styles = {
  container: {
    height: 70,
    backgroundColor: COLORS.white,
    padding: '0 2rem',
    borderBottom: `1px solid ${COLORS.darkGray}`,
    position: 'sticky',
    zIndex: 999,
    top: 0,
    margin: 0,
  },
  navBar: {
    maxWidth: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 0,
    padding: 0,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 700,
    color: COLORS.primary,
  },
  image: {
    width: 35,
    height: 35,
    backgroundColor: COLORS.lightGray2,
    borderRadius: '50%',
    margin: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'filter 300ms',
    cursor: 'pointer',
    marginRight: 20,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 10,
    width: 200,
    backgroundColor: COLORS.lightGray2,
    borderRadius: 8,
    overflow: 'hidden',
    border: `1px solid ${COLORS.darkGray}`,
  },
  dropDownItem: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 8,
    padding: '5px 16px',
    justifyContent: 'space-between',
    cursor: 'pointer',
    fontWeight: 400,
    color: COLORS.primary,
  },
};
