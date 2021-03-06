<p align="center">
    <img src="https://github.com/anthonybudd/camera-spike/raw/master/docs/img/header.png" alt="Header">
</p>

Camera Spike is a basic self-hosted security camera project for the Raspberry Pi. A web UI is proxied over Tor using [anthonybudd/nginx-tor-proxy](https://github.com/anthonybudd/nginx-tor-proxy), this allows you to remotely monitor the feed without needing to register the device with a 3rd-party or without disclosing your IP address or the IP address of the Camera Spike. CLI tools are provided so you can easily create a custom Onion v3 address using [cathugger/mkp224o](https://github.com/cathugger/mkp224o).

Created By [Anthony C. Budd](https://github.com/anthonybudd)


<p align="center">
    <img src="https://github.com/anthonybudd/Camera-Spike/raw/master/docs/img/screenshot.png?v=2" width="500" alt="screenshot">
</p>

The web UI is just [a single .html file](https://github.com/anthonybudd/Camera-Spike/blob/master/src/ui/index.html) with only two local dependencies Vue.js and Axios. This simplicity and minimalism is by design, allowing the user to easily audit the code. Currently there is only basic auth implemented on the route to request the frames for a specific day, the endpoints for returning the actual image data and the HTML for the web UI are not secured. I will address this in a later version, however the onion address does provide some _secuirity by obscurity_.


## Set-up
It is recommended that you use a fresh installation of Raspberry Pi OS. You will need to manually enable the camera by clicking on `Main Menu -> Preferences -> Raspberry Pi Configuration -> Interfaces`

```sh
git clone https://github.com/anthonybudd/Camera-Spike.git
cd Camera-Spike
./install.sh # Installs docker, docker-compose and clones anthonybudd/nginx-tor-proxy
cp .env.example .env
sudo crontab -e # @reboot bash /home/pi/Camera-Spike/start.sh

# Set USERNAME and PASSWORD
sed -ie 's#USERNAME=.*#USERNAME="'u$(openssl rand -hex 5)'"#g' .env
sed -ie 's#PASSWORD=.*#PASSWORD="'$(openssl rand -hex 15)'"#g' .env
cat .env | grep 'USERNAME\|PASSWORD' # This is your username and password

# Create Onion Address
docker-compose build
docker run -ti --entrypoint="mkp224o" -v $(pwd):/tor camera-spike_nginx-tor-proxy -n 1 -S 10 -d /tor ^cs
sudo mv *.onion nginx-tor-proxy/web
sudo chown -R $USER nginx-tor-proxy
sed -ie 's#example-app#'"camera-spike"'#g' nginx-tor-proxy/nginx/tor.conf
sed -ie 's#xxxxx.onion#'"$(cat nginx-tor-proxy/web/hostname)"'#g' nginx-tor-proxy/nginx/tor.conf
sudo chown -R root nginx-tor-proxy
sudo chmod 700 nginx-tor-proxy/web
cat nginx-tor-proxy/web/hostname # This is the onion address of the Camera Spike

./start.sh
```

You will see that the command to create an onion address has `^cs` at the end. This argument is used to create a vanity onion address, this will create an onion address that starts with `cs` so the full onion address will look like `csw6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd.onion`. See [this](https://github.com/cathugger/mkp224o/blob/74a13ae5c0ecd26c5bca8ea35edb00a649719ff2/main.c#L400) for more info on the [mkp224o](https://github.com/cathugger/mkp224o) arguments.

## Hardware
<p align="center">
    <img src="https://github.com/anthonybudd/camera-spike/raw/master/docs/img/pi-with-camera.png" width="300" alt="Pi with camera">
</p>

- [Raspberry Pi 3](https://www.amazon.com/CanaKit-Raspberry-Complete-Starter-Kit/dp/B01C6Q2GSY/) or [4](https://www.amazon.com/CanaKit-Raspberry-4GB-Starter-Kit/dp/B07V5JTMV9) (I'm using a Pi 3)
- [Raspberry Pi Camera Module](https://www.amazon.com/dp/B07M9Q43MX)
- [128GB USB Flash Drive](https://www.amazon.com/dp/B07BPG9YX9) (optional)


### USB Storage
By default Camera Spike will save all frames to `./images` you can change this by modifying the `MEDIA_PATH` variable in the .env file. However I recommend that you use USB storage. 

To auto-mount a USB flash drive to a specific path run the following commands.
```
sudo apt-get install -y exfat-fuse ntfs-3g
sudo lsblk -o UUID,NAME,FSTYPE,SIZE,MOUNTPOINT,LABEL,MODEL

sudo nano /etc/fstab # Add line "UUID=XXXX-XXXX /mnt/camera-spike-usb exfat defaults,uid=1000,gid=1000 0 0"

nano .env # Edit "MEDIA_PATH=/mnt/camera-spike-usb"
```


## ToDo
- Auth For Images
- Auto Refresh
- Add count to header