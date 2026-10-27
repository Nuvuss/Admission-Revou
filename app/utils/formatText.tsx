import React from "react";
import { ExternalLink } from "lucide-react";

// Helper to render text with clickable hyperlinks, markdown bold, highlights, and italics
export function renderFormattedTextWithLinks(
  text: string,
  options?: { isSummary?: boolean }
) {
  if (!text) return null;

  // Regex matching:
  // 1 & 2: Markdown links [label](url)
  // 3: Raw URLs https://...
  // 4: Highlight ==text==
  // 5: Highlight <mark>text</mark>
  // 6: Bold **text**
  // 7: Bold __text__
  // 8: Italic *text*
  const regex =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>"'{}|\\^`[\]()]+)|==([^=]+)==|<mark>([\s\S]*?)<\/mark>|\*\*([^*]+)\*\*|__([^_]+)__|(?<!\*)\*([^*]+)\*(?!\*)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let counter = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      const rawLabel = match[1];
      const url = match[2];
      const cleanLabel = rawLabel.replace(/\*\*/g, "").replace(/__/g, "");
      elements.push(
        <a
          key={`link-${counter++}-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0E62FE] hover:text-[#0043CE] underline font-semibold inline-flex items-center gap-0.5 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{cleanLabel}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0 opacity-80" />
        </a>
      );
    } else if (match[3]) {
      const url = match[3];
      elements.push(
        <a
          key={`rawurl-${counter++}-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0E62FE] hover:text-[#0043CE] underline font-semibold break-all inline-flex items-center gap-0.5 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{url}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0 opacity-80" />
        </a>
      );
    } else if (match[4] || match[5]) {
      const content = match[4] || match[5];
      elements.push(
        <mark
          key={`mark-${counter++}-${match.index}`}
          className="bg-[#FEF08A]/90 text-[#141412] font-semibold px-1 py-0.5 rounded"
        >
          {content}
        </mark>
      );
    } else if (match[6] || match[7]) {
      const content = match[6] || match[7];
      elements.push(
        <strong
          key={`bold-${counter++}-${match.index}`}
          className="font-bold text-[#141412]"
        >
          {content}
        </strong>
      );
    } else if (match[8]) {
      const content = match[8];
      elements.push(
        <em key={`em-${counter++}-${match.index}`} className="italic">
          {content}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}
