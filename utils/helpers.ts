export async function sleep(ms: number): Promise<boolean> {
    return new Promise((resolve) => setTimeout(() => resolve(true), ms));
}

export async function currentTimestamp(): Promise<number> {
    return Date.now()
}