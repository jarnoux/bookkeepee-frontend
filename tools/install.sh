#! /bin/bash
rm -rf **/node_modules
dirs=$(find . -type f -name "package.json" -exec dirname {} \;)

for dir in $dirs;
do
	(cd $dir; echo 'installing package...' $(pwd); npm install)
done
