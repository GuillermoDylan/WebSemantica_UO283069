import { useEffect, useState } from "react";
import Arrow from "./Arrow";
import { styles } from "../utils/ConstantsUtils";
import { itemNode } from "../utils/RDFaUtils";

const ItemNode = ({ handleBackwardsTransition, handleTransition, renderValues, getRelationshipValues }) => {

  const handleKeyDown = async (e) => {
    if (e.key === "ArrowRight") {
    }else if(e.key === "ArrowDown"){
        handleBackwardsTransition();
    }else if(e.key === "ArrowUp"){
        handleTransition("references");
    }
  }

  const renderUrls = (values) => {
    return (
        <>
            <h3>Significant links</h3>
            <ul>
                {values.map((value, index) => (
                    <li key={index}>
                        <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                    </li>
                ))}
            </ul>
        </>
    );
  }

  return (
    <div style={styles.nodeWrapper} onKeyDown={handleKeyDown} tabIndex={1} {...itemNode.wrapper}>
      <div style={styles.arrowLeft}>
        <Arrow direction="left" onClick={""} />
      </div>
      <div style={styles.nodeContents}>
        <div  style={styles.arrowTop}>
            <Arrow direction="up" onClick={handleBackwardsTransition} />
            <p>Creator</p>
        </div>
        <div style={styles.nodeInfo}>
            <h2 property={itemNode.property.name}>{renderValues(getRelationshipValues('name'))}</h2>
            <p property={itemNode.property.comment}>{renderValues(getRelationshipValues('comment'))}</p>
            <p property={itemNode.property.significantLink}>{renderUrls(getRelationshipValues('significantLink'))}</p>
        </div>
        <div  style={styles.arrowDown}>
          <Arrow direction="down" onClick={handleBackwardsTransition} />
        </div>
      </div>
      <div style={styles.arrowRight}>
        <Arrow direction="right" onClick={() => handleTransition("follows")} />
      </div>
    </div>
  );
};

export default ItemNode;