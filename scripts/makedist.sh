#!/bin/sh
set +x

DIRECTORY=`pwd`

mkdir -p /tmp/dist
cp -r $DIRECTORY/build/* /tmp/dist/
cd /tmp/dist
mkdir -p $DIRECTORY/dist
zip -r $DIRECTORY/dist/lizard-management-client.zip .
cd /
rm -r /tmp/dist
ls -l $DIRECTORY/dist/lizard-management-client.zip