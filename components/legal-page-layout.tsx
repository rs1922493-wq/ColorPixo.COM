import React from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { LEGAL_DOCS, LegalDocKey } from '@/data/legal-docs';

interface Props {
  docKey: LegalDocKey;
}

export function LegalPageLayout({ docKey }: Props) {
  const doc = LEGAL_DOCS[docKey];

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs items={[{ label: doc.title }]} />

      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {doc.title.endsWith('.') ? doc.title : `${doc.title}.`}
        </h1>
        <p className="text-xs text-slate-400">
          Last revised: {doc.lastUpdated} • ColorPixo.Com
        </p>
      </div>

      <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
        {doc.sections.map((section, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {section.heading.endsWith('.') ? section.heading : `${section.heading}.`}
            </h2>
            <div className="space-y-3 text-slate-600 dark:text-slate-300">
              {section.content.split('\n\n').map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
