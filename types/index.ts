export enum SnippetLanguage {
    TYPESCRIPT = 'typescript',
    JAVASCRIPT = 'javascript',
    PYTHON = 'python',
    JAVA = 'java',
    CSHARP = 'csharp',
    GO = 'go',
    RUST = 'rust',
    SWIFT = 'swift',
    KOTLIN = 'kotlin',
    DART = 'dart',
    SQL = 'sql',
    HTML = 'html',
    CSS = 'css',
    JSON = 'json',
    YAML = 'yaml',
    XML = 'xml',
    SHELL = 'shell',
}

export enum SnippetVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export interface User {
    id: string;
    email: string;
    fullName: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Snippet {
    id: string;
    title: string;
    code: string;
    language: SnippetLanguage;
    visibility: SnippetVisibility;
    isPinned: boolean;
    tags: string[] | null;
    createdAt: string;
    updatedAt: string;
    user: User;
}

export interface CreateSnippetInput {
    title: string;
    code: string;
    language: SnippetLanguage;
    visibility?: SnippetVisibility;
    isPinned?: boolean;
    tags?: string[];
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        lastPage: number;
    };
}

export interface AuthResponse {
    access_token: string;
}