import {
  MessageDeleted as MessageDeletedEvent,
  MessagePosted as MessagePostedEvent,
  TipReceived as TipReceivedEvent
} from "../generated/Contract/Contract"
import { MessageDeleted, MessagePosted, TipReceived } from "../generated/schema"

export function handleMessageDeleted(event: MessageDeletedEvent): void {
  let entity = new MessageDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMessagePosted(event: MessagePostedEvent): void {
  let entity = new MessagePosted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.textCid = event.params.textCid
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTipReceived(event: TipReceivedEvent): void {
  let entity = new TipReceived(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
