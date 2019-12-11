import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform, LoadingController, Events } from '@ionic/angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { ThemeService } from '../theme.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.page.html',
  styleUrls: ['./streams.page.scss'],
})
export class StreamsPage implements OnInit, AfterViewInit {

  public tmpData: any = [];
  public data: any = [];
  public urls: any = [];
  public urlsChat: any = [];
  public chatView: boolean;
  public orientation: string;
  public hud: boolean;
  public chatViewCurrentId: number;
  public fullscreen: boolean;
  public refreshStatus: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    public events: Events,
    platform: Platform,
    private androidFullScreen: AndroidFullScreen,
    private theme: ThemeService,
    public loadingController: LoadingController,
    private storage: Storage,
    public translate: TranslateService
    ) {
      events.subscribe('language', (lang) => {
        this.setLanguage(lang);
      });
      this.chatView = false;
      this.hud = false;
      this.fullscreen = false;
      this.chatViewCurrentId = 0;
      platform.ready().then(() => {
        this.orientation = screen.orientation.type;
        window.addEventListener('orientationchange', () => {
          this.orientation = screen.orientation.type;
        });
      }).catch((err) => {
        console.log('Error while loading platform', err);
      });
      this.tmpData = this.router.parseUrl(this.router.url).queryParams.special.split(',');
      this.tmpData.pop();
      this.tmpData.forEach((item, i) => {
        const streamer = item.trim();
        if (streamer !== '' && streamer.length !== 0 && streamer !== ',') {
          let tmpUrl: any;
          if (i === 0) {
            tmpUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.twitch.tv/?channel=${streamer}
            &autoplay=true&muted=false`);
          } else {
            tmpUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.twitch.tv/?channel=${streamer}
            &autoplay=true&muted=true`);
          }
          const tmpUrlChat = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.twitch.tv/embed/${streamer}/chat`);
          this.urls.push(tmpUrl);
          this.urlsChat.push(tmpUrlChat);
        }
      });
    }

  ngOnInit() {
    this.data = this.tmpData;
  }
  async ngAfterViewInit() {
    await this.storage.get('language').then(async (val) => {
      const result = (val || 'en');
      await this.storage.set('language', result);
      await this.translate.use(result.match(/en|fr|ja|pt|ru|zh/) ? result : 'en');
    });
    let TRANSLATE: any = await '';
    await this.translate.get('utils.wait').subscribe(async (res) => {
      TRANSLATE = await res;
    });
    await this.presentLoading(TRANSLATE);
  }
  setLanguage(lang) {
    this.storage.set('language', lang);
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }
  async presentLoading( TRANSLATE: any = 'Please wait..' ) {
    const loading = await this.loadingController.create({
      message: TRANSLATE,
      duration: 3500
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  toggleChat() {
    this.chatView = !this.chatView;
  }
  switchChat() {
    const cpt = this.chatViewCurrentId;
    if (cpt < this.data.length - 1) {
      this.chatViewCurrentId += 1;
      this.getChat(this.chatViewCurrentId);
    } else {
      this.chatViewCurrentId = 0;
      this.getChat(this.chatViewCurrentId);
    }
  }
  getChat( id: number ) {
    return this.urlsChat[id];
  }
  hideHUD() {
    this.hud = !this.hud;
  }
  goFullScreen() {
    if (!this.fullscreen) {
      this.androidFullScreen.immersiveMode()
        .then(() => console.log('Immersive mode supported1'))
        .catch(err => console.log(err));
      this.fullscreen = true;
    } else {
      this.androidFullScreen.showSystemUI()
        .then(() => console.log('Immersive mode supported2'))
        .catch(err => console.log(err));
      this.fullscreen = false;
    }
  }
  goCast(): void {
  }
  refreshIframe( index: number ): void {
    const url = this.urls[index];
    this.urls[index] = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.urls[index] = this.sanitizer.bypassSecurityTrustResourceUrl(url.changingThisBreaksApplicationSecurity);
  }
}
