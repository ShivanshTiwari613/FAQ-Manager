// utils/htmlUtils.js
export function extractTextFromHTML(html = '') {
    return html.replace(/<[^>]*>/g, '');
  }
  