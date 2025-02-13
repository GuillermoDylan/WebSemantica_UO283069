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
            <ul style={{ listStyleType: "none", padding: 0 }}>
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
        <Arrow direction="left" onClick={handleBackwardsTransition} />
        <p>Previous node</p>
      </div>
      <div style={styles.nodeContents}>
        <div  style={styles.arrowTop}>
          {
            getRelationshipValues('creator').length > 0 && <><Arrow direction="up" onClick={() => handleTransition("creator")}/><p>Creator</p></>
            ||
            getRelationshipValues('manufacturer').length > 0 && <><Arrow direction="up" onClick={() => handleTransition("manufacturer")}/><p>Manufacturer</p></>
          }
        </div>
        <div style={styles.nodeInfo}>
            <h2 property={itemNode.property.name}>{renderValues(getRelationshipValues('name'))}</h2>
            <p property={itemNode.property.comment}>
              {
                (() => {
                  var comment = renderValues(getRelationshipValues('comment'));
                  if(comment.length > 0){
                    console.log(comment);
                    return comment;
                  }
                  return renderValues(getRelationshipValues('rdf-schema#comment'));
                })()
              }
            </p>
            <p property={itemNode.property.significantLink}>{renderUrls(getRelationshipValues('significantLink'))}</p>
            <p property={itemNode.property.image}>{<img style={{width: 350, height: "auto"}} src={getRelationshipValues('image')}/>}</p>
            {getRelationshipValues('programmingLanguage').length > 0 && <p property={itemNode.property.programmingLanguage}>Programming Language used:<a href={getRelationshipValues('programmingLanguage')}>Link</a></p>}
        </div>
        <div  style={styles.arrowDown}>
          {getRelationshipValues('references').length > 0 && <><Arrow direction="down" onClick={() => handleTransition("references")}/><p>References</p></>}
        </div>
      </div>
      <div style={styles.arrowRight}>
        {getRelationshipValues('version').length > 0 && <><Arrow direction="right" onClick={() => handleTransition("version")}/><p>Version</p></>
        ||
        <p>Random Item?</p>
        }
      </div>
    </div>
  );
};

export default ItemNode;