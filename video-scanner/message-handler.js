class MessageHandler {
    /* Very simple asynchronous message handler.

    Call registerReceiver to add a recipient.
    Recipients must have a receiveMessage() function.

    Senders can call addMessage to send a message.
    If the recipient doesn't exist the message is dropped.
    */

    constructor() {
        this.buffer = [];
        this.recipients = {}

        this.checkForMessagesInterval = setInterval(() => this.checkForMessages(), 1000/60);
    }

    registerRecipient(name, receiver) {
        this.recipients[name] = receiver;
    }

    addMessage(recipientName, message) {
        // Add this message to the buffer.

        /* message is an object
        command: string containing the command or request.
        meta: object containing extra information
         */

        this.buffer.push({
            recipient: recipientName,
            message: message,
        });
    }

    async checkForMessages() {
        // If no messages, return
        if (this.buffer.length === 0) {
            return;
        }

        // Pop the top message
        const top = this.buffer.shift();

        // If the recipient exists pass the message
        const recipients = Object.keys(this.recipients);
        if (recipients.includes(top.recipient)) {
            await this.recipients[top.recipient].receiveMessage(top.message);
        }
    }
}
