import React, { useEffect, useState, useRef } from 'react';
import {fetchData, fetchFederatedNode, prefixResolver} from '../utils/RDFUtils';
import {CSSTransition} from 'react-transition-group';
import PersonNode from './PersonNode';
import OrganizationNode from './OrganizationNode';
import ItemNode from './ItemNode';
import ExternalNode from './ExternalNode';
import LocationNode from './LocationNode';
import { prefixNode } from '../utils/RDFaUtils';
import Button from '@mui/material/Button';

const RDFNode = ({ searchedNode, setSearchedNode } = {}) => {
  const [nodeId, setNodeId ] = useState('uo:Lain_Iwakura');
  const [nodeData, setNodeData] = useState(null);
  const [relationships, setRelationships] = useState({});
  const [transitionState, setTransitionState] = useState(true);
  const nodeRef = useRef(null);
  const [visitedNodes, setVisitedNodes] = useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      if (searchedNode) {
        handleUriTransition(searchedNode);
      }else {
        const { nodeId: fetchedNodeId, relationships } = await fetchData(nodeId);
        setNodeData({ title: fetchedNodeId });
        setRelationships(relationships);
      }
    };
    fetchDataAsync();
  }, [searchedNode]);

  if (!nodeData) {
    return <div>Loading...</div>;
  }

  const getRelationshipValues = (key) => {
    return relationships[key] || [];
  };

  const renderValues = (values, rdfa) => {
    return values.map((value, index) => {
      if (value.startsWith('http://') || value.startsWith('https://')) {
      let displayValue = "";
      if(value.includes("#")){
        displayValue = value.split('#').pop();
      }else {
        displayValue = value.split('/').pop();
      }
      return (
        <span key={index}>
          <Button onClick={() => handleUriTransition(value)} property={rdfa} resource={prefixResolver(value.replace(displayValue ,"")) + ":" + displayValue}>
            {displayValue}
          </Button>
          {index < values.length - 1 ? ', ' : ''}
        </span>
      );
      }
      return (
      <span key={index} property={rdfa}>
        {value}
        {index < values.length - 1 ? ', ' : ''}
      </span>
      );
    });
  };

  const loadNode = async (nodeUri) => {
    if(nodeUri == undefined){return;}
    await new Promise(r => setTimeout(r, 200));
    const uriParts = nodeUri.split('/');
    var entity = uriParts.pop();
    const prefix = uriParts.join('/') + "/";
    if (visitedNodes[visitedNodes.length - 1] !== nodeId) {
      setVisitedNodes([...visitedNodes, nodeId]); // Add the current node to the visited nodes
    }
    const newId = prefixResolver(prefix) + ":" + entity;
    setNodeId(newId); // Update the node id
    const { fetchedNodeId, relationships } = await fetchData(newId);
    setNodeData({ title: fetchedNodeId });
    const updatedRelationships = {};
    for (const [key, values] of Object.entries(relationships)) {
      const updatedKey = key.includes('#') ? key.split('#').pop() : key;
      updatedRelationships[updatedKey] = values;
    }
    setRelationships(updatedRelationships);
    setRelationships(relationships);
  };

  const loadExternalNode = async (nodeUri) => {
    if(nodeUri == undefined){return;}
    await new Promise(r => setTimeout(r, 200));
    const uriParts = nodeUri.split('/');
    var entity = uriParts.pop();
    const prefix = uriParts.join('/') + "/";
    if (visitedNodes[visitedNodes.length - 1] !== nodeId) {
      setVisitedNodes([...visitedNodes, nodeId]); // Add the current node to the visited nodes
    }
    const newId = prefixResolver(prefix) + ":" + entity;
    setNodeId(newId); // Update the node id
    const { nodeId: fetchedNodeId, relationships } = await fetchFederatedNode(newId);
    setNodeData({ title: fetchedNodeId });
    setRelationships(relationships);
  }
  
  const loadPreviousNode = async () => {
    await new Promise(r => setTimeout(r, 200));
    if (visitedNodes.length >= 1) {
      const previousNodeId = visitedNodes[visitedNodes.length - 1];
      const { nodeId: fetchedNodeId, relationships } = await fetchData(previousNodeId);
      setVisitedNodes(visitedNodes.slice(0, -1));
      setNodeId(previousNodeId);
      setNodeData({ title: fetchedNodeId });
      setRelationships(relationships);
    }
  };

  const handleTransition = async (relation) => {
    setTransitionState(false);
    await loadNode(getRelationshipValues(relation)[0]);
    setTransitionState(true);
    setSearchedNode(undefined);
  }

  const handleUriTransition = async (data) => {
    setTransitionState(false);
    await loadNode(data);
    setTransitionState(true);
    setSearchedNode(undefined);
  }
  
  const handleBackwardsTransition = async () => {
    setTransitionState(false);
    await loadPreviousNode();
    setTransitionState(true);
    setSearchedNode(undefined);
  }

  const handleExternalUriTransition = async (data) => {
    setTransitionState(false);
    await loadExternalNode(data);
    setTransitionState(true);
    setSearchedNode(undefined);
  }

  const checkIsItem = (URIs) => {
    return URIs.some(URI => 
        URI.includes("uniovi.es/miw/uo283069/entity/ComputerCode") || 
        URI.includes("schema.org/WebPage") || 
        URI.includes("dbpedia.org/resource/Electrical_device") || 
        URI.includes("dbpedia.org/resource/Computer") ||
        URI.includes("dbpedia.org/resource/Operating_system") || 
        URI.includes("schema.org/Product") || 
        URI.includes("wikidata.org/entity/Q15836568")
    );
}


  const renderContent = () => {
    return (
      <CSSTransition
        in={transitionState}
        nodeRef={nodeRef}
        timeout={200}
        unmountOnExit
        classNames="fading"
      >
        {state =>(
          <div ref={nodeRef} style={{ height: '100%' }} tabIndex={0} prefix={prefixNode}>
            
            {getRelationshipValues("type").includes('http://schema.org/Person') ? (
                <PersonNode handleBackwardsTransition={handleBackwardsTransition} handleTransition={handleTransition} renderValues={renderValues} 
                getRelationshipValues={getRelationshipValues} visitedNodes={visitedNodes} handleUriTransition={handleUriTransition} currentNode={nodeId}/>
            ) : (
              getRelationshipValues("type").includes('http://schema.org/Organization') ? (<OrganizationNode nodeId={nodeId} handleBackwardsTransition={handleBackwardsTransition} handleTransition={handleTransition} 
                renderValues={renderValues} getRelationshipValues={getRelationshipValues} handleUriTransition={handleUriTransition} handleExternalUriTransition={handleExternalUriTransition}/>)
                : (
                  checkIsItem(getRelationshipValues("type")) ? (<ItemNode nodeId={nodeId} handleBackwardsTransition={handleBackwardsTransition} handleTransition={handleTransition} renderValues={renderValues}
                    getRelationshipValues={getRelationshipValues} handleExternalUriTransition={handleExternalUriTransition} />)
                    : getRelationshipValues("type").includes("http://schema.org/City") ?( <LocationNode nodeId={nodeId} handleBackwardsTransition={handleBackwardsTransition} getRelationshipValues={getRelationshipValues}/>) 
                    : <ExternalNode handleBackwardsTransition={handleBackwardsTransition} handleTransition={handleTransition} nodeId={nodeId} getRelationshipValues={getRelationshipValues} />
                )
            )}

          </div>
        )}
    </CSSTransition>
    );
  };

  return (
    <div className="rdf-node">
      {renderContent()}
    </div>
  );
};

export default RDFNode;