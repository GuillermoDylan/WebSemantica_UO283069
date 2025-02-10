export const prefixResolver = (prefix) => {

    const prefixes = {
        'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
        'owl': 'http://www.w3.org/2002/07/owl#',
        'xsd': 'http://www.w3.org/2001/XMLSchema#',
        'ex': 'http://example.org/',
        'schema': 'http://schema.org/'
    };

    const urls = {
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#': 'rdf',
        'http://www.w3.org/2000/01/rdf-schema#': 'rdfs',
        'http://www.w3.org/2002/07/owl#': 'owl',
        'http://www.w3.org/2001/XMLSchema#': 'xsd',
        'http://example.org/': 'ex',
        'http://schema.org/': 'schema'
    };

    if(prefix.includes(':')) {
        return urls[prefix];
    }

    return prefixes[prefix];

};

const fetchQuery = async (query) => {
    const url = 'http://156.35.95.43:3030/SerialExperimentsLain/sparql';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    });
    return await response.json();
};

export const fetchData = async (nodeId) => {
    if (nodeId === "Unknown") {
        return;
    }
    const query = `
        PREFIX ex: <http://example.org/>
        SELECT ?predicate ?object
        WHERE { 
            ${nodeId} ?predicate ?object 
        }
    `;
    const data = await fetchQuery(query);
    const relationships = data.results.bindings.reduce((acc, binding) => {
        let predicate = binding.predicate.value.split('/').pop();
        if (predicate === '22-rdf-syntax-ns#type') {
            predicate = 'type';
        }
        if (!acc[predicate]) {
            acc[predicate] = [];
        }
        acc[predicate].push(binding.object.value);
        return acc;
    }, {});
    return { title: nodeId, relationships };
};

export const findCreatedItems = async (nodeId) => {
    if (nodeId === "Unknown") {
        return;
    }
    const query = `
        PREFIX ex: <http://example.org/>
        PREFIX schema: <http://schema.org/>

        SELECT ?object
        WHERE { 
            ?object schema:creator ${nodeId} 
        }
    `;
    const data = await fetchQuery(query);
    const objects = data.results.bindings.map(binding => binding.object.value);
    return objects;
};

export const fetchRandomPersonNode = async (blackList) => {

    let query = `
        PREFIX ex: <http://example.org/>
        PREFIX schema: <http://schema.org/>

        SELECT ?subject
        WHERE {
            ?subject a schema:Person
        }
        LIMIT 1
    `;

    let data = await fetchQuery(query);
    let personNode = data.results.bindings[0]?.subject.value.replace('http://example.org/', 'ex:');
    let numberOfTries = 0;
    while (blackList.includes(personNode)) {
        query = `
            PREFIX ex: <http://example.org/>
            PREFIX schema: <http://schema.org/>

            SELECT ?subject
            WHERE {
                ?subject a schema:Person
            }
            LIMIT 1
            OFFSET ${numberOfTries}
        `;
        data = await fetchQuery(query);
        personNode = data.results.bindings[0]?.subject.value.replace('http://example.org/', 'ex:');
        numberOfTries++;
    }
    personNode = personNode.replace('ex:', 'http://example.org/');
    return personNode;
}