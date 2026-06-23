/** Serializes a float array for PostgreSQL `::vector` casts (pgvector format). */
export function vectorToSql(embedding: number[]): string {
  return JSON.stringify(embedding.map((v) => Number(v)));
}
