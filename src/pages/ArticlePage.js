import React, { useState, useEffect } from 'react';
import { marked } from "marked";

const ArticlePage = ({ article, onBack }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (article && article.file) {
      fetch(`/artikel/${article.file}`)
        .then((response) => response.text())
        .then((text) => setContent(marked(text)));
    }
  }, [article]);

  return (
    <div className="prose lg:prose-xl prose-indigo mt-8 max-w-none container mx-auto p-4 md:p-8 animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
      >
        &larr; Kembali ke Daftar Artikel
      </button>
      <div
        className="prose prose-lg max-w-none prose-h1:text-slate-800 prose-h2:text-slate-700 prose-a:text-blue-600 hover:prose-a:text-blue-800"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default ArticlePage;
