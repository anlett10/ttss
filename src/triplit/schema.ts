import { Schema as S, type Entity } from '@triplit/client';
 
export const schema = S.Collections({
    todos: {
      schema: S.Schema({
        id: S.Id(),
        text: S.String(),
        completed: S.Boolean({ default: false }),
        created_at: S.Date({ default: S.Default.now() }),
      }),
    },
  });
  
  export type Todo = Entity<typeof schema, 'todos'>;