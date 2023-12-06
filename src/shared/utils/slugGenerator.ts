export function createSlug(name: string): string {
  name = name.toLowerCase();
  name = name.replace(/\s+/g, "-");
  name = name.replace(/[^a-z0-9-]/g, "");
  return name;
}
