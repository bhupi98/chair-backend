import { Socket } from "socket.io";

export function handleError(client: Socket, message: string, error?: Error,type?:string,payload?:any): void {
    console.error(message, error?.message);
    client.emit('error', { message,name:type,payload });
    client.disconnect(true);
  }
  