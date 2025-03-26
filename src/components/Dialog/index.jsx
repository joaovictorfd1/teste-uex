import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Button, TextField } from "@mui/material";
import { formatCPF, formatPhone, isValidCPF } from '../../helpers';


export const DialogComponent = ({
  formData,
  isCEP,
  isDialogOpen,
  handleCloseDialog,
  handleInputChange,
  handleVerifyCEP,
  handleCEP,
  handleNumber,
  handleSubmit,
  cpfError,
  setCpfError,
}) => {

  const handlePhoneChange = (e) => {
    let { value } = e.target;
    value = formatPhone(value); // Formata o telefone enquanto o usuário digita
    handleInputChange({ target: { name: 'telefone', value } }); // Atualiza o estado com o valor formatado
  };
  

  const handleCPFChange = (e) => {
    let { value } = e.target;

    // Formata o CPF enquanto o usuário digita
    value = formatCPF(value);

    handleInputChange({ target: { name: 'cpf', value } }); // Passa o valor formatado para o handler original

    // Verifica se o CPF é válido
    if (isValidCPF(value.replace(/\D/g, ''))) {
      setCpfError(false);
    } else {
      setCpfError(true);
    }
  };

  return (
    <Dialog fullWidth open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Adicionar Contato</DialogTitle>
      <DialogContent>
        <Box component={'form'} id="form-id" onSubmit={handleSubmit}>
          <Box component={'div'} display={'flex'} flexDirection={'column'} gap={'10px'} marginBottom={'10px'}>
            <TextField
              fullWidth
              type="text"
              name="nome_completo"
              placeholder="Nome Completo"
              value={formData.nome_completo}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              type="text"
              name="cpf"
              placeholder="CPF (XXX.XXX.XXX-XX)"
              value={formData.cpf}
              onChange={handleCPFChange}
              required
              error={cpfError}
              helperText={cpfError ? "CPF inválido" : ""}
            />
            <TextField
              fullWidth
              type="text"
              name="telefone"
              placeholder="Telefone (99) 9 9999-9999"
              value={formData.telefone}
              onChange={handlePhoneChange}
              required
            />
            <TextField
              fullWidth
              type="text"
              name="cep"
              placeholder="CEP (XXXXX-XXX)"
              pattern="\d{5}-\d{3}"
              value={formData.cep}
              onChange={handleVerifyCEP}
              onBlur={handleCEP}
              required
            />
            {isCEP && (
              <>
                <TextField fullWidth type="text" name="rua" placeholder="Rua" value={formData.logradouro} disabled />
                <TextField fullWidth type="text" name="estado" placeholder="Estado" value={formData.estado} disabled />
                <TextField fullWidth type="text" name="cidade" placeholder="Cidade" value={formData.cidade} disabled />
                <TextField
                  fullWidth
                  type="text"
                  name="numero"
                  placeholder="Número"
                  value={formData.numero}
                  onChange={handleInputChange}
                  onBlur={handleNumber}
                />
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
        <Button onClick={handleCloseDialog}>Cancelar</Button>
        <Button type="submit" form="form-id">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

