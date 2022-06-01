#!/bin/bash
nginx_line=`netstat -anput | grep nginx | wc -l`
if [ "$nginx_line" -eq 0 ]
then
  nginx || ! echo "nginx not exists or not in PATH" || exit
fi

rm -rf /home/woody/front/dist/
p_dir='/home/woody/front/zains-test-web'
if [[ ! -d "p_dir" ]]
then
  cd /home/woody/front/
  git clone -b dev git@github.com:woody3/zains-test-web.git
  cd ./zains-test-web/
else
  cd /home/woody/front/zains-test-web/
  git pull origin dev
fi

npm run build
mv ./dist ../dist && echo "publish success"
