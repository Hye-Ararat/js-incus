/// <reference types="ws" />
import { AxiosInstance } from "axios";
import { WebSocket } from "isomorphic-ws";
export type StatusCode = 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 200 | 400 | 401;
export interface ResponseRaw {
    type: ResponseType;
    status: string;
    status_code: StatusCode;
    operation: string;
    error_code: number;
    error: string;
    metadata: any;
}
export declare function connectOIDC(url: string, accessToken: string, refreshToken?: string): AxiosInstance & {
    ws: (url: string) => WebSocket;
};
export declare function connectUnix(socketPath: string): AxiosInstance;
