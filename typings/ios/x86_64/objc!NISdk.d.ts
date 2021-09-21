
interface ApplePayDelegate {

	didSelectPaymentMethodWithPaymentMethod?(paymentMethod: PKPaymentMethod): PKPaymentRequestPaymentMethodUpdate;

	didSelectShippingContactWithShippingContact?(shippingContact: PKContact): PKPaymentRequestShippingContactUpdate;

	didSelectShippingMethodWithShippingMethod?(shippingMethod: PKShippingMethod): PKPaymentRequestShippingMethodUpdate;
}
declare var ApplePayDelegate: {

	prototype: ApplePayDelegate;
};

declare const enum AuthorizationStatus {

	AuthSuccess = 0,

	AuthFailed = 1
}

interface CardPaymentDelegate {

	authorizationDidBegin?(): void;

	authorizationDidCompleteWith?(status: AuthorizationStatus): void;

	authorizationWillBegin?(): void;

	paymentDidBegin?(): void;

	paymentDidCompleteWith(status: PaymentStatus): void;

	threeDSChallengeDidBegin?(): void;

	threeDSChallengeDidCompleteWith?(status: ThreeDSStatus): void;
}
declare var CardPaymentDelegate: {

	prototype: CardPaymentDelegate;
};

declare class NISdk extends NSObject {

	static alloc(): NISdk; // inherited from NSObject

	static new(): NISdk; // inherited from NSObject

	static readonly sharedInstance: NISdk;

	deviceSupportsApplePay(): boolean;

	initiateApplePayWithApplePayDelegateCardPaymentDelegateOverParentForWith(applePayDelegate: ApplePayDelegate, cardPaymentDelegate: CardPaymentDelegate, parentViewController: UIViewController, order: OrderResponse, applePayRequest: PKPaymentRequest): void;

	setSDKLanguageWithLanguage(language: string): void;

	showCardPaymentViewWithCardPaymentDelegateOverParentFor(cardPaymentDelegate: CardPaymentDelegate, parentViewController: UIViewController, order: OrderResponse): void;
}

declare var NISdkVersionNumber: number;

declare var NISdkVersionString: interop.Reference<number>;

declare class OrderResponse extends NSObject {

	static alloc(): OrderResponse; // inherited from NSObject

	static decodeFromDataError(data: NSData): OrderResponse;

	static new(): OrderResponse; // inherited from NSObject
}

declare const enum PaymentMedium {

	ApplePay = 0,

	Card = 1
}

declare class PaymentMethods extends NSObject {

	static alloc(): PaymentMethods; // inherited from NSObject

	static new(): PaymentMethods; // inherited from NSObject
}

declare class PaymentResponse extends NSObject {

	static alloc(): PaymentResponse; // inherited from NSObject

	static new(): PaymentResponse; // inherited from NSObject
}

declare const enum PaymentStatus {

	PaymentSuccess = 0,

	PaymentFailed = 1,

	PaymentCancelled = 2
}

declare const enum ThreeDSStatus {

	ThreeDSSuccess = 0,

	ThreeDSFailed = 1
}
