export type FetchGitLabApiParams = {
    projectId: string;
    apiPath: string;
    requestInit?: RequestInit;
    contentType?: string;
};

export async function fetchGitLabApi<T = unknown>({
    projectId,
    apiPath,
    requestInit = {},
    contentType = 'application/json',
}: FetchGitLabApiParams): Promise<T> {
    const PRIVATE_TOKEN = process.env['GITLAB_PRIVATE_TOKEN'];
    if (!PRIVATE_TOKEN) {
        throw new Error('You need to specify a PRIVATE_TOKEN in env variable GITLAB_PRIVATE_TOKEN to be able to call gitlab api');
    }

    const url = `https://vie.git.bwinparty.com/api/v4/projects/${projectId}/${apiPath}`;
    const headers = {
        'Content-Type': contentType,
        'PRIVATE-TOKEN': PRIVATE_TOKEN,
    };
    const res = await fetch(url, {
        headers,
        ...requestInit,
    });
    if (!res.ok) {
        const result = await res.json();
        throw new Error(result['message'] ?? result['error_description']);
    }
    return contentType === 'application/json' ? res.json() : res.text();
}
