'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { BulletList, OrderedList } from '@tiptap/extension-list';

import StarterKit from '@tiptap/starter-kit';
import { Button } from './ui/button';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrderedIcon,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from 'lucide-react';

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className='flex flex-wrap gap-y-2 gap-x-1 p-2 border-b bg-secondary/50'>
      <Button
        variant={'ghost'}
        className='p-2 cursor-pointer'
        onClick={() => editor.chain().focus().toggleBold().run()}
        type='button'
      >
        <Bold />
      </Button>
      <Button
        variant={'ghost'}
        className='p-2 cursor-pointer'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        type='button'
      >
        <Italic />
      </Button>
      <Button
        variant={'ghost'}
        className='p-2 cursor-pointer'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        type='button'
      >
        <Strikethrough />
      </Button>
      <Button
        variant={'ghost'}
        className='p-2 cursor-pointer'
        onClick={() => editor.chain().focus().toggleCode().run()}
        type='button'
      >
        <Code />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        variant={'ghost'}
        className='p-2 cursor-pointer'
        type='button'
      >
        <Heading1 />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        variant={'ghost'}
        className='p-2 cursor-pointer'
        type='button'
      >
        <Heading2 />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={'ghost'}
        className='p-2 cursor-pointer'
        type='button'
      >
        <Heading3 />
      </Button>
      <Button
        variant={'ghost'}
        className='p-2 cursor-pointer'
        type='button'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List />
      </Button>
      <Button
        variant={'ghost'}
        className='p-2 cursor-pointer'
        type='button'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon />
      </Button>
      <Button
        variant={'ghost'}
        className='p-2 cursor-pointer'
        type='button'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote />
      </Button>
      <Button
        variant={'ghost'}
        className='p-2 cursor-pointer'
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        type='button'
      >
        <Minus />
      </Button>
      <Button
        variant={'ghost'}
        onClick={() => editor.chain().focus().undo().run()}
        type='button'
        className='p-2 cursor-pointer'
      >
        <Undo2 />
      </Button>
      <Button
        variant={'ghost'}
        onClick={() => editor.chain().focus().redo().run()}
        type='button'
        className='p-2 cursor-pointer'
      >
        <Redo2 />
      </Button>
    </div>
  );
};

const Tiptap = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      BulletList.configure({ HTMLAttributes: { class: 'list-disc' } }),
      OrderedList.configure({ HTMLAttributes: { class: 'list-decimal' } }),
    ],

    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base rounded-b-md transition duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-auto min-h-30 ',
      },
    },
  });

  return (
    <div className='flex flex-col border rounded-md'>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
