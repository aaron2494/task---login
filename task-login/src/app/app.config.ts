import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes,withComponentInputBinding()), provideFirebaseApp(() => initializeApp({"projectId":"crud-login-b82f5","appId":"1:390785268028:web:9101888b3b7fafd5f2c639","storageBucket":"crud-login-b82f5.appspot.com","apiKey":"AIzaSyDzjPyZSK3DGCipWhKkf_ATKKaMX0PYJPU","authDomain":"crud-login-b82f5.firebaseapp.com","messagingSenderId":"390785268028","measurementId":"G-KDE9VZ04HS"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
