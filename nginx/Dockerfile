FROM nginx:alpine

# Copy the build output from the build stage to the Nginx HTML folder
COPY ./frontend/build /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]