import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Button, TextField } from "@mui/material";
import { formatCEP, formatCPF, formatPhone, isValidCPF } from '../../helpers';
import { useMemo } from 'react';

export const DialogComponent = ({
  formData,
  isDialogOpen,
  handleCloseDialog,
  handleInputChange,
  handleCEP,
  handleSubmit,
  handleNumber,
  cpfError,
  setCpfError,
}) => {

  const handleCPFChange = (e) => {
    const { value } = e.target;
    const formattedCPF = formatCPF(value);
  
    if (!value) {
      setCpfError(false); // Reseta o erro se o campo estiver vazio
    } else {
      setCpfError(!isValidCPF(formattedCPF)); // Valida o CPF
    }
  
    handleInputChange({ target: { name: 'cpf', value: formattedCPF } });
  };

  const handleCEPChange = (e) => {
    const { value } = e.target;
    const formmattedCEP = formatCEP(value);
    handleInputChange({ target: { name: 'cep', value: formmattedCEP } });
  }

  const isEdit = useMemo(() => {
    return !!formData.id;
  }, [formData])

  return (
    <Dialog fullWidth open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>{`${isEdit ? 'Editar' : 'Adicionar'} Contato`}</DialogTitle>
      <DialogContent>
        <Box component={'form'} id="form-id" onSubmit={handleSubmit}>
          <Box component={'div'} display={'flex'} flexDirection={'column'} gap={'10px'} marginBottom={'10px'}>
            <TextField
              fullWidth
              name="nome_completo"
              placeholder="Nome Completo"
              value={formData.nome_completo}
              onChange={handleInputChange}
              required
              disabled={isEdit}
            />
            <TextField
              fullWidth
              name="cpf"
              placeholder="CPF (XXX.XXX.XXX-XX)"
              value={formData.cpf}
              onChange={handleCPFChange}
              required
              error={cpfError}
              helperText={cpfError ? "CPF inválido" : ""}
              disabled={isEdit}
            />
            <TextField
              fullWidth
              name="telefone"
              placeholder="Telefone (99) 9 9999-9999"
              value={formData.telefone}
              onChange={(e) => handleInputChange({ target: { name: 'telefone', value: formatPhone(e.target.value) } })}
              required
              disabled={isEdit}
            />

            <TextField fullWidth name="cep" placeholder="CEP" value={formData.cep} onChange={handleCEPChange} onBlur={handleCEP} required />

            <TextField fullWidth name="estado" placeholder="Estado" value={formData.estado} disabled />
            <TextField fullWidth name="cidade" placeholder="Cidade" value={formData.cidade} disabled />
            <TextField fullWidth name="logradouro" placeholder="Rua" value={formData.logradouro} disabled />
            <TextField fullWidth name="bairro" placeholder="Bairro" value={formData.bairro} />
            <TextField fullWidth name="numero" placeholder="Número" value={formData.numero} onChange={handleInputChange} onBlur={handleNumber} />
            
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
        <Button type='button' variant='text' color='error' onClick={handleCloseDialog}>Cancelar</Button>
        <Button type="submit" variant='contained' form="form-id" disabled={cpfError}> {/* Impede envio se CPF for inválido */}
          {`${isEdit? 'Salvar' : 'Cadastrar'} Contato`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
