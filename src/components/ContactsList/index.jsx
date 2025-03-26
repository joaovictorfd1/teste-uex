import React from 'react';
import { 
  Box, 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { getFirstNameAndConvertToUpperCase } from '../../helpers';

const ContactList = ({ 
  contacts,
  onAddContact, 
  onEditContact, 
  onDeleteContact, 
  onViewOnMap,
  searchQuery,
  setSearchQuery,
  setContact,
  setFormData,
}) => {
  
  const filteredContacts = contacts.filter(contact => 
    contact.nome_completo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.cpf.includes(searchQuery)
  );

  return (
    <Card 
      className="contact-list-container"
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: 3,
        bgcolor: 'background.paper',
        borderRadius: 2
      }}
    >
      <CardHeader 
        title="Contatos" 
        sx={{ 
          pb: 1,
          '& .MuiCardHeader-title': {
            fontSize: '1.25rem',
            fontWeight: 500,
            textAlign: 'center'
          }
        }} 
      />
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        p: 2, 
        pt: 0 
      }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained" 
            color="primary"
            onClick={onAddContact}
            size="small"
          >
            Adicionar
          </Button>
        </Box>
        
        <Box sx={{ 
          border: 1, 
          borderColor: 'divider', 
          borderRadius: 1, 
          overflow: 'hidden',
          flexGrow: 1,
        }}>
          {filteredContacts.length > 0 ? (
            <TableContainer 
              sx={{ 
                height: { xs: 'calc(100vh - 300px)', md: 'calc(100vh - 230px)' }, 
                overflow: 'auto'
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="120px">CPF</TableCell>
                    <TableCell width="120px">Nome</TableCell>
                    <TableCell width="100px">CEP</TableCell>
                    <TableCell>Logradouro</TableCell>
                    <TableCell width="80px">Número</TableCell>
                    <TableCell width="120px" align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      hover
                      sx={{
                        cursor: 'pointer',
                        '&:hover .action-buttons': {
                          opacity: 1,
                        }
                      }}
                      onClick={() => onViewOnMap({
                        lat: contact.latitude, 
                        lng: contact.longitude
                      })}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{contact.cpf || ""}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{getFirstNameAndConvertToUpperCase(contact.nome_completo || "")}</TableCell>
                      <TableCell>{contact.cep}</TableCell>
                      <TableCell sx={{ 
                        maxWidth: '200px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {contact.logradouro}
                      </TableCell>
                      <TableCell>{contact.numero}</TableCell>
                      <TableCell align="right">
                        <Box 
                          className="action-buttons"
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end',
                            transition: 'opacity 0.2s'
                          }}
                        >
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => {
                              setFormData(contact);
                              onEditContact(true)
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => {
                              setContact(contact);
                              onDeleteContact(true)
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              py: 5,
              textAlign: 'center'
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1.5, 
                bgcolor: 'grey.100', 
                borderRadius: '50%',
                mb: 2
              }}>
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Nenhum contato encontrado
              </Typography>
              <Typography 
                variant="body2" 
                color="textSecondary" 
                sx={{ maxWidth: 'sm', mb: 3 }}
              >
                {contacts.length > 0 ? "Tente ajustar sua busca" : "Você ainda não cadastrou nenhum contato. Vamos começar?"}
              </Typography>
              <Button
                onClick={onAddContact}
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ borderStyle: 'dashed' }}
              >
                Adicionar contato
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContactList;
