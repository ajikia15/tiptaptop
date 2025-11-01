import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    makeResearch: {
      makeResearch: () => ReturnType;
    };
  }
}

export const MakeResearchExtension = Extension.create({
  name: 'makeResearch',

  addCommands() {
    return {
      makeResearch: () => () => {
        alert('Make research');
        return true;
      },
    };
  },
});

