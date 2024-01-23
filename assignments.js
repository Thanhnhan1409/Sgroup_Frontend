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

function nhanEffect(effect) {
  currentEffect = effect;
  effect();
  currentEffect = null;
}

function ref(value) {
  return new YouTubeChannel(value);
}

function computed(getter) {
  let value;
  const effect = () => {
    value = getter();
  };
  nhanEffect(effect);
  return {
    get value() {
      return value;
    }
  };
}

const channel = ref('nhan cutee');

const computedChannelLength = computed(() => {
  console.log('heheheh  ');
  return channel.value;
});

nhanEffect(() => {
  console.log('Channel:', channel.value);
});

channel.value = 'New Channel';
channel.value = 'New Channel 22';