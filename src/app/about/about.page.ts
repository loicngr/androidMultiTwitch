import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(
    public events: Events,
    private storage: Storage,
    public translate: TranslateService
    ) {
    events.subscribe('language', (lang) => {
      this.setLanguage(lang);
    });
    storage.get('language').then((val) => {
      const result = (val || 'en');
      storage.set('language', result);
      translate.use(result.match(/en|fr|ja|pt|ru|zh/) ? result : 'en');
    });
  }

  ngOnInit() {}

  aboutOpen( url: string ) {
    window.open(`${url}`, '_system', 'location=yes');
    return false;
  }
  setLanguage(lang) {
    this.storage.set('language', lang);
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }
}
