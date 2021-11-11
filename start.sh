#! /bin/sh

# if [ -f .env ]
# then
#   export $(cat .env | sed 's/#.*//g' | xargs)
# fi

# CAMERA_TIMEOUT="${CAMERA_TIMEOUT:-10}"

# echo $(CAMERA_TIMEOUT)

echo '   ______                                   _____       _ __      '
echo '  / ____/___ _____ ___  ___  _________ _   / ___/____  (_) /_____ '
echo ' / /   / __ `/ __ `__ \/ _ \/ ___/ __ `/   \__ \/ __ \/ / //_/ _ \'
echo '/ /___/ /_/ / / / / / /  __/ /  / /_/ /   ___/ / /_/ / / ,< /  __/'
echo '\____/\__,_/_/ /_/ /_/\___/_/   \__,_/   /____/ .___/_/_/|_|\___/ '
echo '                                             /_/                  '
echo ''
echo ''

echo '> Starting Web Server'
# docker-compose up -d

echo "> Capturing Frames (every 5s)"
echo ''
while :
do
    mkdir -p $(pwd)/images/$(date +"%Y/%m/%d")
    
    export IMAGE_PATH=$(pwd)/images/$(date +"%Y/%m/%d")/frame-$(date +"%H-%M-%S").jpg
    raspistill -t 1 -o $(pwd)/images/$(date +"%Y/%m/%d")/frame-$(date +"%H-%M-%S").jpg
    echo $IMAGE_PATH

    sleep 5
done
