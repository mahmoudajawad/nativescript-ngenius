import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const REALM = 'ni'; // add your realm
const OUTLET_ID = ''; // add your outletId
const API_KEY = ''; // add your api key
const IDENTITY_API_URL = 'https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token';
const GATEWAY_API_URL = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${OUTLET_ID}/orders`;

@Injectable({ providedIn: 'root' })
export class NativescriptNgeniusService {
	constructor(private httpClient: HttpClient) {}

	createToken(): Observable<{ access_token: string }> {
		return this.httpClient.post<{ access_token: string }>(IDENTITY_API_URL, null, {
			headers: {
				Accept: 'application/vnd.ni-identity.v1+json',
				'Content-Type': 'application/vnd.ni-identity.v1+json',
				Authorization: `Basic ${API_KEY}`
			}
		});
	}

	createOrder(accessToken: string, amount: number): Observable<unknown> {
		return this.httpClient.post(
			GATEWAY_API_URL,
			{
				action: 'SALE',
				amount: {
					currencyCode: 'AED',
					value: amount
				}
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/vnd.ni-payment.v2+json',
					Accept: 'application/vnd.ni-payment.v2+json'
				}
			}
		);
	}
}
