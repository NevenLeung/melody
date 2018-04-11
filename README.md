# Melody
A music web application built in angular 1.6

demo [Melody](https://nevenleung.github.io/melody/)


## How to build the app
#### clone this repo
    git clone https://github.com/NevenLeung/melody.git
    
#### install the dependency
    bower install
    
#### install dev-dependency
    npm install
    
#### build
    gulp
    
## How to run a mock server   
#### 1. The built files will be in dist folder.
#### 2. Create a folder named mock-server under the root path of this project. Put the db.json file into mock-server folder.
#### 3. Make a copy of dist, paste it into mock-server and rename it public  .
#### 4. Create two folder in mock-server/public/, images and music.
#### 5. Put your own music files into music folder and put picture files into images folder.
The mock-server structure is like this. The content in ( ) is the usage of the folder.

    mock-server    
        |--public (the copy of dist)
            |--(some files of dist)
            |--images
                |--album (store album cover)
                |--artist (store artist photo)
                |--avatar (store avatar for selection)
                |--logo.png  
            |--music (store music files) 
        |--db.json (the mock database)
#### 6. Update db.json to match the filename of your own.
#### 7. Install and run json-server
    npm install json-server -g
    cd mock-server
    json-server --watch db.json 

## Run it with [melody-server](https://github.com/NevenLeung/melody-server)

## Built With
- [AngularJS](https://github.com/angular/angular)  
 - [Bootstrap](https://github.com/twbs/bootstrap) 
 - [ui-bootstrap](https://github.com/angular-ui/bootstrap)  AngularJS directives specific to Bootstrap
 - [ui-router](https://github.com/angular-ui/ui-router)  The de-facto solution to flexible routing with nested views in AngularJS
 - [ngDialog](https://github.com/likeastore/ngDialog) Modals and popups provider for AngularJS
- [Font-Awesome](https://github.com/FortAwesome/Font-Awesome)  The iconic font and CSS framework
- [angular-soundmanager2](https://github.com/perminder-klair/angular-soundmanager2)  A music player made with SoundManager 2 API for AngularJS
- [angular-xeditable](https://github.com/vitalets/angular-xeditable)  Edit in place for AngularJS
- [angular-sortable-view](https://github.com/kamilkp/angular-sortable-view)  Fully declarative (multi)sortable for AngularJS
- [angular-awesome-slider](https://github.com/darul75/angular-awesome-slider)  Angular slider control directive

    
## License
This project is licensed under the MIT License

    