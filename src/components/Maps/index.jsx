import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "80%",
  height: "600px",
};

const GoogleMapComponent = ({ location }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyB8vNPmzLbnqW2rJHXT4ZIOcSu7C4aN9ag">
      <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={14}>
        {/* Marcador de localização */}
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
