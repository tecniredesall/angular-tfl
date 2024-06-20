FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN apk add --update nodejs nodejs-npm
RUN npm install
RUN npm install @angular/cli@"<7.0.0"
RUN node_modules/.bin/ng build
RUN rm -rf /usr/share/nginx/html/*
RUN cp -ar dist/web-v3/* /usr/share/nginx/html
RUN chmod -R 777 /usr/share/nginx/html/
#CMD [ "/bin/sh", "-c",  "nginx && npm start" ]