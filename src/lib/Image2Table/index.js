import { createPromise } from '$lib/Promise.js';

export class Image2Table {
  static #UID = 0;
  static getUID() {
    if(Image2Table.#UID > 999999) {
      Image2Table.#UID = 1;
    }

    Image2Table.#UID++;

    return Image2Table.#UID;
  }

	#worker = new Worker(new URL('./worker.js', import.meta.url));
	#callbacks = {};

	constructor() {
		this.#worker.addEventListener('message', this.#onMessageHandler);
	}

	async process(image, size = 64) {
    const id = Image2Table.getUID();
		const promise = createPromise();
    this.#callbacks[id] = promise.resolve;
		this.#worker.postMessage({id, image, size});

		return promise;
	}

	#onMessageHandler = this.#onMessage.bind(this);
	#onMessage(event) {
    if (!event.data.id) {
    	console.warn('Recieved message without id.');
      return;
    }

    if(!this.#callbacks[event.data.id]) {
    	console.warn(`Couldn't find callback for id: ${event.data.id}.`);
    	return;
    }

    // Resolve promise
    this.#callbacks[event.data.id](event.data);
    delete this.#callbacks[event.data.id];
	}
}
