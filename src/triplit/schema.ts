import { Schema as S, type Entity } from '@triplit/client';
 
export const schema = S.Collections({
    todos: {
      schema: S.Schema({
        id: S.Id(),
        text: S.String(),
        user_id: S.String(),
        username: S.String(),
        completed: S.Boolean({ default: false }),
        created_at: S.Date({ default: S.Default.now() }),
      }),
    },
    users: {
      schema: S.Schema({
        id: S.Id(),
        username: S.String(),
        email: S.String(),
        created_at: S.Date(),
      }),
      relationships: {
        todos: S.RelationMany('todos', {
          where: [['user_id', '=', '$id']],
        }),
      },
    },
  });
  
  export type Todo = Entity<typeof schema, 'todos'>;
  export type User = Entity<typeof schema, 'users'>;