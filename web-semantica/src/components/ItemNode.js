import { useEffect, useState } from "react";
import Arrow from "./Arrow";
import { styles } from "../utils/ConstantsUtils";
import { itemNode } from "../utils/RDFaUtils";

const ItemNode = ({ nodeId, handleBackwardsTransition, handleTransition, renderValues, getRelationshipValues, handleExternalUriTransition }) => {

  const handleKeyDown = async (e) => {
    if (e.key === "ArrowRight") {
    }else if(e.key === "ArrowDown"){
        handleBackwardsTransition();
    }else if(e.key === "ArrowUp"){
        handleTransition("references");
    }
  }

  const renderUrls = (values) => {
    return values.length > 0 ? (
        <>
            <h3>Significant links</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {values.map((value, index) => (
                    <li key={index}>
                        <a property={itemNode.property.significantLink} href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                    </li>
                ))}
            </ul>
        </>
    ) : <></>;
  }


  return (
    <div style={styles.nodeWrapper} onKeyDown={handleKeyDown} 
    tabIndex={1} typeof={getRelationshipValues("type")} resource={nodeId}>
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
                    return comment;
                  }
                  return renderValues(getRelationshipValues('rdf-schema#comment'));
                })()
              }
            </p>
            <p>{renderUrls(getRelationshipValues('significantLink'))}</p>
            <p>{<img property={itemNode.property.image} style={{width: 350, height: "auto"}} src={getRelationshipValues('image')}/>}</p>
            {Number.isInteger(parseInt(getRelationshipValues('version')[0])) && <p>Version <span property={itemNode.property.version}>{getRelationshipValues('version')[0]}</span></p>}
            {getRelationshipValues('programmingLanguage').length > 0 && <p>Programming Language used:<a property={itemNode.property.programmingLanguage} href={getRelationshipValues('programmingLanguage')}>Link</a></p>}
        </div>
        <div  style={styles.arrowDown}>
          {getRelationshipValues('references').length > 0 && <><Arrow direction="down" onClick={() => handleExternalUriTransition(getRelationshipValues("references")[0])}/><p>References</p></>}
        </div>
      </div>
      <div style={styles.arrowRight}>
        {getRelationshipValues('version').length > 0 && !Number.isInteger(parseInt(getRelationshipValues('version')[0])) &&<><Arrow direction="right" onClick={() => handleTransition("version")}/><p>Version</p></>}
      </div>
    </div>
  );
};

export default ItemNode;