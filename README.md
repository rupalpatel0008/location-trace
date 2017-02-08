This is ionic 2 demo app
	1. ***Change the app scripts in node_modules, if node_modules is installed first time, deleted or reinstalled***
		  copyImages: {
		    src: ['{{SRC}}/assets/img/*'],
		    dest: '{{WWW}}/build/img'
		  }
	2. Google maps
	Generate APi Keys for android and ios on Google console
	version 1.4.0 since latest can not be downloaded from github
	ionic plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="AIzaSyB7mM5Y029hI78L0sZDwNy7AKi6JR2wU7Q" --variable API_KEY_FOR_IOS="AIzaSyBYbqjiQu55yZtNyNvgDRruZFfM_h2gcfU" --save

	Latest release: 
	https://github.com/mapsplugin/cordova-plugin-googlemaps
	
	For remove plugin: 
	ionic plugin remove cordova-plugin-googlemaps
	ionic plugin remove com.googlemaps.ios

	for android, project.properties should be like following
	target=android-24
	android.library.reference.1=CordovaLib
	cordova.system.library.1=com.google.android.gms:play-services-maps:+
	cordova.system.library.2=com.google.android.gms:play-services-location:+
	cordova.gradle.include.1=cordova-plugin-mauron85-background-geolocation/locationtrace-logtofile.gradle
	cordova.system.library.3=com.google.android.gms:play-services-location:+
	cordova.system.library.4=com.android.support:support-v4:+

	Do not forget to put following in scss file of map directive. It should be outside of class page in scss file.
		ion-app._gmaps_cdv_ .nav-decor{
		  background-color: transparent !important;
		}


	For blank map: https://github.com/mapsplugin/cordova-plugin-googlemaps/wiki/TroubleShooting:-Blank-Map

	3.TextToSpeech
	ionic plugin add cordova-plugin-tts --save
	ionic plugin remove cordova-plugin-tts --save