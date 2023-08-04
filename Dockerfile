# Use an official Node.js image as the base image
FROM node:18

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that your application listens on (if applicable)
EXPOSE 8000

# Command to run your application
CMD ["npm", "start"]
