import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WebSocketServiceInstance } from '../webSocketService'
import type { WebSocketMessage } from '@/types'
import { WebSocketMessageType } from '@/constant'

// Mock WebSocket
class MockWebSocket {
  public onmessage: ((event: MessageEvent) => void) | null = null
  public onclose: (() => void) | null = null
  public onopen: (() => void) | null = null
  public onerror: ((event: Event) => void) | null = null
  public readyState: number = WebSocket.CONNECTING
  public url: string

  constructor(url: string) {
    this.url = url
    // Simulate connection opening
    setTimeout(() => {
      this.readyState = WebSocket.OPEN
      if (this.onopen) this.onopen()
    }, 0)
  }

  close() {
    this.readyState = WebSocket.CLOSED
    if (this.onclose) this.onclose()
  }

  send(data: string) {
    // Mock implementation
  }

  // Helper method to simulate receiving messages
  simulateMessage(data: string) {
    if (this.onmessage) {
      this.onmessage({ data } as MessageEvent)
    }
  }
}

// Mock global WebSocket
vi.stubGlobal('WebSocket', MockWebSocket)

// Mock console.error
vi.stubGlobal('console', {
  error: vi.fn(),
})

describe('WebSocketService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear any existing connections
    const service = WebSocketServiceInstance as unknown as {
      postWebSockets: Map<string, MockWebSocket>
      commentWebSockets: Map<string, MockWebSocket>
    }
    service.postWebSockets.clear()
    service.commentWebSockets.clear()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('connectPostWebSocket', () => {
    it('should create new WebSocket connection for post', () => {
      // Arrange
      const postId = '123'
      const onMessage = vi.fn()

      // Act
      const ws = WebSocketServiceInstance.connectPostWebSocket(
        postId,
        onMessage,
      ) as unknown as MockWebSocket

      // Assert
      expect(ws).toBeDefined()
      expect((ws as MockWebSocket)?.url).toContain(`?postId=${postId}`)
    })

    it('should return existing WebSocket if already connected', () => {
      // Arrange
      const postId = '123'
      const onMessage = vi.fn()

      // Act
      const ws1 = WebSocketServiceInstance.connectPostWebSocket(
        postId,
        onMessage,
      ) as unknown as MockWebSocket
      const ws2 = WebSocketServiceInstance.connectPostWebSocket(
        postId,
        onMessage,
      ) as unknown as MockWebSocket

      // Assert
      expect(ws1).toBe(ws2)
    })

    it('should handle incoming messages', () => {
      // Arrange
      const postId = '123'
      const onMessage = vi.fn()
      const mockMessage: WebSocketMessage = {
        type: WebSocketMessageType.NEW_COMMENT,
        data: { commentId: 456 },
      }

      // Act
      const ws = WebSocketServiceInstance.connectPostWebSocket(
        postId,
        onMessage,
      ) as unknown as MockWebSocket
      ws.simulateMessage(JSON.stringify(mockMessage))

      // Assert
      expect(onMessage).toHaveBeenCalledWith(mockMessage)
    })

    it('should handle invalid JSON messages', () => {
      // Arrange
      const postId = '123'
      const onMessage = vi.fn()

      // Act
      const ws = WebSocketServiceInstance.connectPostWebSocket(
        postId,
        onMessage,
      ) as unknown as MockWebSocket
      ws.simulateMessage('invalid json')

      // Assert
      expect(onMessage).not.toHaveBeenCalled()
      expect(console.error).toHaveBeenCalled()
    })

    it('should clean up on connection close', () => {
      // Arrange
      const postId = '123'
      const onMessage = vi.fn()

      // Act
      const ws = WebSocketServiceInstance.connectPostWebSocket(
        postId,
        onMessage,
      ) as unknown as MockWebSocket
      ws.close()

      // Assert
      const service = WebSocketServiceInstance as unknown as {
        postWebSockets: Map<string, MockWebSocket>
      }
      expect(service.postWebSockets.has(postId)).toBe(false)
    })
  })

  describe('disconnectPostWebSocket', () => {
    it('should close and remove WebSocket connection', () => {
      // Arrange
      const postId = '123'
      const onMessage = vi.fn()
      const ws = WebSocketServiceInstance.connectPostWebSocket(
        postId,
        onMessage,
      ) as unknown as MockWebSocket
      const closeSpy = vi.spyOn(ws, 'close')

      // Act
      WebSocketServiceInstance.disconnectPostWebSocket(postId)

      // Assert
      expect(closeSpy).toHaveBeenCalled()
      const service = WebSocketServiceInstance as unknown as {
        postWebSockets: Map<string, MockWebSocket>
      }
      expect(service.postWebSockets.has(postId)).toBe(false)
    })

    it('should handle disconnecting non-existing connection', () => {
      // Act & Assert - should not throw
      expect(() => {
        WebSocketServiceInstance.disconnectPostWebSocket('non-existing')
      }).not.toThrow()
    })
  })

  describe('connectCommentWebSocket', () => {
    it('should create new WebSocket connection for comment', () => {
      // Arrange
      const commentId = '456'
      const onMessage = vi.fn()

      // Act
      const ws = WebSocketServiceInstance.connectCommentWebSocket(
        commentId,
        onMessage,
      ) as unknown as MockWebSocket

      // Assert
      expect(ws).toBeDefined()
      expect((ws as MockWebSocket)?.url).toContain(`?commentId=${commentId}`)
    })

    it('should return existing WebSocket if already connected', () => {
      // Arrange
      const commentId = '456'
      const onMessage = vi.fn()

      // Act
      const ws1 = WebSocketServiceInstance.connectCommentWebSocket(
        commentId,
        onMessage,
      ) as unknown as MockWebSocket
      const ws2 = WebSocketServiceInstance.connectCommentWebSocket(
        commentId,
        onMessage,
      ) as unknown as MockWebSocket

      // Assert
      expect(ws1).toBe(ws2)
    })

    it('should handle incoming messages', () => {
      // Arrange
      const commentId = '456'
      const onMessage = vi.fn()
      const mockMessage: WebSocketMessage = {
        type: WebSocketMessageType.LIKE_COMMENT,
        data: { likeCount: 5 },
      }

      // Act
      const ws = WebSocketServiceInstance.connectCommentWebSocket(
        commentId,
        onMessage,
      ) as unknown as MockWebSocket
      ws.simulateMessage(JSON.stringify(mockMessage))

      // Assert
      expect(onMessage).toHaveBeenCalledWith(mockMessage)
    })

    it('should clean up on connection close', () => {
      // Arrange
      const commentId = '456'
      const onMessage = vi.fn()

      // Act
      const ws = WebSocketServiceInstance.connectCommentWebSocket(
        commentId,
        onMessage,
      ) as unknown as MockWebSocket
      ws.close()

      // Assert
      const service = WebSocketServiceInstance as unknown as {
        commentWebSockets: Map<string, MockWebSocket>
      }
      expect(service.commentWebSockets.has(commentId)).toBe(false)
    })
  })

  describe('disconnectCommentWebSocket', () => {
    it('should close and remove WebSocket connection', () => {
      // Arrange
      const commentId = '456'
      const onMessage = vi.fn()
      const ws = WebSocketServiceInstance.connectCommentWebSocket(
        commentId,
        onMessage,
      ) as unknown as MockWebSocket
      const closeSpy = vi.spyOn(ws, 'close')

      // Act
      WebSocketServiceInstance.disconnectCommentWebSocket(commentId)

      // Assert
      expect(closeSpy).toHaveBeenCalled()
      const service = WebSocketServiceInstance as unknown as {
        commentWebSockets: Map<string, MockWebSocket>
      }
      expect(service.commentWebSockets.has(commentId)).toBe(false)
    })

    it('should handle disconnecting non-existing connection', () => {
      // Act & Assert - should not throw
      expect(() => {
        WebSocketServiceInstance.disconnectCommentWebSocket('non-existing')
      }).not.toThrow()
    })
  })
})
