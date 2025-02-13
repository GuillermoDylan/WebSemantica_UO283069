import { useEffect, useState } from "react";
import Arrow from "./Arrow";
import { findCreatedItems } from "../utils/RDFUtils";
import { organizationNode } from "../utils/RDFaUtils";
import {styles} from "../utils/ConstantsUtils";

const OrganizationNode = ({ handleBackwardsTransition, handleTransition, renderValues, getRelationshipValues, nodeId, handleUriTransition }) => {
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
    <div style={styles.nodeWrapper} onKeyDown={handleKeyDown} tabIndex={1} {...organizationNode.wrapper}>
      <div style={styles.arrowLeft}>
      <Arrow direction="left" onClick={handleBackwardsTransition} />
      <p>Previous node</p>
      </div>
      <div style={styles.nodeContents}>
        <div style={styles.arrowTop}>
          <Arrow direction="up" onClick={() => handleTransition("references")} />
          <p>References</p>
        </div>
        <div style={styles.nodeInfo}>
          <h2 property={organizationNode.property.name}>{renderValues(getRelationshipValues('name'))}</h2>
          <p property={organizationNode.property.location}>Location: {renderValues(getRelationshipValues('location'))}</p>
          <p property={organizationNode.property.founder}>Founder: {renderValues(getRelationshipValues("founder"))}</p>
          <div>
            <h3>Created Items:</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {createdItemsData.map(item => {
                return <li style={{ marginBottom: "1rem" }}>{renderValues([item])}</li>;
              })}
            </ul>
          </div>
        </div>
        <div style={styles.arrowDown}>
          <p>Created or manufactured</p>
          <Arrow direction="down" onClick={() => handleUriTransition(createdItemsData[0])} />
        </div>
      </div>
      <div style={styles.arrowRight}>
        <p>Random organization</p>
        <Arrow direction="right" onClick={() => handleTransition("follows")} />
      </div>
    </div>
  );
};

export default OrganizationNode;