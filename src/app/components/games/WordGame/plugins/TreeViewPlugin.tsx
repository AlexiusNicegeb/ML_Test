import type { JSX } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView } from '@lexical/react/LexicalTreeView';
import { useEffect } from 'react';

export default function TreeViewPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Wait for the DOM to render, then hide the tree view manually
    const hideTreeView = () => {
      //const treeViewElement = document.querySelector('.tree-view-output');
      
    };
    setTimeout(hideTreeView, 100); // Delay to ensure DOM is loaded
  }, []);

  return (
      <TreeView
        viewClassName="tree-view-output"
        treeTypeButtonClassName="debug-treetype-button"
        timeTravelPanelClassName="debug-timetravel-panel"
        timeTravelButtonClassName="debug-timetravel-button"
        timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
        timeTravelPanelButtonClassName="debug-timetravel-panel-button"
        editor={editor}
      />
  );
}
