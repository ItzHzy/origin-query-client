const Store = require('electron-store');

// TODO: store creds securely ¯\_(ツ)_/¯

const schema = {
    username: {
        type: 'string',
        default: 'user'
    },
    password: {
        type: 'string',
        default: 'pass'
    },
    serverAddress: {
        type: 'string',
        default: "http://localhost:2129"
    }
}

const config = new Store({ schema: schema });

export default config;