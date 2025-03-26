import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteAccount = () => {

    const { id } = JSON.parse(localStorage.getItem("loggedUser"));
    const users = JSON.parse(localStorage.getItem("users"))

    const removedUser = users.filter((user) => user.id !== id);
    localStorage.setItem("users", JSON.stringify(removedUser));
    navigate('/login');
  };

  const logout = () => {
    localStorage.removeItem("loggedUser");
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bem-vindo!
          </Typography>
          <Box component="nav">
            <Button type="button" color="inherit" sx={{ gap: '6px' }} onClick={handleOpen}>
              Excluir conta <DeleteIcon fontSize="small" />
            </Button>
            <Button type="button" color="inherit" sx={{ gap: '6px' }} onClick={logout}>
              Sair <LogoutIcon fontSize="small" />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Diálogo de confirmação */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Não
          </Button>
          <Button onClick={handleDeleteAccount} color="error" autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
