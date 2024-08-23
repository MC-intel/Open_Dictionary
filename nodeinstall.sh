sudo apt-get remove --purge nodejs
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm cache clean --force;rm -rf node_modules;npm install