import React, { useState } from 'react';
import { X, Copy, Check, Globe, Terminal } from 'lucide-react';

interface HostingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GITHUB_WORKFLOW_SNIPPET = `# .github/workflows/deploy.yml (Included in repository)
name: Deploy TadkaFlow to GitHub Pages
on:
  push:
    branches: ['main']
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - uses: actions/deploy-pages@v4`;

const GITLAB_CI_SNIPPET = `# .gitlab-ci.yml (Included in repository)
image: node:22-alpine
pages:
  stage: deploy
  script:
    - npm ci
    - npm run build
    - rm -rf public && mv dist public
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`;

export const HostingGuideModal: React.FC<HostingGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedTab, setCopiedTab] = useState<'github' | 'gitlab' | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, which: 'github' | 'gitlab') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedTab(which);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hosting-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-[#FAF7F2] border border-[#1C1613]/15 rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 space-y-5 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#1C1613]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C84B11]/12 text-[#C84B11] flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 id="hosting-modal-title" className="text-lg font-bold text-[#1C1613]">
                Static Hosting Ready · GitHub Pages &amp; GitLab Pages
              </h2>
              <p className="text-xs text-[#655A52]">
                Pre-configured with relative asset paths (<code className="font-mono">base: &apos;./&apos;</code>) and CI pipelines
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close hosting guide"
            className="min-h-[44px] min-w-[44px] rounded-xl border border-[#1C1613]/15 bg-white hover:bg-[#F3EDE2] flex items-center justify-center text-[#1C1613]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#1C1613]/85 leading-relaxed">
          This cooking app runs 100% client-side with zero backend runtime dependencies. All step timers, Web Audio chimes, voice controls, and bundled high-resolution photos work from any static host or subpath (<code className="font-mono">https://username.github.io/repo/</code>).
        </p>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#1C1613]/12 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1C1613]">
                <Terminal className="w-4 h-4 text-[#C84B11]" />
                <span>GitHub Pages Workflow (<code>.github/workflows/deploy.yml</code>)</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(GITHUB_WORKFLOW_SNIPPET, 'github')}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-[#1C1613]/12 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                {copiedTab === 'github' ? <Check className="w-3.5 h-3.5 text-[#2A6F48]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTab === 'github' ? 'Copied' : 'Copy YAML'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono bg-[#1C1613] text-[#FAF7F2] p-3.5 rounded-xl overflow-x-auto leading-relaxed">
              {GITHUB_WORKFLOW_SNIPPET}
            </pre>
          </div>

          <div className="rounded-2xl border border-[#1C1613]/12 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1C1613]">
                <Terminal className="w-4 h-4 text-[#2A6F48]" />
                <span>GitLab Pages Pipeline (<code>.gitlab-ci.yml</code>)</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(GITLAB_CI_SNIPPET, 'gitlab')}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-[#1C1613]/12 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                {copiedTab === 'gitlab' ? <Check className="w-3.5 h-3.5 text-[#2A6F48]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTab === 'gitlab' ? 'Copied' : 'Copy YAML'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono bg-[#1C1613] text-[#FAF7F2] p-3.5 rounded-xl overflow-x-auto leading-relaxed">
              {GITLAB_CI_SNIPPET}
            </pre>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1C1613] text-[#FAF7F2] text-xs font-semibold hover:bg-[#2E2520] transition-colors whitespace-nowrap"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
