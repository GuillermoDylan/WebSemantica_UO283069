import { useEffect, useState } from "react";
import Arrow from "./Arrow";
import { findCreatedItems } from "../utils/RDFUtils";
import { organizationNode } from "../utils/RDFaUtils";
import {styles} from "../utils/ConstantsUtils";

const OrganizationNode = ({ handleBackwardsTransition, handleTransition, renderValues, getRelationshipValues, nodeId, handleUriTransition, handleExternalUriTransition }) => {
  const [createdItemsData, setCreatedItemsData] = useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      var items = await findCreatedItems(nodeId);
      console.log(items);
      setCreatedItemsData(items);
    };
    fetchDataAsync();
  }, [nodeId]);

  const handleKeyDown = async (e) => {
    if (e.key === "ArrowRight") {
        // TODO handle isCreatorOf
    }else if(e.key === "ArrowDown"){
        handleBackwardsTransition();
    }else if(e.key === "ArrowUp"){
        handleTransition("references");
    }
  }

  return (
    <div style={styles.nodeWrapper} onKeyDown={handleKeyDown} 
    tabIndex={1} {...organizationNode.wrapper} resource={nodeId}>
      <div style={styles.arrowLeft}>
      <Arrow direction="left" onClick={handleBackwardsTransition} />
      <p>Previous node</p>
      </div>
      <div style={styles.nodeContents}>
        <div style={styles.arrowTop}>
          {getRelationshipValues('references')[0] && <><Arrow direction="up" onClick={() => handleExternalUriTransition(getRelationshipValues('references')[0])} />
          <p>References</p></>}
        </div>
        <div style={styles.nodeInfo}>
          <h2>{renderValues(getRelationshipValues('name'), organizationNode.property.name)}</h2>
          <p>Location: {renderValues(getRelationshipValues('location'), organizationNode.property.location)}</p>
          <p>Founder: {renderValues(getRelationshipValues("founder"), organizationNode.property.founder)}</p>
          {createdItemsData.length > 0 && <div>
            <h3>Created Items:</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {createdItemsData.map(item => {
                return <li style={{ marginBottom: "1rem" }}>{renderValues([item])}</li>;
              })}
            </ul>
          </div>}
        </div>
        <div style={styles.arrowDown}>
          {createdItemsData[0] && <><p>Created or manufactured</p>
          <Arrow direction="down" onClick={() => handleUriTransition(createdItemsData[0])} /></>}
        </div>
      </div>
      <div style={styles.arrowRight}>
        {getRelationshipValues("follows").length > 0 && <><p>Random organization</p>
        <Arrow direction="right" onClick={() => handleTransition("follows")} /></>}
      </div>
    </div>
  );
};

export default OrganizationNode;