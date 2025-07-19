import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  MessageDeleted,
  MessagePosted,
  TipReceived
} from "../generated/Contract/Contract"

export function createMessageDeletedEvent(
  id: BigInt,
  timestamp: BigInt
): MessageDeleted {
  let messageDeletedEvent = changetype<MessageDeleted>(newMockEvent())

  messageDeletedEvent.parameters = new Array()

  messageDeletedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  messageDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return messageDeletedEvent
}

export function createMessagePostedEvent(
  sender: Address,
  textCid: string,
  timestamp: BigInt
): MessagePosted {
  let messagePostedEvent = changetype<MessagePosted>(newMockEvent())

  messagePostedEvent.parameters = new Array()

  messagePostedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  messagePostedEvent.parameters.push(
    new ethereum.EventParam("textCid", ethereum.Value.fromString(textCid))
  )
  messagePostedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return messagePostedEvent
}

export function createTipReceivedEvent(
  sender: Address,
  amount: BigInt
): TipReceived {
  let tipReceivedEvent = changetype<TipReceived>(newMockEvent())

  tipReceivedEvent.parameters = new Array()

  tipReceivedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  tipReceivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tipReceivedEvent
}
