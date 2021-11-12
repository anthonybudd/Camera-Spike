#! /bin/sh

echo "   ______                                   _____       _ __      "
echo "  / ____/___ _____ ___  ___  _________ _   / ___/____  (_) /_____ "
echo ' / /   / __ `/ __ `__ \/ _ \/ ___/ __ `/   \__ \/ __ \/ / //_/ _ \'
echo "/ /___/ /_/ / / / / / /  __/ /  / /_/ /   ___/ / /_/ / / ,< /  __/"
echo "\____/\__,_/_/ /_/ /_/\___/_/   \__,_/   /____/ .___/_/_/|_|\___/ "
echo "                                             /_/                  "
echo ""
echo ""


# # Docker
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# # Docker Compose
sudo apt-get install -y libffi-dev libssl-dev
sudo apt-get install -y python3 python3-pip
sudo apt-get remove python-configparser
sudo pip3 -v install docker-compose

# Auto-start Docker
# systemctl enable /opt/docker-compose/docker-compose.service

# nginx-tor-proxy tweaks
sed -ie 's#example-app#'"camera-spike"'#g' nginx-tor-proxy/nginx/tor.conf 
cd nginx-tor-proxy && docker-compose build
