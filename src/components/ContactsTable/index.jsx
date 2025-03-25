import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import { getFirstNameAndConvertToUpperCase } from "../../helpers";

const ContactsTable = ({ arrayContactsUserLocalStorage, setFormData, setIsDialogOpen, setLocation }) => {
  return (
    <TableContainer component={Paper}>
      {arrayContactsUserLocalStorage.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CEP</TableCell>
              <TableCell>Logradouro</TableCell>
              <TableCell>Número</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {arrayContactsUserLocalStorage.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{getFirstNameAndConvertToUpperCase(contact.nome_completo || '')}</TableCell>
                <TableCell>{contact.cep}</TableCell>
                <TableCell>{contact.logradouro}</TableCell>
                <TableCell>{contact.numero}</TableCell>
                <TableCell>
                  <Button 
                    color="primary" 
                    onClick={() => {
                      setFormData(contact);
                      setIsDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button 
                    color="secondary" 
                    onClick={() => {
                      setFormData(contact);
                      setIsDialogOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                  <Button 
                    color="secondary" 
                    onClick={() => {
                      if (contact.latitude && contact.longitude) {
                        setLocation({ lat: contact.latitude, lng: contact.longitude });
                      } else {
                        alert("Este contato não possui coordenadas cadastradas.");
                      }
                    }}
                  >
                    <RemoveRedEyeIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="h4" align="center" style={{ marginTop: "20px", color: "black" }}>
          Nenhum contato cadastrado.
        </Typography>
      )}
    </TableContainer>
  );
};

export default ContactsTable;
