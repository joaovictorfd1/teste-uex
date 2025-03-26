import axios from 'axios';

const GOOGLE_PLACES_API = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const API_KEY = import.meta.env.VITE_MAPS_KEY;

export function getFirstNameAndConvertToUpperCase(fullName) {
  if (!fullName) return '';

  return fullName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export async function getCoordinatesFromAddress(cep, numero) {
  const address = `${cep}, ${numero}, Brasil`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      console.error("Erro na busca:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    return null;
  }
}

export function formatCPF (cpf) {
  cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return cpf.replace(/(\d{3})(\d{1,})/, '$1.$2');
  } else if (cpf.length <= 9) {
    return cpf.replace(/(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3');
  } else if (cpf.length <= 11) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3-$4');
  }

  return cpf;
};

// Função para validar CPF
export function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os números são iguais (ex: 111.111.111.11)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  let weight = 10;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * weight--;
  }
  let firstCheckDigit = (sum * 10) % 11;
  if (firstCheckDigit === 10 || firstCheckDigit === 11) firstCheckDigit = 0;
  if (firstCheckDigit !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  weight = 11;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * weight--;
  }
  let secondCheckDigit = (sum * 10) % 11;
  if (secondCheckDigit === 10 || secondCheckDigit === 11) secondCheckDigit = 0;
  if (secondCheckDigit !== parseInt(cpf.charAt(10))) return false;

  return true;
};

export function formatPhone (phone) {
  phone = phone.replace(/\D/g, ''); // Remove caracteres não numéricos

  if (phone.length <= 2) {
    return `(${phone}`;
  } else if (phone.length <= 3) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  } else if (phone.length <= 6) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 3)} ${phone.slice(3)}`;
  } else if (phone.length <= 10) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 3)} ${phone.slice(3, 7)}-${phone.slice(7)}`;
  } else {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 3)} ${phone.slice(3, 7)}-${phone.slice(7, 11)}`;
  }
};

export function formatCEP (value) {
  if (!value) return "";
  
  // Remove caracteres não numéricos
  const numericValue = value.replace(/\D/g, "");

  // Aplica a máscara XXXXX-XXX
  return numericValue.slice(0, 5) + (numericValue.length > 5 ? "-" + numericValue.slice(5, 8) : "");
};



// export async function fetchAddressesFromGoogle (input, uf, cidade) {
//   if (!input) return [];

//   console.log(API_KEY)

//   try {
//     const response = await axios.get(GOOGLE_PLACES_API, {
//       params: {
//         input: `${input}, ${cidade || ''}, ${uf || ''}`,
//         types: 'address',
//         components: `country:br`,
//         key: API_KEY,
//       },
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//       },
//     });

//     if (response.data && response.data.predictions) {
//       return response.data.predictions.map(prediction => ({
//         id: prediction.place_id,
//         description: prediction.description,
//       }));
//     }

//     return [];
//   } catch (error) {
//     console.error('Erro ao buscar endereços:', error);
//     return [];
//   }
// };

