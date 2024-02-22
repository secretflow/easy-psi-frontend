import * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';

import { useModel } from '@/util/valtio-helper';
import { LogView } from './task-log-drawer';

import './monaco-log';

export const Log: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [logEditor] = useState<LogEditor>(new LogEditor());
  const viewInstance = useModel(LogView);

  useEffect(() => {
    loadEditor();
    return () => {
      if (logEditor) {
        logEditor.disposeEditor();
      }
    };
  }, []);

  useEffect(() => {
    logEditor?.editor?.setValue(viewInstance.logContent || '');
  }, [logEditor, viewInstance.logContent]);

  const loadEditor = async () => {
    if (editorRef && editorRef.current) {
      await logEditor.initEditor(
        editorRef.current,
        '2023-07-18 13:50:46.100 | INFO | flow=ee7818a774664f7dbcbf6deb1bb078b2, job=op-table-statistics-0e25+429206b4b4ba09c 创建成功',
      );
    }
  };

  return <div ref={editorRef} style={{ height: '100%' }} />;
};

export class LogEditor {
  editor?: monaco.editor.IStandaloneCodeEditor;

  initEditor = async (node: HTMLElement, logs: string) => {
    const editor = monaco.editor.create(node, {
      value: logs,
      language: 'log',
      theme: 'logview',
      automaticLayout: true,
      suggestLineHeight: 18,
      minimap: {
        enabled: false,
      },
      fontSize: 12,
      lineHeight: 18,
      folding: true,
      wordWrap: 'on',
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 4,
      readOnly: true,
      find: {
        seedSearchStringFromSelection: 'never',
        autoFindInSelection: 'never',
        addExtraSpaceOnTop: false,
      },
      contextmenu: false,
      wordBasedSuggestions: false,
      unicodeHighlight: {
        nonBasicASCII: false,
        invisibleCharacters: false,
        ambiguousCharacters: false,
        includeComments: false,
      },
    });

    this.editor = editor;
  };

  disposeEditor = () => {
    if (this.editor) {
      this.editor.dispose();
      this.editor = undefined;
    }
  };
}
