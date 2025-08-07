import { Message } from "../generated/schema"
import { MessagePosted } from "../generated/Contract/Contract"

export function handleMessagePosted(event: MessagePosted): void {
    // Create unique ID using transaction hash and log index
    let id = event.transaction.hash.concatI32(event.logIndex.toI32())
    let message = new Message(id)

    message.sender = event.params.sender
    message.cid = event.params.textCid.toString()  // Convert Bytes to string
    message.timestamp = event.block.timestamp  // Using block timestamp
    message.deleted = false  // New messages are not deleted

    message.save()
}
