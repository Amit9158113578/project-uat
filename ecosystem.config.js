module.exports = {
    apps: [{
        name: 'promanage-mw',
        script: './app.js',
        watch: true,
        env_staging: {
            "NODE_ENV": 'staging',
            "PORT": 3002
        },
        env_production: {
            "NODE_ENV": 'production',
            "PORT": 3002
        },
    }
    ],
};
