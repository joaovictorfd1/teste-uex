import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getCoordinatesFromAddress } from '../../helpers';
import { Box, Typography, Paper, Grid } from "@mui/material";
import GoogleMapComponent from '../Maps';
import Header from '../Header';
import ContactList from '../ContactsList';
import { DialogComponent } from '../Dialog';
import { ConfirmDeleteDialog } from '../DialogDelete';

const Dashboard = () => {

  const navigate = useNavigate();

  const userLogged = JSON.parse(localStorage.getItem('loggedUser')) || null;
  const { id } = userLogged;
  const arrayContactsUserLocalStorage = JSON.parse(localStorage?.getItem(`contacts_user_${id}`)) || [];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contact, setContact] = useState({});
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState({
    lat: -23.55052, // Latitude inicial (São Paulo)
    lng: -46.633308, // Longitude inicial
  });
  const [isCEP, setIsCEP] = useState(false);
  const [cpfError, setCpfError] = useState(false);
  const [cpfIsExisting, setIsCPFExisting] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '',
    cep: '',
    logradouro: '',
    numero: '',
    estado: '',
    cidade: '',
    latitude: '',
    longitude: '',
    telefone: '',
    cpf: '',
    id: '',
  });

  const handleCloseDialog = () => {
    setFormData({});
    setCpfError(false);
    setIsDialogOpen(false);
  };

  const handleVerifyCEP = (event) => {
    const cep = event.target.value;

    if (cep.length === 8) {
      const cepWithHyphen = cep.slice(0, 5) + '-' + cep.slice(5);
      setFormData({ ...formData, cep: cepWithHyphen });
    } else {
      setFormData({ ...formData, cep });
    }
  };

  const handleCEP = async (event) => {
    event.preventDefault();
    const cep = event.target.value;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setFormData({ ...formData, cep, logradouro: '', numero: '' });
        toast.error('CEP inválido.');
        return;
      }

      setFormData({ ...formData, cep, logradouro: data.logradouro, numero: '', cidade: data.localidade, estado: data.uf });
      setIsCEP(true);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error.message);
      setIsCEP(true);
    }
  };

  const handleNumber = async (event) => {
    const response = await getCoordinatesFromAddress(formData.cep, event.target.value);

    if (response) {
      setFormData({ ...formData, numero: event.target.value, latitude: response.latitude, longitude: response.longitude });
      return;
    }
    toast.error('Não foi possível encontrar as coordenadas.');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const userLogged = JSON.parse(localStorage.getItem('loggedUser'));
    const generatedId = Math.random();
    const { id } = userLogged;

    const arrayContactsUsers = JSON.parse(localStorage.getItem(`contacts_user_${id}`)) || [];

    const existingContactIndex = arrayContactsUsers.findIndex(contact => contact.id === formData.id);

    if (existingContactIndex !== -1) {
      // Atualiza os dados do contato existente
      arrayContactsUsers[existingContactIndex] = formData;
    } else {
      // Adiciona um novo contato
      arrayContactsUsers.push({
        ...formData,
        id: generatedId,
      });
    }

    // Salva a lista atualizada no localStorage
    localStorage.setItem(`contacts_user_${id}`, JSON.stringify(arrayContactsUsers));

    toast.success('Contato adicionado com sucesso!');
    setFormData({});
    setIsDialogOpen(false);
  };

  const handleDeleteContactSubmit = (event) => {
    event.preventDefault();
  
    const userLogged = JSON.parse(localStorage.getItem('loggedUser'));
    if (!userLogged) return;
  
    const { id } = userLogged;
    const arrayContactsUsers = JSON.parse(localStorage.getItem(`contacts_user_${id}`)) || [];
  
    // Encontrar o índice correto do contato a ser excluído
    const indexToDelete = arrayContactsUsers.findIndex(findContact => findContact.id === contact.id);
  
    if (indexToDelete !== -1) {
      arrayContactsUsers.splice(indexToDelete, 1);
  
      // Atualiza a lista no localStorage apenas se um item foi removido
      localStorage.setItem(`contacts_user_${id}`, JSON.stringify(arrayContactsUsers));
    }


    toast.success('Contato excluído com sucesso!');
    setIsDeleteDialogOpen(false);
  };


  useEffect(() => {
    if (!localStorage.getItem('loggedUser')) {
      navigate('/login');
    }
  }, []);


  return (
    <Box>
      <Toaster position="top-right" />
      <Header />
      <Grid container spacing={2} sx={{ minHeight: "100vh", overflow: 'hidden' }}>
        {/* Contatos */}
        <Grid item xs={12} sm={6} md={5} sx={{ minHeight: '400px' }}>
          <ContactList
            contacts={arrayContactsUserLocalStorage}
            onAddContact={setIsDialogOpen}
            onEditContact={setIsDialogOpen}
            onDeleteContact={setIsDeleteDialogOpen}
            onViewOnMap={setLocation}
            searchQuery={search}
            setSearchQuery={setSearch}
            setContact={setContact}
            setFormData={setFormData}
          />
        </Grid>

        {/* Mapa */}
        <Grid item xs={12} sm={6} md={7} sx={{ minHeight: '420px ' }}>
          <Paper elevation={3} sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom textAlign="center">
              Mapa
            </Typography>
            <Box sx={{ flex: 1, overflow: "hidden" }}>
              <GoogleMapComponent location={location} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog para criação e edição */}
      <DialogComponent
        contactsList={arrayContactsUserLocalStorage}
        formData={formData}
        isDialogOpen={isDialogOpen}
        handleCloseDialog={handleCloseDialog}
        handleInputChange={handleInputChange}
        handleVerifyCEP={handleVerifyCEP}
        handleCEP={handleCEP}
        handleNumber={handleNumber}
        handleSubmit={handleSubmit}
        isCEP={isCEP}
        cpfError={cpfError}
        setCpfError={setCpfError}
        cpfIsExisting={cpfIsExisting}
        setIsCPFExisting={setIsCPFExisting}
      />

      {/* Dialog para exclusão */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteContactSubmit}
      />
    </Box>
  );

};

export default Dashboard;