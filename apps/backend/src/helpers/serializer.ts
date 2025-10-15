export const arrField = {
    serialize: (arr: string[]) => JSON.stringify(arr),
    deserialize: (json?: string | null) => {
        try {
            return json ? JSON.parse(json) : [];
        } catch {
            return [];
        }
    },
};//use for arr fields in bd (sqlite doesnt support arrays native)