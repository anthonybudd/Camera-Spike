# Camera Spike

<p align="center">
<img src="https://github.com/anthonybudd/camera-spike/raw/master/docs/img/header.png" alt="Header">
</p>

Camera Spike is a simple self-hosted security camera project for the Raspberry Pi. A web UI is provided using Tor so you can remotly monitor the feed.


<p align="center">
    <img src="https://github.com/anthonybudd/camera-spike/raw/master/docs/img/screenshot.png" width="200" alt="Header">
</p>


## Set-up
```sh
git clone git@github.com:anthonybudd/Camera-Spike.git
cd Camera-Spike
./install.sh
./start.sh
```


### Create Onion Address
```sh
cd nginx-tor-proxy
docker-compose build 
docker run -ti --entrypoint="mkp224o" -v $(pwd):/tor nginx-tor-proxy_nginx-tor-proxy -n 1 -S 10 -d /tor ^cs 
mv *.onion web
chmod 700 web
sed -ie 's#xxxxx.onion#'"$(cat web/hostname)"'#g' nginx/tor.conf
sed -ie 's#example-app#'"camera-spike"'#g' nginx/tor.conf
cat web/hostname
```


### Optional: Auto-mount USB Storage
By default CameraSpike will save all frames to the root of the project. However if you want to save the frames to external storage run the commands below to auto-mount the drive to a specific path.
```
sudo apt-get install -y exfat-fuse ntfs-3g
sudo lsblk -o UUID,NAME,FSTYPE,SIZE,MOUNTPOINT,LABEL,MODEL

nano /etc/fstab
# Add: "UUID=XXXX-XXXX /mnt/camera-spike-usb exfat defaults,uid=1000,gid=1000 0 0"

nano .env
# Edit: "MEDIA_PATH=/mnt/camera-spike-usb"
```