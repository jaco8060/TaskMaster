# Stage 1: Build the application
FROM node:16-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose port for development (optional)
EXPOSE 5000

# Install nodemon globally for development (optional)
RUN npm install -g nodemon

# Stage 2: Create the production image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/ ./

# Expose the port
EXPOSE 5000

# Set environment variables (if any)

# Start the application
CMD ["node", "app.js"]
