import { useEffect, useState } from "react";
import Arrow from "./Arrow";
import { styles } from "../utils/ConstantsUtils";
import { itemNode } from "../utils/RDFaUtils";
import { prefixResolver } from "../utils/RDFUtils";

const ExternalNode = ({ handleBackwardsTransition, handleTransition, nodeId, getRelationshipValues }) => {

  const handleKeyDown = async (e) => {
    if (e.key === "ArrowRight") {
    }else if(e.key === "ArrowDown"){
        handleBackwardsTransition();
    }else if(e.key === "ArrowUp"){
        handleTransition("references");
    }
  }



  return (
    <div style={{ ...styles.nodeWrapper, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100vh' }} onKeyDown={handleKeyDown} tabIndex={1} {...itemNode.wrapper}>
      <div style={{ ...styles.arrowLeft, flex: '0 1 auto' }}>
        <Arrow direction="left" onClick={handleBackwardsTransition} />
        <p>Previous node</p>
      </div>
      <div style={{ ...styles.nodeContents, flex: '1 1 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 property={itemNode.property.name}>{getRelationshipValues('label')}</h2>
          <p property={itemNode.property.significantLink}>{getRelationshipValues('description')}</p>
          <p>Link to entity: <a href={prefixResolver(nodeId.split(":")[0]) + nodeId.split(":")[1]}>{getRelationshipValues('label')}</a></p>
        </div>
      </div>
    </div>
  );
};

export default ExternalNode;