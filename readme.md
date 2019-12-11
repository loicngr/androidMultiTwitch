## MultiTwitch Android Application With Ionic4

#### To build APK :
    ionic cordova build --release android
#### To emulate APK :
    ionic cordova run android --device --livereload --consolelogs
    or
    ionic cordova emulate android --livereload --consolelogs

#### Folder for translation files :
    src/assets/i18n/en.json = English
    src/assets/i18n/fr.json = French
    src/assets/i18n/ja.json = 
    src/assets/i18n/pt.json = 
    src/assets/i18n/ru.json = 
    src/assets/i18n/zh.json = 

#### For add new translation :
    You need to create new file in src/assets/i18n folder, exemple : fr.json (fr = french)
    And update all this files : (sorry :/)
    Update src/app/app.components.ts file at line 33
    Update src/app/home/home.page.ts at line 38
    Update src/app/about/about.page.ts at line 24
    Update src/app/streams/streams.page.ts at line 82
    Update src/app/presetuser/presetuser.component.ts at line 28

#### Twitch Client ID configuration
    You have to change the client_id varibale in src\app\setting\setting.component.ts file at line 78.
    For exemple, a client_id looks like this : md9f9f4gf885sds19sz73vz