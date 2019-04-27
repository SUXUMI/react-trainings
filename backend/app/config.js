// configuration
const config = {
    app: {
        title: `Blog API`,
        port: 4004,
        graphqlPath: '/my-graphql',
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'vobi-task-blog',
    },
    token: {
        secret: 'someSecretCode',
        issuer: 'vobi-test-blog',
        audience: 'vobi',
    },
};

module.exports = config;