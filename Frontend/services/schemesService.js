import { SCHEMES_SEED } from "../constants/schemesSeed";

/**
 * Simulate fetching schemes with filtering using local seed data
 */
export async function fetchSchemes({
  type = "",
  state = "",
  category = "",
  q = "",
} = {}) {
  let results = [...SCHEMES_SEED];

  // Filter by type
  if (type) {
    results = results.filter((s) => s.type === type);
  }

  // Filter by state
  if (state) {
    results = results.filter(
      (s) => s.state?.toLowerCase() === state.toLowerCase(),
    );
  }

  // Filter by category
  if (category) {
    results = results.filter((s) => s.category === category);
  }

  // Search
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query),
    );
  }

  // simulate small network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return results;
}

/**
 * Get scheme by ID from seed data
 */
export async function fetchSchemeById(id) {
  const scheme = SCHEMES_SEED.find((s) => s._id === id);

  if (!scheme) {
    throw new Error("Scheme not found");
  }

  return scheme;
}
