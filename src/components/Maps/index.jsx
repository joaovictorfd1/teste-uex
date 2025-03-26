import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const GoogleMapComponent = ({ location }) => {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_MAPS_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={14}>
        {/* Marcador de localização */}
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
