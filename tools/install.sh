#! /bin/bash
rm -rf **/**/node_modules
dirs=$(find . -type f -name "package.json" -exec dirname {} \;)
echo $dirs

for dir in $dirs;
do
	(cd $dir; pwd; npm install)
done
