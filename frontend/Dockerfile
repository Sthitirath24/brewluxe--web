FROM nginx:alpine

# Copy the single-page frontend (coffee.html) to nginx html root
COPY coffee.html /usr/share/nginx/html/index.html

# Copy any static assets if present (images etc.) — optional
# COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
