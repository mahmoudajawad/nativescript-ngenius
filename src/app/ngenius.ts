import { ApplePayMerchantCapability } from '@nativescript/apple-pay/enums.ios';
import { isAndroid, isIOS } from '@nativescript/core';
import { Observable, Subscriber } from 'rxjs';

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

	initiateCardPayment(order: Record<string, unknown>): Observable<unknown> {
		const viewController = UIApplication.sharedApplication.delegate.window.rootViewController;

		const orderData = NSJSONSerialization.dataWithJSONObjectOptionsError(order, NSJSONWritingOptions.WithoutEscapingSlashes);
		const orderResponse = OrderResponse.decodeFromDataError(orderData);

		return new Observable(observer => {
			const cardPaymentDelegate: CardPaymentDelegate = {
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
				NISdk.sharedInstance.showCardPaymentViewWithCardPaymentDelegateOverParentFor(cardPaymentDelegate, viewController, orderResponse);
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

	initiateApplePay(order: Record<string, unknown>, applePayConfig: PKPaymentRequest & { merchantName?: string; amount: number }): Observable<unknown> {
		const viewController = UIApplication.sharedApplication.delegate.window.rootViewController;
		const orderData = NSJSONSerialization.dataWithJSONObjectOptionsError(order, NSJSONWritingOptions.WithoutEscapingSlashes);
		const orderResponse = OrderResponse.decodeFromDataError(orderData);

		const applePayDelegate = new ApplePayDelegateImpl();

		return new Observable(observer => {
			const cardPaymentDelegate = CardPaymentDelegateImpl.initWithObserver(observer);
			try {
				if (isIOS) {
					if (!orderResponse) {
						throw Error('Order not found');
					}
					orderResponse;

					if (!applePayConfig.merchantIdentifier) {
						throw Error('Merchant identifier is not found');
					}
					if (!applePayConfig.countryCode) {
						throw Error('Country code is not found');
					}

					const summaryItem: PKPaymentSummaryItem = PKPaymentSummaryItem.summaryItemWithLabelAmount(applePayConfig.merchantName || 'Total', NSDecimalNumber.alloc().initWithFloat(applePayConfig.amount || 0));

					const summaryItems: NSArray<unknown> = NSArray.alloc()
						.init()
						.arrayByAddingObject(summaryItem);

					const applePayRequest: PKPaymentRequest = PKPaymentRequest.alloc().init();
					applePayRequest.merchantIdentifier = applePayConfig.merchantIdentifier;
					applePayRequest.countryCode = applePayConfig.countryCode;
					applePayRequest.currencyCode = applePayConfig.currencyCode;
					applePayRequest.requiredShippingContactFields = NSSet.alloc().initWithArray([PKContactFieldPostalAddress, PKContactFieldEmailAddress, PKContactFieldPhoneNumber]) as NSSet<string>;
					applePayRequest.merchantCapabilities = ApplePayMerchantCapability.Debit | ApplePayMerchantCapability.Credit | ApplePayMerchantCapability.ThreeDS;
					applePayRequest.requiredBillingContactFields = NSSet.alloc().initWithArray([PKContactFieldPostalAddress, PKContactFieldName]) as NSSet<string>;

					applePayRequest.paymentSummaryItems = summaryItems as NSArray<PKPaymentSummaryItem>;

					NISdk.sharedInstance.initiateApplePayWithApplePayDelegateCardPaymentDelegateOverParentForWith(applePayDelegate, cardPaymentDelegate, viewController, orderResponse, applePayRequest);
				} else {
					throw Error('Apple pay is not supported in this platform');
				}
			} catch (error) {
				observer.error(error);
				observer.unsubscribe();
			}
		});
	}
}

@NativeClass
class ApplePayDelegateImpl implements ApplePayDelegate {
	public static ObjCProtocols = [ApplePayDelegate];
}

@NativeClass
class CardPaymentDelegateImpl extends NSObject implements CardPaymentDelegate {
	public static ObjCProtocols = [CardPaymentDelegate];
	public static initWithObserver(observer: Subscriber<unknown>): CardPaymentDelegateImpl {
		const handler = <CardPaymentDelegateImpl>CardPaymentDelegateImpl.new();
		handler._observer = observer;

		return handler;
	}
	private _observer!: Subscriber<unknown>;

	public paymentDidCompleteWith(status: PaymentStatus) {
		this._observer.next({ status });
		this._observer.complete();
		this._observer.unsubscribe();
	}

	public authorizationDidBegin() {}
	public authorizationWillBegin() {}
	public paymentDidBegin() {}
	public threeDSChallengeDidBegin() {}
	public threeDSChallengeDidCompleteWith() {}
}
