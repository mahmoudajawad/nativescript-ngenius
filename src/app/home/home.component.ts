import { Component } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { NativescriptNgeniusService } from '../apis.service';
import { NativescriptNgenius } from '../ngenius';

const ngenius = new NativescriptNgenius();

@Component({
	selector: 'ns-home',
	templateUrl: 'home.component.html'
})
export class HomeComponent {
	constructor(private apis: NativescriptNgeniusService) {}

	onApplePayTap() {
		this.apis
			.createToken()
			.pipe(
				tap(({ access_token }) => {
					this.apis
						.createOrder(access_token, 2000)
						.pipe(
							tap((order: any) => {
								console.log('order payment link:', order._links.payment.href);
								// uncomment to pay through web browser:
								// Utils.openUrl(order._links.payment.href);

								// Payment through Network SDK
								ngenius
									.initiateCardPayment(order)
									.pipe(
										tap(status => {
											console.log('initiateCardPayment', { status });
										}),
										catchError(err => {
											console.log('initiateCardPayment.error', { err });
											return of(err);
										})
									)
									.subscribe();
							})
						)
						.subscribe();
				})
			)
			.subscribe();
		// ngenius.initiateCardPayment();
	}
}
