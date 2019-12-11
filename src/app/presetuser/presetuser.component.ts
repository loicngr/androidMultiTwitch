import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-presetuser',
  templateUrl: './presetuser.component.html',
  styleUrls: ['./presetuser.component.scss'],
})
export class PresetuserComponent implements OnInit {

  public namePreset: string;
  public allPresets: any = [];
  public data: any;

  constructor(
    private storage: Storage,
    private events: Events,
    public toastController: ToastController,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.storage.get('language').then((val) => {
      const result = (val || 'en');
      this.storage.set('language', result);
      this.translate.use(result.match(/en|fr|ja|pt|ru|zh/) ? result : 'en');
    });
    this.syncPresets();
  }
  syncPresets() {
    this.allPresets = [];
    this.storage.forEach((value , key) => {
      if (key.indexOf('_preset') !== -1) {
        this.allPresets.push(key.substr(7, key.length - 1));
      }
    });
  }
  async presentToast() {
    let LANG_EMPTYUSER: any = '';
    this.translate.get('presetuser.errorEmptyUser').subscribe(res => {
      LANG_EMPTYUSER = res;
    });
    const toast = await this.toastController.create({
      message: LANG_EMPTYUSER,
      duration: 3000
    });
    toast.present();
  }
  addPreset() {
    if (typeof (this.namePreset) !== typeof (undefined)) {
      this.namePreset = this.namePreset.trim();
      const data = [];
      for (const value of this.data) {
        data.push(value.pseudo);
      }

      if (data.length !== 0 ) {
        this.storage.get(this.namePreset).then(async (val) => {
          const result = (val || false);
          const promise = await this.storage.set('_preset' + this.namePreset, data);
          this.syncPresets();
        });
      } else {
        this.presentToast();
      }

    }
  }
  setPreset( id: number ) {
    this.events.publish(`setPreset`, '_preset' + this.allPresets[id]);
  }
  openUrlStreamers( id: number) {
    this.events.publish(`openUrlStreamers`, '_preset' +this.allPresets[id]);
  }
  removePreset( id: number ) {
    this.storage.remove('_preset' + this.allPresets[id]);
    this.allPresets.splice(id, 1);
  }

}
