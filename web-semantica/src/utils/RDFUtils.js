const prefixes = {
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
    'owl': 'http://www.w3.org/2002/07/owl#',
    'xsd': 'http://www.w3.org/2001/XMLSchema#',
    'ex': 'http://example.org/',
    'schema': 'http://schema.org/',
    'wd': 'http://www.wikidata.org/entity/',
    'wdt': 'http://www.wikidata.org/prop/direct/',
    'uo': 'http://uniovi.es/miw/uo283069/entity/',
    'uop': 'http://uniovi.es/miw/uo283069/property/'
};

const urls = {
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#': 'rdf',
    'http://www.w3.org/2000/01/rdf-schema#': 'rdfs',
    'http://www.w3.org/2002/07/owl#': 'owl',
    'http://www.w3.org/2001/XMLSchema#': 'xsd',
    'http://example.org/': 'ex',
    'http://schema.org/': 'schema',
    'http://www.wikidata.org/entity/': 'wd',
    'http://www.wikidata.org/prop/direct/': 'wdt',
    'http://uniovi.es/miw/uo283069/entity/': 'uo',
    'http://uniovi.es/miw/uo283069/property/': 'uop'
};

export const prefixResolver = (prefix) => {
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
        PREFIX uo: <http://uniovi.es/miw/uo283069/entity/>
        prefix uop: <http://uniovi.es/miw/uo283069/property/>
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
        PREFIX uo: <http://uniovi.es/miw/uo283069/entity/>
        prefix uop: <http://uniovi.es/miw/uo283069/property/>
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
        PREFIX uo: <http://uniovi.es/miw/uo283069/entity/>
        prefix uop: <http://uniovi.es/miw/uo283069/property/>
        PREFIX schema: <http://schema.org/>

        SELECT ?subject
        WHERE {
            ?subject a schema:Person
        }
        LIMIT 1
    `;

    let data = await fetchQuery(query);
    let personNode = data.results.bindings[0]?.subject.value.replace('http://uniovi.es/miw/uo283069/entity/', 'uo:');
    let numberOfTries = 0;
    while (blackList.includes(personNode)) {
        query = `
            PREFIX uo: <http://uniovi.es/miw/uo283069/entity/>
            prefix uop: <http://uniovi.es/miw/uo283069/property/>
            PREFIX schema: <http://schema.org/>

            SELECT ?subject
            WHERE {
                ?subject a schema:Person
                FILTER(ISURI(?subject))
            }
            LIMIT 1
            OFFSET ${numberOfTries}
        `;
        data = await fetchQuery(query);
        personNode = data.results.bindings[0]?.subject.value.replace('http://uniovi.es/miw/uo283069/entity/', 'uo:');
        numberOfTries++;
        if(numberOfTries > 20) {
            return undefined;
        }
    }
    if(personNode != undefined)
        personNode = personNode.replace('uo:', 'http://uniovi.es/miw/uo283069/entity/');
    return personNode;
}

export const searchNode = async (node) => {
    const query = `
        PREFIX uo: <http://uniovi.es/miw/uo283069/entity/>
        prefix uop: <http://uniovi.es/miw/uo283069/property/>
        PREFIX schema: <http://schema.org/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dbpedia: <http://dbpedia.org/resource/>
        PREFIX wd: <http://www.wikidata.org/entity/>
        SELECT DISTINCT ?name ?subject
        WHERE {
            VALUES ?type { 
                uo:ComputerCode 
                schema:WebPage 
                dbpedia:Electrical_device 
                dbpedia:Computer
                dbpedia:Operating_system 
                schema:Product 
                wd:Q15836568 
                schema:Person
                schema:Organization
            }
            VALUES ?property { schema:name rdfs:label }
            ?subject ?property ?name .
            FILTER (regex(str(?subject), "${node}", "i"))
        }
    `;
    const data = await fetchQuery(query);
    let res = data.results.bindings.map(binding => ({
        label: binding.name?.value || null,
        uri: binding.subject?.value || null
    }));
    return res;
}

export const fetchFederatedNode = async (nodeId) => {

    const query = `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX wd: <http://www.wikidata.org/entity/>
        PREFIX wdt: <http://www.wikidata.org/prop/direct/>
        PREFIX schema: <http://schema.org/>
        
        SELECT ?label ?description
        WHERE {
            ${nodeId} rdfs:label ?label .
            ${nodeId} schema:description ?description .
            FILTER (lang(?label) = "en" && lang(?description) = "en")
        }
    `;

    const url = 'https://query.wikidata.org/sparql';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    });

    const data = await response.json();
    const relationships = data.results.bindings.reduce((acc, binding) => {
        for(let key in binding) {
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(binding[key].value);
        }
        return acc;
    }, {});
    return  { nodeId, relationships };

}