import { Frame, isAndroid, isIOS } from '@nativescript/core';
import { Observable } from 'rxjs';

export class NativescriptNgenius {
	configureSDK(config: { shouldShowOrderAmount?: boolean; language?: string }) {
		if (!config) {
			return;
		}

		// Supported configs for android platform
		if (isAndroid) {
			if ('shouldShowOrderAmount' in config) {
				// [TODO] Translate following to NS-compatible code
				// configureSDK({
				// 	shouldShowOrderAmount: config.shouldShowOrderAmount,
				// });
			}
		}

		// Supported configs on iOS
		if (isIOS) {
			if ('language' in config) {
				NISdk.sharedInstance.setSDKLanguageWithLanguage(config.language);
			}
		}
	}

	initiateCardPayment(order: OrderResponse): Observable<unknown> {
		return new Observable(observer => {
			// Log to confirm view-controller is ready:
			console.log('view-controller:', Frame.topmost().viewController);
			let delegate: CardPaymentDelegate = {
				paymentDidCompleteWith: status => {
					console.log('paymentDidCompleteWith', { status });
					observer.next({ status });
					observer.complete();
					observer.unsubscribe();
				},
				authorizationDidBegin: () => {},
				authorizationWillBegin: () => {},
				paymentDidBegin: () => {},
				threeDSChallengeDidBegin: () => {},
				threeDSChallengeDidCompleteWith: () => {}
			};

			try {
				NISdk.sharedInstance.showCardPaymentViewWithCardPaymentDelegateOverParentFor(delegate, Frame.topmost().viewController, order);
			} catch (error) {
				console.error({ error });
			}
		});
	}

	isSamsungPaySupported() {
		return new Promise((resolve, reject) => {
			if (isAndroid) {
				// Native impl
			} else {
				reject({
					status: 'Not Supported',
					error: 'Samsung pay is not supported in this platform'
				});
			}
		});
	}

	// initiateSamsungPay(order, merchantName, serviceId) {
	// 	return new Promise((resolve, reject) => {
	// 		if (isAndroid) {
	// 			if (!merchantName) {
	// 				reject({ status: 'Error', error: 'Merchant name is not found' });
	// 				return;
	// 			}
	// 			if (!serviceId) {
	// 				reject({ status: 'Error', error: 'ServiceId is not found' });
	// 				return;
	// 			}
	// 			return this.sdk.initiateSamsungPay(order, merchantName, serviceId, (status, errorStr) => {
	// 				switch (status) {
	// 					case 'Success':
	// 						resolve({ status });
	// 						break;
	// 					case 'Failed':
	// 					default:
	// 						reject({ status, error: errorStr });
	// 				}
	// 			});
	// 		} else {
	// 			reject({ status: 'Failed', error: 'Unsupported platform' });
	// 		}
	// 	});
	// }

	// isApplePaySupported = () => {
	// 	return new Promise((resolve, reject) => {
	// 		if (isIOS) {
	// 			// Native impl
	// 			this.sdk.isApplePaySupported((isSupported) => {
	// 				resolve(isSupported);
	// 			});
	// 		} else {
	// 			reject({ status: 'Not Supported', error: 'Apple pay is not supported in this platform' });
	// 		}
	// 	});
	// };

	// initiateApplePay(order, applePayConfig) {
	// 	return new Promise((resolve, reject) => {
	// 		if (isIOS) {
	// 			const _applePayConfig = { ...applePayConfig };
	// 			if (!order) {
	// 				reject({ status: 'Error', error: 'Order not found' });
	// 				return;
	// 			}
	// 			if (!order.amount || !order.amount.value || !order.amount.currencyCode) {
	// 				reject({ status: 'Error', error: 'Order amount is missing' });
	// 				return;
	// 			}
	// 			if (!applePayConfig.merchantIdentifier) {
	// 				reject({ status: 'Error', error: 'Merchant identifier is not found' });
	// 				return;
	// 			}
	// 			if (!applePayConfig.countryCode) {
	// 				reject({ status: 'Error', error: 'Country code is not found' });
	// 				return;
	// 			}
	// 			_applePayConfig.totalAmount = order.amount.value / 100;
	// 			_applePayConfig.currencyCode = order.amount.currencyCode;
	// 			if (!_applePayConfig.merchantName) {
	// 				_applePayConfig.merchantName = 'Total';
	// 			}
	// 			return this.sdk.initiateApplePay(order, _applePayConfig, (status, errorStr) => {
	// 				switch (status) {
	// 					case 'Success':
	// 						resolve({ status });
	// 						break;
	// 					case 'Failed':
	// 					default:
	// 						reject({ status, error: errorStr });
	// 				}
	// 			});
	// 		} else {
	// 			reject({ status: 'Not Supported', error: 'Apple pay is not supported in this platform' });
	// 		}
	// 	});
	// }
}
