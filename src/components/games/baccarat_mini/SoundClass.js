const soundData = require('@/store/baccarat-mini-sound.json');
import {Howl, Howler} from 'howler';
import _ from 'lodash'
class BaccaratMiniSound {
  
  constructor(data) {
    this.soundData = data
  }

  soundUrl(value){
    let url = '/baccarat-mini/audio/'+ value;

    if(process.env.NODE_ENV !== 'development'){
      url = process.env.VUE_APP_SITE_URL+'/game-data'+url;
    }
    return url;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  audio(key, options){
    let sound_obj = this.soundData;
    let value = sound_obj[key] !== undefined? sound_obj[key]: '';

    if(value === '')
      return false;

    if(typeof options === 'undefined'){
      options = {};
    }

    options = _.merge({
      src: [this.soundUrl(value)]
    }, options);

    this.audioObj = new Howl(options);

    return this.audioObj;
  }

  play(){
    this.audioObj.play();
  }

  pause(){
    this.audioObj.pause();
  }

  mute(){
    this.bg_sound.mute(true);
  }

  unmute(){
    this.bg_sound.mute(false);
  }

  bgSound(){
    let bgSound = this.audio('casino_jazz', {
      autoplay: true,
      loop: true,
    });
    bgSound.play();
    this.bg_sound = bgSound;
  }

  bgSoundPause(){
    this.bg_sound.pause();
  }

  chipBet(){
    this.audio('chips_bet').play();
  }

  dealingCards(){
    this.audio('dealing_cards').play();
    setTimeout(() => {
      this.audio('dealing_cards').play();
    }, 500);
  }
	
  result(list, callback){
    let sound_list = [];
    let sound_obj = this.soundData;

    list.forEach( skey => {
      let value = sound_obj[skey] !== undefined? sound_obj[skey]: '';
      sound_list.push(this.soundUrl(value));
    })
		
    var index = 0;

    const do_callback = _.debounce(function(){
      callback();
    }, 500)

    const play_sound = () => {
      var sounds = new Howl({
        src: [sound_list[index]],
        autoplay: true,
        loop: false,
        onend: _.debounce(function() {
          index++;
          if(index < sound_list.length){
            play_sound();
          }else{
            if(typeof callback === 'function'){
              do_callback();
            }
          }
        }, 200)
      });
  
      sounds.play();
      // sounds.once('load', function(){
      //   sounds.play();
      // });
    }

    play_sound();
  }
}

const baccarat_mini_sound = new BaccaratMiniSound(soundData);
export { baccarat_mini_sound as default };