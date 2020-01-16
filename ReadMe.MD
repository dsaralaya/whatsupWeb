WhatAppBot Application

# TECHNOLOGY USED:

Angular 8 -> For User Interface
Node JS -> For Api (Interaction between the UI and Whatsapp API)
Mongo DB -> No Sql Database for storing Users, Menus, Chat History etc

# To build the application locally, the following needs to be installed on your system:

Node (v10.16.0)
npm (v6.9.0)
Angular cli (https://cli.angular.io/)
Mongo DB (Ur IP and default port 27017)

# To Deploy to your server, the following needs to be installed on your server (npm and nodejs):
  # Login Using SSH and follow below steps. (For More Info Visit https://linuxize.com/post/how-to-install-node-js-on-centos-7/)

1. Add NodeSource yum repository 
    => Run the following curl command to add the NodeSource yum repository to your system:
    
    curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -

2. Install Node.js and npm

    sudo yum install nodejs

3. Verify the Node.js and npm Installation
    => To check that the installation was successful, run the following commands which will print the Node.js and npm versions.

    node --version (It should print  v10.16.0. If not please follow step 4).

    npm --version (It should print v6.9.0. If not please follow step 4).

4. Install NVM (Node Version Manager) # (In case Your node version is different)

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

    => Close and reopen your terminal to start using nvm or run the following to use it now:

        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    
    => To check if installed run
        
        nvm --version (It should print a version).
    
    => Install the v10.16.0 version of Nodejs using following command

        nvm install 10.16.0
    
    => To use the downloaded version 

        nvm use 10.16.0
    
    => Now Redo Step 3 and check if u get the above mentioned versions.

5. To be able to build native modules from npm we will need to install the development tools and libraries:

    sudo yum install gcc-c++ make

# To Upload Files (UI and Server)

1. cd into folder opt
    
    cd /opt

    => Create a folder app inside opt folder

        mkdir app
    
    => Upload Client and Server folder inside app folder

2. There are 2 config changes to be done (One in Client Folder and one in Server Folder)

    => Client Side
        Client/src/app/shared/config.ts file

        => In this config.ts file

            export const configuation = {
                serverURL: 'http://165.227.81.65/server/api',
                url: 'http://165.227.81.65/server/'
            };

        =>  Replace http://165.227.81.65 with Your Server Ip

    => Server Side
        Server/src/config/appConfig.ts

        => In this appConfig.ts

            siteURL: 'http://165.227.81.65/server'
        
        => Replace http://165.227.81.65 with Your Server Ip

3. Build The Client and Server Folder

    => Client Code
        cd Client

        => Run `npm install`
        => Run `npm run build` command in the client folder which will create a dist folder
    
    => Server Code
        cd Server
        => Run `npm install`
        => Run `npm run build` command in the server folder which will create a dist folder

# To Run the client in browser we need to install nginx (For more details visit https://www.terlici.com/2015/04/20/hosting-deploying-nodejs-centos.html)

    => First, you will need to install all necessary packages on your server.

        sudo yum install epel-release

    => Nginx

        sudo yum install -y nginx
        sudo systemctl enable nginx
    
        => To run Nginx right now

            sudo systemctl start nginx
        
        => After Every change to client folder/nginx config we need to run

            sudo systemctl restart nginx
    
    => Configure nginx.conf file

        cd into /etc/nginx/nginx.conf

        => The server block should be changed like this

             server {
                listen       80 default_server;
                listen       [::]:80 default_server;
                server_name  _;
                root         /usr/share/nginx/html;
                client_max_body_size 100M;

                # Load configuration files for the default server block.
                include /etc/nginx/default.d/*.conf;

                location / {
	                root /opt/app/whatsupWeb/client/dist/whatsup;
                    index index.html index.htm index.nginx-debian.html;
                    try_files $uri $uri/ /index.html;	
                }

                location /server {
                    rewrite /server/(.*) /$1  break;
                    proxy_pass  http://localhost:3000/;
                }

                location /socket.io {
                    proxy_pass  http://localhost:3000/socket.io/;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection "upgrade";
                    proxy_set_header Host $host;
                }

                error_page 404 /404.html;
                    location = /40x.html {
                }

                error_page 500 502 503 504 /50x.html;
                    location = /50x.html {
                }
            }

        => We need to make only the following changes in the nginx.conf gile

            1) client_max_body_size 100M; # to upload images

            2) location / {
	                root /opt/app/client/dist/whatsup; # Location of client dist folder we created in step 3
                    index index.html index.htm index.nginx-debian.html;
                    try_files $uri $uri/ /index.html;	
                }
            
            3) location /server { # No need to change anything here
                    rewrite /server/(.*) /$1  break; 
                    proxy_pass  http://localhost:3000/;
                }

            4) location /socket.io { # No need to change anything here
                    proxy_pass  http://localhost:3000/socket.io/;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection "upgrade";
                    proxy_set_header Host $host;
                }

        => Run `sudo systemctl restart nginx` and check ur vps ip. You should see whatsapp login page
        => If not
            Run the following commands
                yum install firewalld
                systemctl unmask firewalld
                systemctl enable firewalld
                systemctl start firewalld

                firewall-cmd --add-port=80/tcp
                firewall-cmd --add-port=8000/tcp
                firewall-cmd --add-port=8080/tcp
                firewall-cmd --add-port=3000/tcp
                firewall-cmd --add-port=27017/tcp
        
        => Now try again

# To Run the server in browser we need to install pm2 (For more details visit https://www.tecmint.com/install-pm2-to-run-nodejs-apps-on-linux-server/ or https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-centos-7)

    => Install pm2
         sudo npm i -g pm2 
        
    => start pm2
         sudo pm2 start /opt/app/server/dist/server.js

    => To restart pm2
        sudo pm2 restart server (Use this command if any changes made to server folder and did run `npm run build`)

    => Now access server using Your ip and port 3000
        example 127.0.0.1/server or 127.0.0.1:3000 (Replace 127.0.0.1 with your ip)

    => You should get message hello..connecting

6. Some Server configs to be done

    => Run `setsebool -P httpd_can_network_connect 1`

# Install MongoDB (https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-centos-7)

1. Adding the MongoDB Repository

    sudo vi /etc/yum.repos.d/mongodb-org.repo
    click insert key

    Paste this code in this file

        [mongodb-org-3.4]
        name=MongoDB Repository
        baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.4/x86_64/
        gpgcheck=1
        enabled=1
        gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc
    
    Save using esc then shift + : then wq

2. Install MongoDB

    sudo yum install mongodb-org

3. Start MongoDB

     sudo systemctl start mongod

4. Run below without `

    then `mongod --auth`

    then  `use admin
        db.createUser(
            {
             user: "admin",
             pwd: "password",
             roles: [ { role: "root", db: "admin" } ]
            }
                );
           exit;`
    
    then   `db.auth("admin", "password")
            db.grantRolesToUser("password", [ { role: "readWrite", db: "admin" } ])`

5. cd into /etc/mongod.conf

    The file should look like this (If not make changes as below)

        # mongod.conf

        # for documentation of all options, see:
        #   http://docs.mongodb.org/manual/reference/configuration-options/

        # where to write logging data.
        systemLog:
        destination: file
        logAppend: true
        path: /var/log/mongodb/mongod.log

        # Where and how to store data.
        storage:
        dbPath: /var/lib/mongo
        journal:
            enabled: true
        #  engine:
        #  mmapv1:
        #  wiredTiger:

        # how the process runs
        processManagement:
        fork: true  # fork and run in background
        pidFilePath: /var/run/mongodb/mongod.pid  # location of pidfile

        # network interfaces
        net:
        port: 27017
        bindIp: 127.0.0.1  # Listen to local interface only, comment to listen on all interfaces.


        #security:
        #authorization: enabled
        #operationProfiling:

        #replication:

        #sharding:

        ## Enterprise-Only Options

        #auditLog:

        #snmp:

6. Reload MongoDB

    sudo systemctl reload mongod

# In the https://app.interativachat.com.br/app/users/config url

    => Webhook Destination URL should be 
         http://165.227.81.65/server/api/chat/receive

         Change http://165.227.81.65 to your vps ip

# To Translate Language

    => We need to just use the client folder
    => cd into client/src/app
    => To change Admin Login Languages go into admin folder
        => U will find different pages as folder names
        => Open any folder,open .html file and change the language as needed
        => Example contacts folder then open file contacts.component.html
        => Once changed deploy to client folder
        => Run `npm run build` to build the client(UI)
        => restart nginx
    => To change login/chat-board Pages open them as above and edit and follow the same steps


