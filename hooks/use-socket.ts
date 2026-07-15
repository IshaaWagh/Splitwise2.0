"use client"
import { useEffect, useRef } from "react"
import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export function useSocket() {
  const ref = useRef<Socket | null>(null)

  useEffect(() => {
    if (!socket) {
      socket = io({ path: "/api/socketio", transports: ["websocket"] })
    }
    ref.current = socket
  }, [])

  return ref.current
}