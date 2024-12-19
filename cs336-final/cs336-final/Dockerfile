# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose Next.js default port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
