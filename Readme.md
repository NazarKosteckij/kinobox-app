
**KinoBox application v1.0.0**
------------------------------

*Nightly branch*

This branch added for public testing of application.
The application could be blocked from our servers! Also app can be updated with if user will confirm update. 
Update linc could be changed!

example of remote data
{"version":"1b","apk":"http://nazar.webhop.me/kinobox-app/nightly/kinobox.apk"}

Pre-requirements:
----------------
 - Java
 - Android SDK > 23.x.x level
 - NodeJs
 - Ionic  1.2.x
 - Apache Cordova
 - Gulp
 - Git

## Setup the project ##

 1. **Clone this repository** 
> $ git clone  [https://github.com/NazarKosteckij/kinobox-app.git](https://github.com/NazarKosteckij/kinobox-app.git)

 2. **Add platforms** ([more info](http://ionicframework.com/getting-started/))
>  $ ionic platform add android 

 3. **Build and run **
 
	----------
  Run on device:
 >  ionic build android 
 >  ionic run android

	----------
	Run in browser:
>ionic serve

## Tips ##
For debugging on device and google chrome devTolls: 

 1. Install ADB ([info](http://developer.android.com/intl/ru/tools/help/adb.html)).
 2. Allow remote debugging on your device.  ([how to](http://developer.android.com/intl/ru/tools/help/adb.html)).
 3. Run application on the device 
 4. Configure device in your google chrome ([google chrome](chrome://inspect/#devices)) 
 
> $ ionic run android  -l -s -c

 - [--livereload|-l] .......  Live Reload app dev files from the device
   (beta)
   
 - [--consolelogs|-c] ......  Print app console logs to Ionic CLI
   (live reload req.)
 - [--serverlogs|-s] .......  Print dev server logs
   to Ionic CLI (live reload req.)
 - [--port|-p] .............  Dev server
   HTTP port (8100 default, live reload req.)
 - [--livereload-port|-i] .. 
   Live Reload port (35729 default, live reload req.)
 - [--debug|--release]
