/* eslint-disable no-console */
type LocalCacheMessage = {
  id: number;
  key: string;
  value: string;
}

type LocalCacheRequests = {
  [key: string]: 'true'
}

type LocalCacheMessageType = 'post' | 'received';


enum StorageType {
  Requests='requests',
  MessagePost='messagePost',
  MessageReceived='messageReceived',
  Unloaded='unloaded'
}

type StorageNames = {
  [name in StorageType]: string
};



const CHANNEL_PREFIX = 'ef';

export class CacheMessenger {

  /**
   * Messages cache
   */
  private messages = new Map();

  /**
   * List of promise needed be resolved by messaging
   */
  private waiting = new Map();

  /**
   * Channel to send message
   */
  private broadcastChannel: BroadcastChannel;

  private storageNames: StorageNames;

  constructor (name: string) {
    const messengerName = `[${CHANNEL_PREFIX}][${name}]`;
    this.broadcastChannel = new BroadcastChannel(messengerName);
    this.storageNames = {
      messagePost: `${messengerName}[messages-post]`,
      messageReceived: `${messengerName}[messages-received]`,
      requests: `${messengerName}[requests]`,
      unloaded: `${messengerName}[unloaded]`
    };

    this.clean();
    this.listen();
  }

  private get requests (): LocalCacheRequests {
    return (JSON.parse(localStorage.getItem(this.storageNames.requests) as string) || {}) as LocalCacheRequests;
  }

  private set requests (requests: LocalCacheRequests) {
    localStorage.setItem(this.storageNames.requests, JSON.stringify(requests));
  }

  /**
   * Initialize listening messages from BroadcastChannel
   * @returns {void}
   */
  private listen (): void {
    this.broadcastChannel.onmessage = (event: MessageEvent<LocalCacheMessage>) => {
      const { data: { id: messageId, key, value } } = event;

      // Cache all messsages in case this message faster than value registered to waiting list
      if (!this.messages.has(key)) {
        this.messages.set(key, value);
      }

      if (this.waiting.has(event.data.key)) {
        const resolve = this.waiting.get(key) as CallableFunction;
        resolve(value);
        console.log(`${window.name} %c Receive message %c icon ${key.split('/').pop() || ''} MessageID: ${messageId}`, 'background: green; color: white', '');
      }

      // Check the last message
      this.increaseMessageCount('received');

      /**
       * Delay time to clear all states to make sure no new message while checking the last one.
       * Need to find the way to check latest message better than this
       */
      setTimeout(() => {
        const postMessage = this.getMessageCount('post');
        if (messageId === postMessage) {
          console.timeEnd(`${window.name} Completed`);
          this.destroy();
        }
      }, 3000);
    };
    console.log(`${window.name} %c Listened %c ${Date.now().toString()}`, 'background: purple; color: white', '');

  }

  /**
   * Clean up by resets all request states
   * if found unload event which means the current states is not correct
   * because user interupt the cache messaging while requesting
   * @returns {void}
   */
  private clean (): void {

    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      if (localStorage.getItem(this.storageNames.requests) !== null) {
        localStorage.setItem(this.storageNames.unloaded, 'true');
      }
      return true;
    });

    if (localStorage.getItem(this.storageNames.unloaded) === 'true') {
      this.destroy();
      localStorage.removeItem(this.storageNames.unloaded);
      localStorage.setItem(this.storageNames.messagePost, '0');
      localStorage.setItem(this.storageNames.messageReceived, '0');
    }
  }

  /**
   * Destroy all state
   * @returns {void}
   */
  private destroy (): void {
    localStorage.removeItem(this.storageNames.requests);
    localStorage.removeItem(this.storageNames.messagePost);
    localStorage.removeItem(this.storageNames.messageReceived);
    this.messages.clear();
    this.waiting.clear();
  }


  private increaseMessageCount (type: LocalCacheMessageType) {
    let key = '';
    if (type === 'post') {
      key = this.storageNames.messagePost;
    }
    else if (type === 'received') {
      key = this.storageNames.messageReceived;
    }

    const messageCount = localStorage.getItem(key) || 0;
    localStorage.setItem(key, (Number(messageCount) + 1).toString());
  }

  private getMessageCount (type: LocalCacheMessageType) {
    let key = '';
    if (type === 'post') {
      key = this.storageNames.messagePost;
    }
    else if (type === 'received') {
      key = this.storageNames.messageReceived;
    }

    return Number(localStorage.getItem(key) || 0);
  }

  /**
   * Add the first item is start the request to the network
   * @param key item key
   * @return {void}
   */
  public addRequest (key: string): void {
    const requests = this.requests;
    if (!requests[key]) {
      requests[key] = 'true';
      this.requests = requests;
    }
  }

  public hasRequest (key: string): boolean {
    return Boolean(this.requests[key]);
  }

  public getMessage (key: string): string {
    return this.messages.get(key) as string;
  }

  public hasMessage (key: string): boolean {
    return this.messages.has(key);
  }

  /**
   * Add item to waiting list
   * @param key item key
   * @param value callback function
   * @returns {void}
   */
  public wait (key: string, value: CallableFunction): void {
    this.waiting.set(key, value);
  }

  /**
   * Distribute cache
   * @param key item key
   * @param value data to send via message
   * @returns {void}
   */
  public notify (key: string, value: string): void {
    // Use Broadcast Channel send message
    const messageId = this.getMessageCount('post') + 1;
    this.broadcastChannel.postMessage({ id: messageId, key, value });
    console.log(`${window.name} %c Post message %c id: ${messageId} ${key.split('/').pop() || ''}`, 'background: blue; color: white', '');
    this.increaseMessageCount('post');
  }
}
