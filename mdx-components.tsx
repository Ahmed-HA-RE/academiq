import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

const components = {
  a: ({ href, children }) => {
    if (href.startsWith('/')) {
      return <Link href={href}>{children}</Link>;
    }
    return (
      <a href={href} target='_blank' rel='noopener noreferrer'>
        {children}
      </a>
    );
  },
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
