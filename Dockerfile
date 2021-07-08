## multistaged image 
FROM node:15 as build
# prepare
RUN apt update && apt -y install vim 
WORKDIR /opt/app
COPY ./package.json /opt/app/package.json
COPY ./tsconfig.json /opt/app/tsconfig.json
RUN npm install @contentful/forma-36-react-components@3.43.1 
RUN npm --production install
# source files
COPY ./public /opt/app/public
COPY ./src /opt/app/src
# create the production build
RUN yarn react-scripts build

# production image
FROM nginx
COPY --from=build /opt/app/build /usr/share/nginx/html
