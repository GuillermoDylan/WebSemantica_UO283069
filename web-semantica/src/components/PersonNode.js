import Arrow from "./Arrow";
import {fetchRandomPersonNode, findCreatedItems} from "../utils/RDFUtils";
import { useEffect } from "react";
import { useState } from "react";
import { styles } from "../utils/ConstantsUtils";
import { personNode } from "../utils/RDFaUtils";

const PersonNode = ({handleBackwardsTransition, handleTransition, renderValues, getRelationshipValues, visitedNodes, handleUriTransition, currentNode}) => {

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (currentNode) {
      getCreatedItems();
    }
  }, [currentNode]);

    const handleKeyDown = async (e) => {
        if (e.key === "ArrowRight") {
          handleTransition("follows");
        }else if(e.key === "ArrowLeft"){
          handleBackwardsTransition();
        }else if(e.key === "ArrowUp"){
          handleTransition("employmentUnit");
        }else if(e.key === "ArrowDown"){
        }
      }

    const handleRandomPersonTransition = async () => {
      if(currentNode != undefined){
        visitedNodes.push(currentNode);
        var person = await fetchRandomPersonNode(visitedNodes);
        if(person != undefined && person.includes("example.org"))
          handleUriTransition(person);
        else 
          visitedNodes.pop();
      }
    }

    const getCreatedItems = async () => {
      setItems(await findCreatedItems(currentNode));
    }

    const handleTransitionToUri = async (data) => {
      console.log(data);
      await handleUriTransition(data);
    }

    return (
        <div style={styles.nodeWrapper} onKeyDown={handleKeyDown} tabIndex={1} {...personNode.wrapper}>
          <div style={styles.arrowLeft}>
            <Arrow direction="left" onClick={async () => { await handleBackwardsTransition(); } } />
            <p>Previous node</p>
          </div>
          <div style={styles.nodeContents}>
            <div  style={styles.arrowTop}>
              {getRelationshipValues("employmentUnit").length > 0 && <>
                <Arrow direction="up" onClick={() => handleTransition("employmentUnit")} />
                <p>Unit of employment</p> 
              </>} 
            </div>
            <div style={styles.nodeInfo}>
                <h2 property={personNode.property.name}>{renderValues(getRelationshipValues('name'))}</h2>
                <p property={personNode.property.gender}>Gender: {renderValues(getRelationshipValues('gender'))}</p>
                <p property={personNode.property.age}>Age: {renderValues(getRelationshipValues('age'))}</p>
                {getRelationshipValues('parent').length > 0 && 
                  <p property={personNode.property.parent}>Parents: {renderValues(getRelationshipValues('parent'))}</p>}
                {getRelationshipValues('sibling').length > 0 && 
                  <p property={personNode.property.sibling}>Siblings: {renderValues(getRelationshipValues('sibling'))}
                  </p>}
                {getRelationshipValues('characterRole').length > 0 && 
                  <p property={personNode.property.characterRole}>Character Role: {renderValues(getRelationshipValues('characterRole'))}</p>}
                {items.length > 1 && (
                  <div>
                    <h3>Creator of:</h3>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {renderValues(items.slice(1))}
                    </ul>
                  </div>
                )}
            </div>
            <div  style={styles.arrowDown}>
                {items.length > 0 && <>
                  <p>Creator of</p>
                  <Arrow direction="down" onClick={() => { handleTransitionToUri(items[0]); }} />
                </>}
            </div>
          </div>
          <div style={styles.arrowRight}>
              {getRelationshipValues('follows').length > 0 ? 
              <><p>Follows</p> <Arrow direction="right" property={personNode.property.follows} onClick={() => handleTransition("follows")} /></> 
              : <><p>Random Person</p><Arrow direction="right" onClick={() => handleRandomPersonTransition()} /></>
            }
          </div>
        </div>
    );
}

export default PersonNode;