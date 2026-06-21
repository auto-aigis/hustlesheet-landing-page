export interface AISEntry {
  description: string;
  amount: number;
  source: string;
}

export function parseAISJson(raw: unknown): AISEntry[] {
  if (!raw || typeof raw !== 'object') return [];
  const entries: AISEntry[] = [];
  const traverse = (obj: unknown) => {
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
      return;
    }
    if (obj && typeof obj === 'object') {
      const o = obj as Record<string, unknown>;
      if (o.amount !== undefined && (o.description || o.source || o.type)) {
        entries.push({
          description: String(o.description || o.type || o.source || 'Income'),
          amount: Number(o.amount) || 0,
          source: String(o.source || o.tds_category || 'AIS'),
        });
      }
      Object.values(o).forEach(traverse);
    }
  };
  traverse(raw);
  return entries.filter((e) => e.amount > 0);
}
