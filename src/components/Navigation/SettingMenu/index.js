import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingModal from 'components/SpeedDial/Settings/Modal';
import { ROUTES } from 'constant';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useStyle from './style';
import { useSelector } from 'react-redux';

function SettingMenu({ anchorEl, onClose }) {
  const classes = useStyle();
  const [open, setOpen] = useState(false);

  const { role } = useSelector((state) => state.userInfo);

  return (
    <Menu
      classes={{ paper: classes.root }}
      anchorEl={anchorEl}
      disableScrollLock={true}
      getContentAnchorEl={null}
      onClose={onClose}
      open={Boolean(anchorEl)}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}>
      <Link to={ROUTES.USER_ACCOUNT}>
        <MenuItem className={classes.menuItem}>
          <AccountCircleIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Thông tin cá nhân</p>
        </MenuItem>
      </Link>

      <MenuItem onClick={() => setOpen(true)} className={classes.menuItem}>
        <SettingsIcon className={classes.icon} fontSize="small" />
        <p className={classes.text}>Cài đặt</p>
      </MenuItem>

      {role === 'ADMIN' && (
        <>
          <Link to={ROUTES.MANAGE_USER}>
            <MenuItem className={classes.menuItem}>
              <AccountCircleIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Quản lý người dùng</p>
            </MenuItem>
          </Link>

          <Link to={ROUTES.MANAGE_SENTENCE}>
            <MenuItem className={classes.menuItem}>
              <AccountCircleIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Quản lý mẫu câu</p>
            </MenuItem>
          </Link>

          <Link to={ROUTES.MANAGE_WORD}>
            <MenuItem className={classes.menuItem}>
              <AccountCircleIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Quản lý từ vựng</p>
            </MenuItem>
          </Link>
        </>
      )}

      <Link to={ROUTES.LOGOUT}>
        <MenuItem className={classes.menuItem}>
          <ExitToAppIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Đăng xuất</p>
        </MenuItem>
      </Link>

      {open && <SettingModal open={open} onClose={() => setOpen(false)} />}
    </Menu>
  );
}

SettingMenu.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
};

SettingMenu.defaultProps = {
  anchorEl: null,
  onClose: function () {},
};

export default SettingMenu;
