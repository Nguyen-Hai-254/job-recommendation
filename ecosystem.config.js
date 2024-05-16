module.exports = {
    apps: [
        {
            name: 'job-recommendation',
            script: 'dist/index.js',
            exec_mode: 'cluster',
            instance_var: 'INSTANCE_ID',
            instances: 4,
            autorestart: true,
            watch: false,
            ignore_watch: ['node_modules'],
            max_memory_restart: '1G',
            env: {
                PORT: 3002,
                NODE_ENV: 'production',
            },
        }
    ]
};
