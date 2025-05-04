import { marked } from 'marked';
import hljs from 'highlight.js';

marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return code;
  },
  breaks: true,
  gfm: true,
  sanitize: false,
  headerIds: false
});

export const formatMessageContent = (content: string): string => {
  // Remove image markdown syntax if we're handling it separately
  content = content.replace(/!\[Generated Image\]\(.*?\)/g, '');
  
  // Check if the content contains explicit code blocks
  const hasCodeBlocks = content.includes('```');
  
  if (hasCodeBlocks) {
    // Handle code blocks specially
    return formatCodeContent(content);
  } else {
    // Handle regular text content
    return formatTextContent(content);
  }
};

const formatCodeContent = (content: string): string => {
  // Preserve code blocks
  content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    code = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    return `<div class="code-block"><pre><code class="language-${lang || 'plaintext'}">${code}</code></pre></div>`;
  });

  // Format the rest as regular text
  return marked(content);
};

const formatTextContent = (content: string): string => {
  // Convert bullet points to proper HTML lists
  content = content.replace(/^[•-]\s+(.*)$/gm, '<li>$1</li>');
  content = content.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Convert numbered lists
  content = content.replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>');
  content = content.replace(/(<li>.*<\/li>\n?)+/g, '<ol>$&</ol>');

  // Convert "Title:" format to proper heading
  content = content.replace(/^Title:\s*(.*)$/gm, '<h3>$1</h3>');

  // Handle indentation
  content = content.replace(/^(\s{2,})(.+)$/gm, (match, spaces, text) => {
    const level = Math.floor(spaces.length / 2);
    return `<div class="ml-${level * 4}">${text}</div>`;
  });

  // Convert ALL CAPS to emphasis
  content = content.replace(/\b[A-Z]{2,}\b/g, '<strong>$&</strong>');

  // Convert (notes) to subtle emphasis
  content = content.replace(/\((.*?)\)/g, '<em>($1)</em>');

  // Format with marked for any remaining markdown
  let html = marked(content);

  // Clean up any remaining code-like formatting
  html = html
    .replace(/<pre><code>/g, '<div>')
    .replace(/<\/code><\/pre>/g, '</div>')
    .replace(/<code>/g, '<span>')
    .replace(/<\/code>/g, '</span>');

  return html;
};
