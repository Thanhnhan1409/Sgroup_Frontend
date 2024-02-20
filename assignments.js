let currentEffect = null;
class YouTubeChannel {
  subscribers
  _value

  constructor(value) {
    this.subscribers = new Set();
    this._value = value;
  }

  get value() {
    this.subscribe();
    return this._value;
  }

  set value(value) {
    console.log('set: ', value);
    this._value = value;
    this.notify();
  }

  subscribe() {
    if (currentEffect) {
      this.subscribers.add(currentEffect);
    }
  }

  notify() {
    this.subscribers.forEach((subscribe) => {
      subscribe();
    });
  }
}

// function watchEffect(effect) {
//   currentEffect = effect;
//   effect();
//   currentEffect = null;
// }
const channel = ref('nhan cutee');

function ref(value) {
  return new YouTubeChannel(value);
}

function computed(getter) {
  let value;
  const effect = () => {
    value = getter();
  };
  watchEffect(effect);
  return {
    get value() {
      return value;
    }
  };
}


const computedChannel = computed(() => {
  console.log('heheheh  ');
  return channel.value;
});

watchEffect(() => {
  console.log('Channel:', channel.value);
});
channel.value = 'New Channel';
channel.value = 'New Channel 22';

 // computed
 class ComputedRef {
    constructor(fn) {
        /* D */
    }
 }