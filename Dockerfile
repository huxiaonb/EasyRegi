#FROM easyRegister-server-dependency:latest
FROM node:6.11.0

MAINTAINER "Mace Fu"

WORKDIR /home/EasyRegi

COPY . /home/EasyRegi

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
#RUN cnpm install -g gulp && cnpm install --quiet
RUN cd mobile && cnpm install --quiet && cd .. && cnpm install -g gulp && cnpm install -g bower && cnpm install --quiet

EXPOSE 80 465 3000

CMD ["gulp","dev"]
#ENTRYPOINT ["npm run dev"]   
