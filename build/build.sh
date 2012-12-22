#!/bin/bash

# get the current working project directory
SOURCE="${BASH_SOURCE[0]}";
while [ -h "$SOURCE" ] ; do SOURCE="$(readlink "$SOURCE")"; done
build="$( cd -P "$( dirname "$SOURCE" )" && pwd )";
yui="$build/yuicompressor-2.4.7.jar";
src="$build/../";
# run yuicompressor on js
java -jar "$yui" "$src/dev/js/jquery.slippy.js" -o "$src/release/jquery.slippy.min.js";