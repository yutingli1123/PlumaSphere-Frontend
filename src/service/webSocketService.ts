import { ApiEndpoint } from '@/api/endpoints'
import type { WebSocketMessage } from '@/types'

type MessageListener = (msg: WebSocketMessage) => void

class WebSocketService {
  private webSockets: Map<string, WebSocket> = new Map()

  connectWebSocket(postId: string, onMessage: MessageListener) {
    if (this.webSockets.has(postId)) {
      return this.webSockets.get(postId)
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
