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
								// Payment authorisation. Is this even required?
								// console.log('payment:apple_pay', order._embedded.payment[0]._links['payment:apple_pay']);
								// this.apis
								// 	.createPaymentToken(order)
								// 	.pipe(
								// 		tap(paymentToken => {
								// 			console.log('order payment token', paymentToken);
								// 		})
								// 	)
								// 	.subscribe();

								// Payment through Network SDK
								try {
									ngenius
										.initiateApplePay(order, {
											merchantIdentifier: 'merchant.iklix.fullstopsweex',
											countryCode: 'AE',
											currencyCode: 'AED',
											amount: 2000
										} as PKPaymentRequest & { amount: number })
										.pipe(
											tap(status => {
												console.log('initiateApplePay', { status });
											}),
											catchError(err => {
												console.log('initiateApplePay.error', { err });
												return of(err);
											})
										)
										.subscribe();
								} catch (error) {
									console.error({ error });
								}
							})
						)
						.subscribe();
				})
			)
			.subscribe();
		// ngenius.initiateCardPayment();
	}
}
