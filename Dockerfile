FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Use either npm or pnpm based on your preference
# For pnpm
RUN npm install -g pnpm && pnpm install

# For npm
# RUN npm install

# Copy app source
COPY . .

# Set environment variables
ENV NODE_ENV=development
# Default port, can be overridden when running the container
ENV PORT=3055
ENV ENVIRONMENT=development

# Expose the port the app runs on
EXPOSE 3055

# Create a non-root user to run the app and change ownership
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Command to run the app
CMD ["npm", "run", "dev"]
