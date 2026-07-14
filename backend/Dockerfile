FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose the API port
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]
