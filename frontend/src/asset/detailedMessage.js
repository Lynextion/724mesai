import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

function identifyCodeBlocks(text) {
  const codeBlockRegex = /```([\s\S]*?)```/g;
  const codeBlocks = [];
  let match;

  let lastIndex = 0;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const codeBlockStartIndex = match.index;
    const codeBlockEndIndex = codeBlockRegex.lastIndex;

    if (codeBlockStartIndex > lastIndex) {
      // Regular text before code block
      const regularText = text.slice(lastIndex, codeBlockStartIndex);
      codeBlocks.push({ type: 'text', content: regularText });
    }

    const codeBlockContent = match[1];
    const [language, ...codeLines] = codeBlockContent.split('\n');
    const code = codeLines.join('\n');

    codeBlocks.push({ type: 'code', language, code });

    lastIndex = codeBlockEndIndex;
  }

  if (lastIndex < text.length) {
    // Regular text after the last code block
    const regularText = text.slice(lastIndex);
    codeBlocks.push({ type: 'text', content: regularText });
  }

  return codeBlocks;
}

function TextWithCodeBlocks({ text }) {
  const codeBlocks = identifyCodeBlocks(text);

  return (
    <div>
      {codeBlocks.map((block, index) =>
        block.type === 'text' ? (
          <span className="topicText" key={index}>{block.content}</span>
        ) : (
          <SyntaxHighlighter
            key={index}
            language={block.language}
            style={dracula}
          >
            {block.code}
          </SyntaxHighlighter>
        )
      )}
    </div>
  );
}

export default TextWithCodeBlocks;
