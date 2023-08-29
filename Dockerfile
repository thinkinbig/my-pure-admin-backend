# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install pm2

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000 for the server to listen on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]