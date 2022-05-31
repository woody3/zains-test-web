#!/bin/bash
nginx_line=`netstat -anput | grep nginx | wc -l`
if [ "$nginx_line" -eq 0 ]
then
  nginx || ! echo "nginx not exists or not in PATH" || exit
fi

rm -rf /home/test_team/front/dist/
p_dir='/home/test_team/front/za-test-platform-web'
if [[ ! -d "p_dir" ]]
then
  cd /home/test_team/front/
  git clone -b dev ssh://git@172.16.6.108:35000/za-life/za-test-platform-web.git
  cd ./za-test-platform-web/
else
  cd /home/test_team/front/za-test-platform-web/
  git pull origin dev
fi

npm run build
mv ./dist ../dist
