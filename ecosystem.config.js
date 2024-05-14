module.exports = {
    apps: [
        {
            name: 'job-recommendation',
            script: 'ts-node',
            args: 'src/index.ts',
            watch: true,
            ignore_watch: ['node_modules'],
            instances: 1,
            autorestart: true,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};
