export async function fetchJson(url: string): Promise<unknown> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  } catch (e) {
    // TODO: manage error in result
    console.error(e);
  }
}
