import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
   providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(), // Fornece as animações do Angular Material
    provideHttpClient()  // Fornece o HttpClient para toda a aplicação
  ]
};
