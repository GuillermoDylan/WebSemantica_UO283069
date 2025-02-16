export const personNode = {
    wrapper: {
        vocab: "http://schema.org/",
        typeof: "Person",
    },

    property: {
        name: "schema:name",
        gender: "foaf:gender",
        age: "foaf:age",
        parent: "schema:parent",
        sibling: "schema:sibling",
        children: "schema:children",
        characterRole: "uo:characterRole",
        employmentUnit: "schema:employmentUnit",
        follows: "schema:follows",
    }
}

export const organizationNode = {

    wrapper: {
        vocab: "http://schema.org",
        typeof: "Organization",
    },
    property: {
        name: "name",
        location: "location",
        founder: "founder",
    }

}

export const itemNode = {

    property: {
        name: "schema:name",
        comment: "rdf:comment",
        significantLink: "rdf:significantLink",
        image: "schema:image",
        version: "uop:version",
        programmingLanguage: "uop:programmingLanguage",
    }

}

export const locationNode = {
    wrapper: {
        vocab: "http://schema.org",
        typeof: "City",
    },
    property: {
        label: "rdf:label",
        alternateName: "rdf:alternateName",
        containedInPlace: "schema:containedInPlace",
        latitude: "geo:latitude",
        longitude: "geo:longitude",
    }
}

export const prefixNode = "uo: http://uniovi.es/miw/uo283069/entity/ uop: http://uniovi.es/miw/uo283069/property/ schema: http://schema.org/ foaf: http://xmlns.com/foaf/0.1/ rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns# geo: http://www.w3.org/2003/01/geo/wgs84_pos# xsd: http://www.w3.org/2001/XMLSchema#";