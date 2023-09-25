type ContentType = 'application/json' | 'text/plain';

export async function fetchSave(url: string, type: ContentType = 'application/json'): Promise<unknown> {
    try {
        const res = await fetch(url, {
            headers: {
                'Content-Type': type,
            },
        });
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return type === 'application/json' ? res.json() : res.text();
    } catch (e) {
        // TODO: manage error in result
        console.error(e);
    }
}
