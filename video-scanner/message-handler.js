class MessageHandler {
    /* Very simple asynchronous message handler.

    Call Subscribe with the object and the channel it will listen to.
    Call Publish when you want to send a message to the channel.
    */

    constructor() {
        this.buffer = [];

        this.subscribersByChannel = {};

        this.checkForMessagesInterval = setInterval(() => this.publishMessagesToSubscribers(), 1000/60);
    }

    subscribe(channel, receiver) {
        this.subscribersByChannel[channel] = this.subscribersByChannel[channel] ?? [];
        this.subscribersByChannel[channel].push(receiver);
    }

    publish(channel, message) {
        // Add this message to the buffer.

        /* message is an object
        command: string containing the command or request.
        meta: object containing extra information
         */

        this.buffer.push({
            channel: channel,
            message: message,
        });
    }

    async publishMessagesToSubscribers() {
        // If no messages, return
        if (this.buffer.length === 0) {
            return;
        }

        // Pop the top message
        const top = this.buffer.shift();

        const subscribers = this.subscribersByChannel[top.channel];

        if (!subscribers) {
            return;
        }

        subscribers.forEach((sub) => {
            sub.receiveMessage(top);
        });
    }
}
