import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthModal from '../pages/AuthModal';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [openAuth, setOpenAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub && unsub();
  }, []);

  async function handleLogout() {
    if (!auth) return;
    await signOut(auth);
    navigate('/');
  }

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{ bgcolor: 'var(--pastel-lavender)' }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shopping
          </Typography>

          <Button component={Link} to="/" color="inherit">
            Sản phẩm
          </Button>
          <Button component={Link} to="/register-seller" color="inherit">
            Đăng ký Đại lý
          </Button>
          <Button component={Link} to="/admin" color="inherit">
            Admin
          </Button>

          {user ? (
            <>
              <IconButton onClick={() => navigate('/profile')}>
                <AccountCircle />
              </IconButton>
              <Button color="inherit" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button onClick={() => setOpenAuth(true)}>Đăng nhập</Button>
          )}
        </Toolbar>
      </AppBar>

      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
}
