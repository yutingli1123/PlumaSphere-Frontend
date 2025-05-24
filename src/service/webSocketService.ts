import { ApiEndpoint } from '@/api/endpoints'
import type { WebSocketMessage } from '@/types'

type MessageListener = (msg: WebSocketMessage) => void

class WebSocketService {
  private postWebSockets: Map<string, WebSocket> = new Map()
  private commentWebSockets: Map<string, WebSocket> = new Map()

  connectPostWebSocket(postId: string, onMessage: MessageListener) {
    if (this.postWebSockets.has(postId)) {
      return this.postWebSockets.get(postId)
    }

    const webSocket = new WebSocket(
      `${import.meta.env.VITE_API_BASE_URL}${ApiEndpoint.BASE_WEB_SOCKET}?postId=${postId}`,
    )

    webSocket.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        onMessage(message)
      } catch (error) {
        console.error(`WS: ${error}`)
      }
    }

    webSocket.onclose = () => {
      this.postWebSockets.delete(postId)
    }

    this.postWebSockets.set(postId, webSocket)
    return webSocket
  }

  disconnectPostWebSocket(postId: string) {
    const webSocket = this.postWebSockets.get(postId)
    if (webSocket) {
      webSocket.close()
      this.postWebSockets.delete(postId)
    }
  }

  connectCommentWebSocket(commentId: string, onMessage: MessageListener) {
    if (this.commentWebSockets.has(commentId)) {
      return this.commentWebSockets.get(commentId)
    }

    const webSocket = new WebSocket(
      `${import.meta.env.VITE_API_BASE_URL}${ApiEndpoint.BASE_WEB_SOCKET}?commentId=${commentId}`,
    )

    webSocket.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        onMessage(message)
      } catch (error) {
        console.error(`WS: ${error}`)
      }
    }

    webSocket.onclose = () => {
      this.commentWebSockets.delete(commentId)
    }

    this.commentWebSockets.set(commentId, webSocket)
    return webSocket
  }

  disconnectCommentWebSocket(postId: string) {
    const webSocket = this.commentWebSockets.get(postId)
    if (webSocket) {
      webSocket.close()
      this.commentWebSockets.delete(postId)
    }
  }
}

export const WebSocketServiceInstance = new WebSocketService()
