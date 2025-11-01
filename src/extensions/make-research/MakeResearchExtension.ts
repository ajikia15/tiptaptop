import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    makeResearch: {
      /**
       * Trigger the Make Research command
       */
      makeResearch: () => ReturnType;
    };
  }
}

/**
 * Custom extension that adds a "Make Research" command
 * Currently triggers an alert, can be extended with actual research functionality
 */
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

