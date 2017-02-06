import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from 'ionic-angular';
/*
  Generated class for the Utils provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Utils {
	constructor(
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController ) {

	}
	getToast(msg, duration) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: duration
		});
		return toast;
	}

	getLoading(msg, duration) {
		let loader = this.loadingCtrl.create({
			content: msg,
			duration: duration
		});
		return loader;
	}

	getAlert(title, msg, button) {
		let alert = this.alertCtrl.create({
			title: title,
			message: msg,
			buttons: [button]
		});
		return alert;
	}
}
