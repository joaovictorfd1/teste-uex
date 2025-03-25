import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ContactsTable from '../ContactsTable';
import { getCoordinatesFromAddress } from '../../helpers';

const Dashboard = () => {

  const navigate = useNavigate();

  const userLogged = JSON.parse(localStorage.getItem('loggedUser'));
  const { id } = userLogged;
  const arrayContactsUserLocalStorage = JSON.parse(localStorage.getItem(`contacts_user_${id}`)) || [];
  const [filteredContacts, setFilteredContacts] = useState(arrayContactsUserLocalStorage);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [location, setLocation] = useState({
      lat: -23.55052, // Latitude inicial (São Paulo)
      lng: -46.633308, // Longitude inicial
    });
  const [isCEP, setIsCEP] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '',
    cep: '',
    logradouro: '',
    numero: '',
    estado: '',
    cidade: '',
    latitude: '',
    longitude: '',
    id: Math.random(),
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFormData({})
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
        alert('CEP inválido.');
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
      setFormData({...formData, latitude: response.latitude, longitude: response.longitude });
      return
    }
    throw new Error('Não foi possível encontrar as coordenadas.');
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };


  // Validação tanto do adicionar, como também será do editar, aqui vai ver se o contato já existe (edição), se sim, vai mudar as informações existentes.

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userLogged = JSON.parse(localStorage.getItem('loggedUser'));
    const { id } = userLogged;

    const arrayContactsUsers = JSON.parse(localStorage.getItem(`contacts_user_${id}`)) || [];

    const existingContactIndex = arrayContactsUsers.findIndex(contact => contact.id === formData.id);

    if (existingContactIndex !== -1) {
      // Atualiza os dados do contato existente
      arrayContactsUsers[existingContactIndex] = formData;
    } else {
      // Adiciona um novo contato
      arrayContactsUsers.push(formData);
    }

    // Salva a lista atualizada no localStorage
    localStorage.setItem(`contacts_user_${id}`, JSON.stringify(arrayContactsUsers));

    setIsDialogOpen(false)
  };

  const handleSearch = (value) => {
    const filteredContacts = arrayContactsUserLocalStorage.filter((contacts) => contacts.nome_completo.toLowerCase().includes(value.toLowerCase()));
    setFilteredContacts(filteredContacts);
  };


  useEffect(() => {
    if (!localStorage.getItem('loggedUser')) {
      navigate('/login');
    }
  }, []);


  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div style={{ flex: '0 0 40%', backgroundColor: '#f0f0f0', padding: '20px' }}>
        <Header title='Contatos' isAdd handleOpenDialog={handleOpenDialog} onSearch={handleSearch} />
        <ContactsTable arrayContactsUserLocalStorage={filteredContacts} setFormData={setFormData} setIsDialogOpen={setIsDialogOpen} setLocation={setLocation} />
      </div>
      <div style={{ flex: '0 0 60%', backgroundColor: '#e0e0e0', padding: '20px' }}>
        <Header title='Mapa' isMap location={location} />
      </div>

      <Dialog fullWidth open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Adicionar Contato</DialogTitle>
        <DialogContent>
          <form id="form-id" method="dialog" onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
              <TextField type="text" name="nome_completo" placeholder="Nome Completo" value={formData.nome_completo} onChange={handleInputChange} required />
              <TextField type="text" name="cep" placeholder="CEP (XXXXX-XXX)" pattern="\d{5}-\d{3}" value={formData.cep} onChange={handleVerifyCEP} onBlur={handleCEP} required />
              {isCEP && (
                <>
                  <TextField type="text" name="rua" placeholder="Rua" value={formData.logradouro} disabled />
                  <TextField type="text" name="estado" placeholder="Estado" value={formData.estado} disabled />
                  <TextField type="text" name="cidade" placeholder="Cidade" value={formData.cidade} disabled />
                  <TextField type="text" name="numero" placeholder="Número" value={formData.numero} onChange={handleInputChange} onBlur={handleNumber} />
                </>
              )}
            </div>
          </form>
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button type="submit" form="form-id">Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;