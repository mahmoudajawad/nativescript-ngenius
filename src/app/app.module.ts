import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptHttpClientModule, NativeScriptModule } from '@nativescript/angular';
import { NativeScriptApplePayModule } from '@nativescript/apple-pay/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
	bootstrap: [AppComponent],
	imports: [NativeScriptModule, NativeScriptHttpClientModule, AppRoutingModule, NativeScriptApplePayModule],
	declarations: [AppComponent, HomeComponent],
	providers: [],
	schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
