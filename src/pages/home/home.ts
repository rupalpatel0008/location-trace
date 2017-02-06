import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { LocationService } from '../../providers/location-service';
import { Utils } from '../../providers/utils';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	tracking: boolean = false;
	myLocation = {
		latitude: 0,
		longitude: 0,
		address: '',
		updateTime: 0
	};
	loader: any;
	totalDistance = 0;
	storedTotalDistance = 0;
	myLocations = [];
  timeInMilliSec = 0;
  constructor(
  	public platform: Platform,
  	public alertCtrl: AlertController,
  	public locationService: LocationService,
  	public utils: Utils) {
    this.platform.ready().then(() => {
  		this.loader = this.utils.getLoading('Getting your location...', 10000);
  		this.loader.present();
  		this.getMyLocation();
  	});
  }

  showTrackingOptions() {
  	console.log('In showTrackingOptions');
  	let confirm =  this.alertCtrl.create({
  		title: 'Track Options',
  		subTitle: 'Choose time to update your location.'
  	});
    confirm.addInput({
      type: 'radio',
      label: '10 seconds',
      value: '10000',
      checked: true
    });
  	confirm.addInput({
  		type: 'radio',
  		label: '1 minutes',
  		value: '60000'
  	});
  	confirm.addInput({
  		type: 'radio',
  		label: '5 minutes',
  		value: '300000'
  	});
  	confirm.addInput({
  		type: 'radio',
  		label: '10 minutes',
  		value: '600000'
  	});
  	confirm.addInput({
  		type: 'radio',
  		label: '15 minutes',
  		value: '900000'
  	});
  	confirm.addButton('Cancel');
  	confirm.addButton({
  		text: 'Start',
  		handler: data => {
  			this.tracking = true;
  			this.myLocation.updateTime = data;
  			this.startTracking(data);
  		}
  	});
  	confirm.present();
  }

  startTracking(min) {
  	console.log('In startTracking',min);
    // by default code for foreground
    this.locationService.startTracking();
  }

  stopTracking() {
  	console.log('In stopTracking');
		this.tracking = false;
		this.locationService.stopTracking().then(data => {
			console.log('stopped background location tracking', data);
		}).catch(err => {
			console.log('err in stop background location tracking', err);
		})
    
  }

  getMyLocation() {
  	console.log('In getMyLocation()');
  	this.locationService.getCurrentLocation().then((data:any) => {
			this.myLocation.latitude = data.coords.latitude;
			this.myLocation.longitude = data.coords.longitude;
	  	console.log('In getMyLocation()', this.myLocation.latitude, this.myLocation.longitude);
			this.locationService.getLocationName(this.myLocation.latitude, this.myLocation.longitude).then(address => {
				this.myLocation.address = address;
				this.loader.dismiss();
		  	this.myLocations.push(this.myLocation);
			}).catch(err => {
				this.myLocation.address = 'unknown';
		  	this.myLocations.push(this.myLocation);
  			console.log('Err in getting location name.', err);
				this.loader.dismiss();
			});
		}).catch(err => {
			this.myLocation.latitude = 0;
			this.myLocation.longitude = 0;
			console.log('Err in getting location.', err);
			this.loader.dismiss();
		});
  }

  calculateTotalDistance() {
  	console.log('In calculateTotalDistance');
  	for(let i = 0; i < this.myLocations.length - 1; i++) {
  		this.totalDistance += this.locationService.calculateDistanceBetweenPoints(this.myLocations[i].latitude, this.myLocations[i].longitude, this.myLocations[i + 1].latitude, this.myLocations[i + 1].longitude);
  		console.log('this.totalDistance in loop',this.totalDistance);
  	}
  }

}
