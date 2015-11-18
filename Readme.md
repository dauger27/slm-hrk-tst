# Evilopoly
an implementation of the Evilopoly rules using Slim, Angular and Bootstrap

## Setting up the front-end dev environment...
This should work for both mac and windows... so no complaining. This presumes that you have git installed on your manchine and that you have pulled down the repo.

#### Step 1: Install node
the front end dev tools use nodejs, much in the same way that the back end stuff uses composer. There is no node in the actual app, it's just there to run tasks and install dependencies.
You can get download Nodejs [here](https://nodejs.org/en/download/).

once installed, you will be able to access NPM (Node Package Manger) from your terminal/command line.

#### Step 2: Install Grunt and the dev tools 
Now that you have NPM installed, navigate to your repo in the command line then run the command `npm install`. This will create a folder called node_modules that contain all of your dev tools. You're ready to write.

### Using the Dev tools
The app uses concatenated javascript and compiled CSS. This allows us to separate the javascript, css and html templates into sensible components. The dev tools concatenate all of js files in /main and compiles the less files in /main into css. The resulting files are put in the dist folder for use in the app. The app will only used these compiled files, so any changes made to these files must be compiled. 

#### grunt
running `grunt` from the commnad line will compile all of the less and concatenate all of the js in the app. 

#### grunt concat
running `grunt concat` will just concatenate all of the js files in /main into /dist/app.js

#### grunt less
running `grunt less` will just concatenate all of the less files in /main into /dist/app.css

#### grunt watch
running `grunt watch` will set grunt to automatically compile the files as soon as you save a change in them. good for rapid development. 

## API

### `/login`
*header:* header `"stuff"` with the pattern username:password.
*returns:* authtoken

### `/createacct`
*header* none required.
*post body* json `{"email_address":string,"password":string,"username":string}`
*returns* void

### `/api/v1/players`
*header:* header `"x-auth-token"` with authorization token.
*returns:* json player list

### `/api/v1/hello/:name`
*header:* header `"x-auth-token"` with authorization token.
*params:* `name`(string) name to be returned
*returns:* json with `{"name":}`

## Auth token format
`{"username":"username",token":"base64 encoded string"}`