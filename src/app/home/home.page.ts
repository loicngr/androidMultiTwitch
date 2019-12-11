import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { PopoverController, Events, AlertController, ToastController  } from '@ionic/angular';

import { SettingComponent } from '../setting/setting.component';
import { PresetuserComponent } from '../presetuser/presetuser.component';
import { ThemeService } from '../theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public inputStreamer: string;
  public streamers: any = [];

  constructor(
    public alertController: AlertController,
    public events: Events,
    public popoverController: PopoverController,
    private storage: Storage,
    private router: Router,
    private theme: ThemeService,
    public toastController: ToastController,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    setTimeout(function () {
      document.getElementById('refreshIntentUrl').click()
    }, 1000);
    this.storage.get('language').then((val) => {
      const result = (val || 'en');
      this.storage.set('language', result);
      this.translate.use(result.match(/en|fr|ja|pt|ru|zh/) ? result : 'en');
    });
    this.storage.get('firstStart').then((val) => {
      const result = (val || false);
      if (!result) {
        this.storage.set('firstStart', true);
        this.presentAlert();
      }
    });
    this.events.subscribe('language', ( lang: any ) => {
      this.setLanguage(lang);
    });
    this.events.subscribe('intentUrl', ( params: any ) => {
      this.uploadIntentUrl(params);
    });
    this.events.subscribe('setPreset', ( preset: any ) => {
      this.syncStreamerWithPreset(preset);
    });
    this.events.subscribe('openUrlStreamers', async ( preset: any ) => {
      this.storage.get(preset).then(async (val) => {
        const result = (val || false);
        if (result !== false) {
          let STREAMERS = [];
          for await (let streamer of result) {
            await STREAMERS.push(streamer)
          }
          this.shareStreamers(STREAMERS);
        }
      });
    });
  }

  async uploadIntentUrl( params: any = {users: ''} ) {
    params.users = params.users.trim();
    if (params.users.slice(-1) === '+') { params.users = params.users.slice(0, -1); }

    const users = params.users.split('+');
    this.inputStreamer = '';
    this.streamers = [];
    for await (const streamer of users) {
      this.inputStreamer = await streamer;
      await this.addStreamer();
    }
    document.getElementById('btnAddStreamer').click();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Information',
      message: `
       Welcome !
       To connect your Twitch account or change language, click on the "settings" icon at the top right.
       Please, follow me on Twitter for get last updates : @Zaekof
      `,
      buttons: ['OK']
    });
    await alert.present();
  }
  addStreamer() {
    if (typeof (this.inputStreamer) !== typeof (undefined) && this.inputStreamer.length >= 1) {
      this.streamers.push({id: this.streamers.length, pseudo: this.inputStreamer});
      this.inputStreamer = '';
    }
  }
  async shareStreamers( USERS: any = null ) {
    let TRANSLATE_HOME: any = '';
    this.translate.get('home').subscribe(res => {
      TRANSLATE_HOME = res;
    });
    const strStreamer = this.streamers.map(streamer => streamer.pseudo);
    const users = (USERS !== null) ? USERS.join('+') : strStreamer.join('+');
    const links = `https://multitwitch.app/?users=${users}`;
    const MESSAGE = `${TRANSLATE_HOME.popOverMessageOne} <a href="${links}" id="link">${links}</a>.<br /><br />
    ${TRANSLATE_HOME.popOverMessageTwo} <a href="https://multitwitch.app/shortener" id="link">https://multitwitch.app/shortener</a>.`;
    const alert = await this.alertController.create({
      header: TRANSLATE_HOME.popOverLinkCopyText,
      message: MESSAGE,
      buttons: [
        {
          text: TRANSLATE_HOME.popOverLinkCancelbtn,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: TRANSLATE_HOME.popOverLinkCopybtn,
          handler: async () => {
            const copyElement = document.createElement('textarea');
            copyElement.style.position = 'fixed';
            copyElement.style.opacity = '0';
            copyElement.textContent = links;
            copyElement.value = links;
            copyElement.setAttribute('contenteditable', 'true');
            document.body.appendChild(copyElement);
            copyElement.focus();
            copyElement.select();
            try {
              document.execCommand('selectAll');
              document.execCommand('copy');
              const toast = await this.toastController.create({
                message: TRANSLATE_HOME.popOverLinkSuccesTxt,
                duration: 3000
              });
              toast.present();
              return true;
            } catch (error) {
              console.log(error);
              return false;
            } finally {
              document.body.removeChild(copyElement);
            }
          }
        }
      ]
    });
    await alert.present();
  }
  syncStreamerWithPreset( preset: string ) {
    this.streamers = [];
    this.storage.get(preset).then(async (val) => {
      const result = (val || false);
      if (result !== false) {
        for await (const streamer of result) {
          this.inputStreamer = await streamer;
          await this.addStreamer();
        }
      }
    });
  }
  removeStreamer( id: number ) {
    if (typeof (id) !== typeof (undefined)) {
      if (this.streamers.length <= 1) {
        this.streamers.pop();
      } else {
        for (let index = 0; index < this.streamers.length; index += 1) {
          if (this.streamers[index].id === id) {
            this.streamers.splice(index, 1);
          }
        }
      }
    }
  }
  goPageStreams() {
    let streamersStr = '';
    for (const item of this.streamers) {
      streamersStr = streamersStr.concat(item.pseudo + ',');
    }
    const navigationExtras: NavigationExtras = {
      queryParams : {
        special: streamersStr
      }
    };
    this.router.navigate(['streams'], navigationExtras);
  }
  setLanguage(lang) {
    this.storage.set('language', lang);
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }
  openSettings() {
    const ev = new Events();
    this.settingsPopover(ev);
  }
  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
        component: SettingComponent,
        event: ev,
        animated: true,
        showBackdrop: true
    });
    return await popover.present();
  }
  goPresetuser() {
    const ev = new Events();
    this.PresetUser(ev);
  }
  async PresetUser(ev: any) {
    const data = await this.streamers;
    const popover = await this.popoverController.create({
        component: PresetuserComponent,
        componentProps: {data},
        event: ev,
        animated: true,
        showBackdrop: true
    });
    return await popover.present();
  }
}
