import { ApiEndpoint } from '@/api/endpoints'

export enum WebSocketMessageType {
  NEW_COMMENT,
}

interface WebSocketMessage {
  type: WebSocketMessageType
}

type MessageListener = (type: WebSocketMessageType) => void

class WebSocketService {
  private webSockets: Map<string, WebSocket> = new Map()

  connectWebSocket(postId: string, onMessage: MessageListener) {
    if (this.webSockets.has(postId)) {
      return this.webSockets.get(postId)
    }

    const webSocket = new WebSocket(
      `${import.meta.env.VITE_API_WS_BASE_URL}${ApiEndpoint.BASE_WEB_SOCKET}?postId=${postId}`,
    )

    webSocket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data as string)
        onMessage(message.type)
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
