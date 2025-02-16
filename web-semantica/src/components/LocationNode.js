import { useEffect, useState } from "react";
import Arrow from "./Arrow";
import { styles } from "../utils/ConstantsUtils";
import { locationNode } from "../utils/RDFaUtils";

const LocationNode = ({ nodeId, handleBackwardsTransition, getRelationshipValues }) => {

  const handleKeyDown = async (e) => {
    if (e.key === "ArrowRight") {
    }else if(e.key === "ArrowDown"){
        handleBackwardsTransition();
    }else if(e.key === "ArrowUp"){
    }
  }

  return (
    <div style={{ ...styles.nodeWrapper, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100vh' }} 
    onKeyDown={handleKeyDown} tabIndex={1} {...locationNode.wrapper} resource={nodeId}>
      <div style={{ ...styles.arrowLeft, flex: '0 1 auto' }}>
        <Arrow direction="left" onClick={handleBackwardsTransition} />
        <p>Previous node</p>
      </div>
      <div style={{ ...styles.nodeContents, flex: '1 1 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
            <h2 property={locationNode.property.label}>{getRelationshipValues('rdf-schema#label')}</h2>
            <h3 property={locationNode.property.alternateName}>{getRelationshipValues('alternateName')}</h3>
            <p>Contained in place: <a property={locationNode.property.containedInPlace} href={getRelationshipValues('containedInPlace')}>link</a></p>
            <p>Latitude: <span datatype="xsd:float" property={locationNode.property.latitude}>{getRelationshipValues('latitude')}</span></p>
            <p>Longitude: <span datatype="xsd:float" property={locationNode.property.longitude}>{getRelationshipValues('longitude')}</span></p>
        </div>
      </div>
    </div>
  );
};

export default LocationNode;