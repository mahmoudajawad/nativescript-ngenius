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
								try {
									ngenius
										.initiateApplePay(order, {
											merchantIdentifier: 'merchant.iklix.fullstopsweex',
											countryCode: 'AE',
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
