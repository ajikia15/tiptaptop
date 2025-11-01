import { Extension } from '@tiptap/core';
import { ChainedCommands } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    createTodo: {
      /**
       * Insert a to-do list
       */
      insertTodoList: () => ReturnType;
    };
  }
}

/**
 * Custom extension that adds a command to insert a to-do list
 */
export const CreateTodoExtension = Extension.create({
  name: 'createTodo',

  addCommands() {
    return {
      insertTodoList:
        () =>
        ({ chain }: { chain: () => ChainedCommands }) => {
          return chain()
            .focus()
            .insertContent({
              type: 'taskList',
              content: [
                {
                  type: 'taskItem',
                  attrs: { checked: false },
                  content: [
                    {
                      type: 'paragraph',
                    },
                  ],
                },
              ],
            })
            .focus()
            .run();
        },
    };
  },
});

