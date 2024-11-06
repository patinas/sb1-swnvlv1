# Stremio TMDb Similar Movies Addon

This addon provides movie recommendations using TMDb's API.

## Deployment on Render

1. Fork or clone this repository
2. Go to [render.com](https://render.com) and create a new account if you don't have one
3. Click "New +" and select "Web Service"
4. Connect your GitHub account and select this repository
5. Configure the deployment:
   - Name: stremio-tmdb-addon (or any name you prefer)
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Click "Create Web Service"

The addon will be deployed and available at your Render URL.