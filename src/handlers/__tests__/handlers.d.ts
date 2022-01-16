export interface Session {
    id: string;
    params: object;
    languageCode: string;
}

export interface Column {
    header: string;
}

export interface Cell {
    text: string;
}

export interface Row {
    cells: Cell[];
}

export interface Table {
    button: object;
    columns: Column[];
    image: object;
    rows: Row[];
    subtitle: string;
    title: string;
}

export interface Content {
    table: Table;
}

export interface FirstSimple {
    speech: string;
    text: string;
}

export interface Prompt {
    override: boolean;
    content: Content;
    firstSimple: FirstSimple;
}

export interface ConversationResponse {
    session: Session;
    prompt: Prompt;
}
