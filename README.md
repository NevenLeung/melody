# Melody
A music web application built in angular 1.6

Demo -> [Melody](https://nevenleung.github.io/melody/)

## screen shot
![Home](https://github.com/NevenLeung/melody/blob/master//screen_shot/home.png)
![Song](https://github.com/NevenLeung/melody/blob/master//screen_shot/song-info.jpg)
![About](https://github.com/NevenLeung/melody/blob/master//screen_shot/about.jpg)

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
- The built files will be in `dist` folder.
- Create a folder named `mock-server` under the root path of this project. Put the `db.json` file into `mock-server` folder.
- Make a copy of `dist`, paste it into `mock-server` and rename it `public`  .
- Create two folder in `mock-server/public/`, `images` and `music`.
- Put your own music files into `music` folder and put picture files into `images` folder.
- Update `db.json` to match the filename of your own.
- Install and run `json-server`
```
    npm install json-server -g
    cd mock-server
    json-server --watch db.json 
```    

The `mock-server` structure should be like this. The content in ( ) is the usage of the folder.
```
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
```
    

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

    