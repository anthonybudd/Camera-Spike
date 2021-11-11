#! /bin/sh

echo '   ______                                   _____       _ __      '
echo '  / ____/___ _____ ___  ___  _________ _   / ___/____  (_) /_____ '
echo ' / /   / __ `/ __ `__ \/ _ \/ ___/ __ `/   \__ \/ __ \/ / //_/ _ \'
echo '/ /___/ /_/ / / / / / /  __/ /  / /_/ /   ___/ / /_/ / / ,< /  __/'
echo '\____/\__,_/_/ /_/ /_/\___/_/   \__,_/   /____/ .___/_/_/|_|\___/ '
echo '                                             /_/                  '
echo ''
echo ''


# Load .env
echo "> Loading .env"
if [ -f .env ]
then
    export $(cat .env | sed 's/#.*//g' | xargs)
fi
export CAMERA_TIMEOUT="${CAMERA_TIMEOUT:-10}" 
export MEDIA_PATH="${MEDIA_PATH:-$(pwd)/images}" 
export IMAGE_HEIGHT="${IMAGE_HEIGHT:-500}" 
export IMAGE_WIDTH="${IMAGE_WIDTH:-500}" 
echo "  ├── CAMERA_TIMEOUT=$CAMERA_TIMEOUT (seconds)"
echo "  ├── IMAGE_HEIGHT=$IMAGE_HEIGHT"
echo "  ├── IMAGE_WIDTH=$IMAGE_WIDTH"
echo "  └── MEDIA_PATH=$MEDIA_PATH"
echo ""


# Start Web UI and Tor
echo "> Starting Web Server"
# docker-compose up -d


# Main loop that captures images
echo "> Capturing Frames"
echo ""
while :
do
    mkdir -p $MEDIA_PATH/$(date +"%Y/%m/%d")
    export IMAGE_PATH=$MEDIA_PATH/$(date +"%Y/%m/%d")/frame-$(date +"%H-%M-%S")--$(date +"%s").jpg
    raspistill -n -t 1 -o $IMAGE_PATH
    echo $IMAGE_PATH
    sleep $CAMERA_TIMEOUT
done
