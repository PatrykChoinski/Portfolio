import { existsSync } from 'node:fs';
export const browserChannel = !process.env.CI && existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe') ? 'msedge' : undefined;
