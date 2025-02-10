export const personNode = {
    wrapper: {
        vocab: "http://schema.org",
        typeof: "Person",
    },
    property: {
        name: "name",
        gender: "gender",
        age: "age",
        parent: "parent",
        sibling: "sibling",
        characterRole: "characterRole",
        employmentUnit: "employmentUnit",
        follows: "follows",
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

    wrapper: {
        vocab: "http://schema.org",
        typeof: "CreativeWork",
    },
    property: {
        name: "name",
        comment: "comment",
        significantLink: "significantLink",
    }

}