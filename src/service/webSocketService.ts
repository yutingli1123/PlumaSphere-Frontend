import { ApiEndpoint } from '@/api/endpoints'
import SockJS from 'sockjs-client'

export enum WebSocketMessageType {
  NEW_COMMENT = 'NEW_COMMENT',
}

type MessageListener = (type: WebSocketMessageType) => void

class WebSocketService {
  private webSockets: Map<string, WebSocket> = new Map()

  connectWebSocket(postId: string, onMessage: MessageListener) {
    if (this.webSockets.has(postId)) {
      return this.webSockets.get(postId)
    }

    const webSocket = new SockJS(
      `${import.meta.env.VITE_API_BASE_URL}${ApiEndpoint.BASE_WEB_SOCKET}?postId=${postId}`,
    )

    webSocket.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessageType = event.data
        onMessage(message)
      } catch (error) {
        console.error(`WS: ${error}`)
      }
    }

    webSocket.onclose = () => {
      this.webSockets.delete(postId)
    }

    this.webSockets.set(postId, webSocket)
    return webSocket
  }

  disconnectWebSocket(postId: string) {
    const webSocket = this.webSockets.get(postId)
    if (webSocket) {
      webSocket.close()
      this.webSockets.delete(postId)
    }
  }
}

export const WebSocketServiceInstance = new WebSocketService()
