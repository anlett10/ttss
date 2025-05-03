import { TriplitClient } from '@triplit/client';
 
export const triplit = new TriplitClient({
  serverUrl: import.meta.env.VITE_TRIPLIT_SERVER_URL,
  token: import.meta.env.VITE_TRIPLIT_TOKEN,
});