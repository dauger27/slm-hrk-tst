apt-get update
apt-get install -y g++
apt-get install -y apache2
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi
apt-get install -y git
apt-get install -y php5-cli
apt-get install -y curl
cd /vagrant
curl -sS https://getcomposer.org/installer | php
curl -sL https://deb.nodesource.com/setup_0.12 | sh
apt-get install -y nodejs
su vagrant
mkdir /home/vagrant/node_modules
cd /vagrant
ln -s /home/vagrant/node_modules/ node_modules
php composer.phar install
npm install -g bower
npm install -g grunt-cli
npm install
bower install