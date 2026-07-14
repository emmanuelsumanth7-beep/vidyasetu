module.exports = {
  apps: [
    {
      name: 'vidyasetu-backend',
      script: 'npm',
      args: 'start',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'vidyasetu-ai-service',
      script: './venv/bin/python',
      args: 'app.py',
      cwd: './ai-service',
      interpreter: 'none',
      env: {
        FLASK_ENV: 'production',
        PORT: 5001
      }
    },
    {
      "name": "vidyasetu-frontend",
      "script": "npx",
      "args": "serve out -l 3000",
      "cwd": "./admin-web",
      "env": {
        "NODE_ENV": "production"
      }
    },
    {
      "name": "cloudflare-tunnel",
      "script": "cloudflared",
      "args": "tunnel run vidyasetu",
      "cwd": "./",
      "interpreter": "none"
    }
  ]
};
