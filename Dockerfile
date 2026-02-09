# Use Node.js official image
FROM node:22-bullseye

# Install ffmpeg and yt-dlp
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip && \
    pip3 install yt-dlp && \
    apt-get clean

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --production

# Copy backend code
COPY server.js ./

# Expose port (Render automatically maps PORT env variable)
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
