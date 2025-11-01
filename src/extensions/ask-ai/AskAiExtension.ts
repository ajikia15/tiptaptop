import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    askAi: {
      askAI: () => ReturnType;
    };
  }
}

export const AskAiExtension = Extension.create({
  name: 'askAi',

  addCommands() {
    return {
      askAI: () => () => {
        alert('Ask AI');
        return true;
      },
    };
  },
});

