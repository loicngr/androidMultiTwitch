import { Component } from '@angular/core';
import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  intentShim: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events: Events,
    public translate: TranslateService,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.storage.get('language').then((val) => {
        this.translate.addLangs(['en', 'fr', 'ja', 'pt', 'ru', 'zh']);
        const result = (val || 'en');
        this.storage.set('language', result);
        this.translate.setDefaultLang(result);
        this.translate.use(result.match(/en|fr|ja|pt|ru|zh/) ? result : 'en');
      });

      ( window as any ).plugins.intentShim.onIntent(( intent: any ) => {
        const params = this.getUrlParams(intent.data);
        this.events.publish('intentUrl', params);
      });

    });
  }

  getUrlParams( url: any, prop: any = null ) {
    const params = {};
    const search = decodeURIComponent( url.slice( url.indexOf( '?' ) + 1 ) );
    const definitions = search.split( '&' );

    definitions.forEach(( val, key ) => {
      const parts = val.split( '=', 2 );
      params[ parts[ 0 ] ] = parts[ 1 ];
    });

    return ( prop && prop in params ) ? params[ prop ] : params;
  }
}
