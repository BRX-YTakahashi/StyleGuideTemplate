declare module "*.md" {
  import type { RenderableTreeNode } from '@markdoc/markdoc'
  const Node: RenderableTreeNode
  export default Node
}

// MEMO: https://github.com/vitejs/vite/issues/4067
declare module '*.md?raw';

/// <reference types="vite/client" />
