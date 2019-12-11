import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';
import { ThemeService } from '../theme.service';

const themes = {
  autumn: {
    primary: '#F78154',
    secondary: '#4D9078',
    tertiary: '#B4436C',
    light: '#FDE8DF',
    medium: '#FCD0A2',
    dark: '#B89876'
  },
  night: {
    primary: '#8CBA80',
    secondary: '#FCFF6C',
    tertiary: '#7044ff',
    medium: '#BCC2C7',
    dark: '#F7F7FF',
    light: '#495867'
  },
  neon: {
    primary: '#39BFBD',
    secondary: '#4CE0B3',
    tertiary: '#FF5E79',
    light: '#F4EDF2',
    medium: '#B682A5',
    dark: '#34162A'
  },
  default: {
    primary: '#3880ff',
    secondary: '#0cd1e8',
    tertiary: '#7044ff',
    success: '#10dc60',
    warning: '#ffce00',
    danger: '#f04141',
    dark: '#222428',
    medium: '#989aa2',
    light: '#f4f5f8'
  }
};

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {

  public twStatus: string;
  public bgmStatus = 'Enabled';

  constructor(
    private events: Events,
    private storage: Storage,
    private iab: InAppBrowser,
    private theme: ThemeService
    ) {}

  ngOnInit() {
    this.storage.get('twitchStatusLog').then((val) => {
      const result = (val || false);
      if (!result) {
        this.storage.set('twitchStatusLog', true);
        this.twStatus = 'Not connected';
      } else {
        this.twStatus = 'Connected';
      }
    });
  }
  setLanguage( lang: string ): void {
    this.events.publish(`language`, lang);
  }
  oauthTwitch(): void {
    // tslint:disable-next-line: max-line-length
    let client_id = "";
    const browser = this.iab.create(`https://id.twitch.tv/oauth2/authorize?client_id=${client_id}&redirect_uri=http://localhost/callback&response_type=code&scope=chat:edit`, '_self', 'location=yes');
    browser.on('loadstart').subscribe((event) => {
      if ((event.url).indexOf('http://localhost/callback') === 0) {
        browser.close();
        this.twStatus = 'Connected';
      }
    });
  }

  changeTheme( name: string ): void {
    this.theme.setTheme(themes[name]);
  }
}
