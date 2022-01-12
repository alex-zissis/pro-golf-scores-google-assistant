
    export interface Params {
    }

    export interface Session {
        id: string;
        params: Params;
        languageCode: string;
    }

    export interface Button {
    }

    export interface Column {
        header: string;
    }

    export interface Image {
    }

    export interface Cell {
        text: string;
    }

    export interface Row {
        cells: Cell[];
    }

    export interface Table {
        button: Button;
        columns: Column[];
        image: Image;
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
