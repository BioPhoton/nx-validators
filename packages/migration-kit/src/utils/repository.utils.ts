import { fetchGitLabApi } from './fetch-gitlab-api.utils';

export type GitLabFetchRawFileRequest = {
    pathToFile: string;
    ref?: string;
    contentType?: string;
};

export const fetchGitLabRepositoryRawFile =
    (projectId: string) =>
    <T = unknown>({ pathToFile, contentType, ref }: GitLabFetchRawFileRequest): Promise<T> =>
        fetchGitLabApi<T>({
            projectId,
            apiPath: `repository/files/${pathToFile.replaceAll('/', '%2F')}/raw?ref=${ref ?? 'main'}`,
            contentType,
        });
