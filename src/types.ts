export type TaskId = 'file_mover' | 'email_extractor' | 'web_scraper';

export interface VirtualFile {
  id: string;
  name: string;
  extension: string;
  sizeKb: number;
  content?: string;
  folder: 'source' | 'destination';
  lastModified: string;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
  text: string;
}

export interface EmailRecord {
  email: string;
  domain: string;
  line: number;
  context: string;
}

export interface ScrapedPageRecord {
  id: string;
  url: string;
  title: string;
  statusCode: number;
  extractedAt: string;
  method: 're' | 'bs4';
  description?: string;
}
