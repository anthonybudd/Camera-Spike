#! /bin/sh

echo "   ______                                   _____       _ __      "
echo "  / ____/___ _____ ___  ___  _________ _   / ___/____  (_) /_____ "
echo ' / /   / __ `/ __ `__ \/ _ \/ ___/ __ `/   \__ \/ __ \/ / //_/ _ \'
echo "/ /___/ /_/ / / / / / /  __/ /  / /_/ /   ___/ / /_/ / / ,< /  __/"
echo "\____/\__,_/_/ /_/ /_/\___/_/   \__,_/   /____/ .___/_/_/|_|\___/ "
echo "                                             /_/                  "
echo ""
echo ""


# Update
sudo apt-get -y upgrade
sudo apt-get -y update

# Docker
curl -sSL https://get.docker.com | sh

# Docker Compose
sudo apt-get install -y libffi-dev libssl-dev python3 python3-pip
sudo apt-get remove -y python-configparser
sudo pip3 install docker-compose
sudo chmod a+x /usr/local/bin/docker-compose

# Auto-start Docker
sudo systemctl enable docker

# nginx-tor-proxy tweaks
git clone https://github.com/anthonybudd/nginx-tor-proxy.git

# Permissions
sudo usermod -aG docker $USER
sudo chown $USER /var/run/docker.sock