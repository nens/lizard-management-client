#!/bin/sh
set +x

DIRECTORY=`pwd`

mkdir -p /tmp/dist
cp -r $DIRECTORY/build/* /tmp/dist/
cd /tmp
mkdir -p $DIRECTORY/dist
zip -r $DIRECTORY/dist/lizard-management-client.zip dist
rm -r /tmp/dist
ls -l $DIRECTORY/dist/lizard-management-client.zip
