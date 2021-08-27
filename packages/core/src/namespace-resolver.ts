import crypto from 'crypto';

export function namespaceResolver(filepath: string) {
    const hash = crypto.createHash('sha1'); // Use sha1 algorithm.
    hash.write(filepath); // Hash the filepath.

    const namespace = hash.digest('hex').slice(0, 6); // Get the hashed filepath.

    return namespace;
}
