import { ApiEndpoint } from '@/api/endpoints'
import type { WebSocketMessage } from '@/types'

/**
 * The message listener type.
 */
type MessageListener = (msg: WebSocketMessage) => void

/**
 * The web socket service.
 */
class WebSocketService {
  private postWebSockets: Map<string, WebSocket> = new Map()
  private commentWebSockets: Map<string, WebSocket> = new Map()

  /**
   * Connects to the post web socket.
   * @param postId - The post ID.
   * @param onMessage - The message listener.
   * @returns The web socket.
   */
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

  /**
   * Disconnects from the post web socket.
   * @param postId - The post ID.
   */
  disconnectPostWebSocket(postId: string) {
    const webSocket = this.postWebSockets.get(postId)
    if (webSocket) {
      webSocket.close()
      this.postWebSockets.delete(postId)
    }
  }

  /**
   * Connects to the comment web socket.
   * @param commentId - The comment ID.
   * @param onMessage - The message listener.
   * @returns The web socket.
   */
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

  /**
   * Disconnects from the comment web socket.
   * @param postId - The post ID.
   */
  disconnectCommentWebSocket(postId: string) {
    const webSocket = this.commentWebSockets.get(postId)
    if (webSocket) {
      webSocket.close()
      this.commentWebSockets.delete(postId)
    }
  }
}

export const WebSocketServiceInstance = new WebSocketService()
