import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Button, TextField } from "@mui/material";
import { formatCEP, formatCPF, formatPhone, isValidCPF } from '../../helpers';
import { useMemo } from 'react';

export const DialogComponent = ({
  contactsList,
  formData,
  isDialogOpen,
  handleCloseDialog,
  handleInputChange,
  handleCEP,
  handleSubmit,
  handleNumber,
  cpfError,
  setCpfError,
  cpfIsExisting,
  setIsCPFExisting,
}) => {

  const handleCPFChange = (e) => {
    const { value } = e.target;
    const formattedCPF = formatCPF(value);
  
    // Sempre atualizar o valor antes das verificações
    handleInputChange({ target: { name: 'cpf', value: formattedCPF } });
  
    // Se o campo estiver vazio, resetar os erros
    if (!formattedCPF) {
      setCpfError(false);
      setIsCPFExisting(false);
      return;
    }
  
    // Se o CPF for menor que 14 caracteres ou inválido, ativar erro
    if (formattedCPF.length < 14 || !isValidCPF(formattedCPF)) {
      setCpfError(true);
      setIsCPFExisting(false);
      return;
    }
  
    // Se o CPF já existir na lista, ativar erro de duplicidade
    const isExistingContact = contactsList.some(contact => contact.cpf === formattedCPF);
    if (isExistingContact) {
      setIsCPFExisting(true);
      setCpfError(false); // Prioriza o erro de duplicidade
      return;
    }
  
    // Resetar os erros caso tudo esteja correto
    setCpfError(false);
    setIsCPFExisting(false);
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
              error={cpfError || cpfIsExisting}
              helperText={cpfError ? "CPF inválido" : cpfIsExisting ? 'CPF já existe' : ""}
              disabled={isEdit}
              inputProps={{ maxLength: 14 }}
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
        <Button type="submit" variant='contained' form="form-id" disabled={cpfError || cpfIsExisting}>
          {`${isEdit? 'Salvar' : 'Cadastrar'} Contato`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
