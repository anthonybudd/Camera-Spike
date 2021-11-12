<p align="center">
    <img src="https://github.com/anthonybudd/camera-spike/raw/master/docs/img/header.png" alt="Header">
</p>

Camera Spike is a very basic self-hosted security camera project for the Raspberry Pi. A web UI is proxied over Tor over to using [anthonybudd/nginx-tor-proxy](https://github.com/anthonybudd/nginx-tor-proxy), this allows you to remotely monitor the feed without needing to register the device with a 3rd-party or without disclosing your IP address or the IP address of the Camera Spike. CLI tools are provided so you can easily create a custom Onion v3 Address using [cathugger/mkp224o](https://github.com/cathugger/mkp224o).

Created By [Anthony C. Budd](https://github.com/anthonybudd)


<p align="center">
    <img src="https://github.com/anthonybudd/Camera-Spike/raw/master/docs/img/screenshot.png?v=2" width="500" alt="screenshot">
</p>


## Set-up
```sh
git clone git@github.com:anthonybudd/Camera-Spike.git
cd Camera-Spike
./install.sh
cp .env.example .env

# Create Onion Address
docker run -ti --entrypoint="mkp224o" -v $(pwd):/tor nginx-tor-proxy_nginx-tor-proxy -n 1 -S 10 -d /tor ^cs 
mv *.onion web
chmod 700 web
sed -ie 's#xxxxx.onion#'"$(cat web/hostname)"'#g' nginx/tor.conf
cat web/hostname

./start.sh
```

## Hardware
<p align="center">
    <img src="https://github.com/anthonybudd/camera-spike/raw/master/docs/img/pi-with-camera.png" width="300" alt="Pi with camera">
</p>

- [Raspberry Pi 3](https://www.amazon.com/CanaKit-Raspberry-Complete-Starter-Kit/dp/B01C6Q2GSY/) or [4](https://www.amazon.com/CanaKit-Raspberry-4GB-Starter-Kit/dp/B07V5JTMV9) (I'm using a Pi 3)
- [Raspberry Pi Camera Module](https://www.amazon.com/dp/B07M9Q43MX)
- [128GB USB Flash Drive](https://www.amazon.com/dp/B07BPG9YX9) (optional)


### USB Storage
By default Camera Spike will save all frames to `/home/pi/Camera-Spike` you can change this by modifying the `MEDIA_PATH` variable in the .env file. However I recommend that you use USB storage. 

To auto-mount a USB flash drive to a specific path run the following commands.
```
sudo apt-get install -y exfat-fuse ntfs-3g
sudo lsblk -o UUID,NAME,FSTYPE,SIZE,MOUNTPOINT,LABEL,MODEL

nano /etc/fstab
# Add: "UUID=XXXX-XXXX /mnt/camera-spike-usb exfat defaults,uid=1000,gid=1000 0 0"

nano .env
# Edit: "MEDIA_PATH=/mnt/camera-spike-usb"
```


## ToDo
- Auth For Images