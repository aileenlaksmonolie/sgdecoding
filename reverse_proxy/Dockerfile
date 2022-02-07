
FROM nginx:1.21.5-alpine

LABEL version="1.0"
LABEL description="sky full of stars"
LABEL maintainer=["htan116@e.ntu.edu.sg"]

RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]