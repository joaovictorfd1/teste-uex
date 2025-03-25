export function getFirstNameAndConvertToUpperCase(fullName) {
  if (!fullName) return '';

  return fullName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export async function getCoordinatesFromAddress(cep, numero) {
  const apiKey = "AIzaSyB8vNPmzLbnqW2rJHXT4ZIOcSu7C4aN9ag";
  const address = `${cep}, ${numero}, Brasil`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

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
