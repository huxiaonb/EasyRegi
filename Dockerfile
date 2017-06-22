#FROM easyRegister-server-dependency:latest
FROM node:4.8.3

MAINTAINER "Mace Fu"

WORKDIR /home/easyRegister

COPY . /home/easyRegister

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
#RUN cnpm install -g gulp && cnpm install --quiet
RUN cnpm install -g gulp && cnpm install -g bower && cnpm install --quiet && bower install --allow-root

EXPOSE 80 3000

#CMD ["npm","start"]
ENTRYPOINT ["gulp"]   
