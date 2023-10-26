###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS development

# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat
# Create app folder
WORKDIR /app

# Set to dev environment
ENV NODE_ENV development

## Create non-root user for Docker
#RUN addgroup --system --gid 1001 node
#RUN adduser --system --uid 1001 node

# Copy source code into app folder
COPY . .

# Install dependencies
RUN yarn --frozen-lockfile

# Set Docker as a non-root user
#USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS build

WORKDIR /app
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production

## Re-create non-root user for Docker
#RUN addgroup --system --gid 1001 node
#RUN adduser --system --uid 1001 node

# In order to run `yarn build` we need access to the Nest CLI.
# Nest CLI is a dev dependency.
COPY --from=development /app/node_modules ./node_modules
# Copy source code
COPY . .

# Generate the production build. The build script runs "nest build" to compile the application.
RUN yarn build

# Install only the production dependencies and clean cache to optimize image size.
RUN yarn --frozen-lockfile --production && yarn cache clean

## Set Docker as a non-root user
#USER node

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

WORKDIR /app
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production

## Re-create non-root user for Docker
#RUN addgroup --system --gid 1001 node
#RUN adduser --system --uid 1001 node

# Copy only the necessary files
COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules

## Set Docker as non-root user
#USER node

CMD ["node", "dist/main.js"]