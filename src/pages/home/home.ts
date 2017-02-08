import { Component } from '@angular/core';
import { Platform, AlertController, Events } from 'ionic-angular';
import { GoogleMap, GoogleMapsMarkerOptions, GoogleMapsLatLng, GoogleMapsEvent, GoogleMapsMarkerIcon, TextToSpeech, Splashscreen } from 'ionic-native';
import { LocationService } from '../../providers/location-service';
import { Utils } from '../../providers/utils';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	tracking: boolean;
  map: GoogleMap;
	myLocation = {
		latitude: 0,
		longitude: 0,
		address: 'unknown',
		updateTime: 0
	};
  locations: any = [];
	loader: any;
	totalDistance = 0;
  markerIconSelf: GoogleMapsMarkerIcon = {
    url: './assets/img/map-marker.png',
    size: {
      width: 30,
      height: 40
    }
  };
  voiceOptions = {
    text: 'You are at, ',
    locale: 'en-US',
    rate: 1
  };
  mapLoaded: boolean = false;
  voiceAlerts:boolean = true;

  constructor(
  	public platform: Platform,
  	public alertCtrl: AlertController,
    public events: Events,
  	public locationService: LocationService,
  	public utils: Utils) {
    this.platform.ready().then(() => {
      this.events.subscribe('location:started',() => {
        console.log('Location tracking started');
        this.tracking = true;
      });
      this.voiceOptions.locale = navigator.language;
      this.loader = this.utils.getLoading('Loading map...', 50000);
      this.loader.present();
      this.events.subscribe('location:updated',(location) => {
        console.log('Location tracking started');
        this.myLocation.latitude = location.latitude;
        this.myLocation.longitude = location.longitude;
        this.locationService.getLocationName(location.latitude, location.longitude).then(address => {
          console.log('address:', address);
          this.myLocation.address = address;
        }).catch(err => {
          console.log('err:',err);
          this.myLocation.address = 'unknown';
        });
        this.locations.push(location);
        this.showMap(this.myLocation.latitude, this.myLocation.longitude);
      });
  	});
  }

  showMap(lattitude, longitude) {
    console.log('map', this.map);
    Splashscreen.hide();     
    let location = new GoogleMapsLatLng(lattitude, longitude);
    this.createMap(location);
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      console.log('Map is ready!');
      
      // create new marker
      let markerOptions: GoogleMapsMarkerOptions = {
        position: location,
        draggable: false,
        icon: this.markerIconSelf
      };
      console.log('marker options',markerOptions);
      this.addMarkerSelf(markerOptions);
      this.loader.dismiss(); 
    });
  }

  createMap(location) {
    this.map = new GoogleMap('map', {
      'backgroundColor': 'white',
      'controls': {
        'compass': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': false,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': location,
        'tilt': 10,
        'zoom': 11,
        'bearing': 50
      },
    });
  }

  addMarkerSelf(markerOptions) {
    console.log('In addMarkerSelf()');
    this.map.addMarker(markerOptions).then( (marker) => {
      marker.showInfoWindow();
      this.alertLocationOverVoice(this.myLocation.address);
      this.handleMarkerClick(marker);
    }).catch( (err) => {
      console.log('failed to show marker',err);
    });
  }

  handleMarkerClick(marker) {
    marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe( data => {
      marker.showInfoWindow();
    });
  }

  startTracking() {
    this.locationService.startTracking();
  }

  stopTracking() {
    console.log('In stopTracking');
    this.locationService.stopTracking().then(data => {
      let toast = this.utils.getToast('Stopped location tracking.', 4000);
      toast.present();
      this.tracking = false;
      this.map.clear();
    }).catch(err => {
      let toast = this.utils.getToast('Failed to stop location tracking.', 4000);
      toast.present();
    });
  }

  calculateDistance() {
    let d = 0;
    // this.locationService.getAllLocations().then(data => {

    // }).catch(err => {
    //   console.log('err in locations:', err);
    // })
    for(let i = 0; i < this.locations.length - 1; i++) {
      // console.log(this.locations[i]);
      d += this.locationService.calculateDistanceBetweenPoints(this.locations[i].latitude,this.locations[i].longitude, this.locations[i+1].latitude,this.locations[i+1].longitude);
      console.log('distance:',d);
    }
    let toast = this.utils.getToast('You have travelled '+d.toFixed(4)+' km.', 5000);
    toast.present();
  }

  alertLocationOverVoice(address) {
    if(this.voiceAlerts) {
      if(this.platform.is('ios')) {
        this.voiceOptions.text = 'Location updated, '+address;
        this.voiceOptions.rate = 1.5;
      } else if(this.platform.is('android')) {
        this.voiceOptions.text = 'Location updated, '+address;
        this.voiceOptions.rate = 0.95;
      }
      
      TextToSpeech.speak(this.voiceOptions).then(() => {
        console.log('Spoken '+this.voiceOptions.text+'With locale '+this.voiceOptions.locale);
      }).catch(err => {
        console.log('err in speak location', err);
      });
    } else {
      console.log('No voie alerts');
    }
  }

  stopVoiceAlerts() {
    this.voiceAlerts = false;
  }

  startVoiceAlerts() {
    this.voiceAlerts = true;
  }
}
