export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  tr?: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  intro: string;
  sections: BlogSection[];
  wordCount?: number;
}

export interface ServiceItem {
  slug: string;
  tr?: string;
  title: string;
  short: string;
  tag?: string;
  note?: string;
}

export interface ServiceExpandedContent {
  headline: string;
  context: string;
  approach: string;
  takeaway: string;
  situations: string[];
  faq: FAQItem[];
}

export interface ExpandedServiceCopyEntry {
  tr: ServiceExpandedContent;
  de: ServiceExpandedContent;
}

export type ExpandedServiceCopyMap = Record<string, ExpandedServiceCopyEntry>;
