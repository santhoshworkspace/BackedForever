# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files (except those in .dockerignore)
COPY . .

# Expose port (adjust if needed)
EXPOSE 5000

# Command to run your app
CMD ["node", "server.js"]
