import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { SlashCommandItem } from '@/extensions/slash/SlashCommandExtension';
import { KeyboardShortcut } from '@/components/ui/keyboard-shortcut';

export interface SlashMenuListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export interface SlashMenuListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const SlashMenuList = forwardRef<SlashMenuListRef, SlashMenuListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];
      if (item) {
        props.command(item);
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    if (props.items.length === 0) {
      return (
        <div 
          className="rounded-md border bg-popover text-popover-foreground shadow-md p-2"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
        </div>
      );
    }

    return (
      <div 
        className="rounded-md border bg-popover text-popover-foreground shadow-md p-2 min-w-[360px]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {props.items.map((item, index) => (
          <button
            key={index}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-left transition-colors ${
              index === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={() => selectItem(index)}
            type="button"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-muted text-foreground font-semibold shrink-0">
              {item.icon}
            </span>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <div 
                className="text-sm font-medium"
                style={{ 
                  fontWeight: 500, 
                  fontSize: '14px', 
                  lineHeight: '20px', 
                  letterSpacing: '0.1px' 
                }}
              >
                {item.title}
              </div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
            {item.shortcut && (
              <div className="ml-auto shrink-0">
                <KeyboardShortcut shortcut={item.shortcut} />
              </div>
            )}
          </button>
        ))}
      </div>
    );
  }
);

SlashMenuList.displayName = 'SlashMenuList';

