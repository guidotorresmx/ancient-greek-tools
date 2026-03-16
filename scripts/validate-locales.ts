import en from "../src/locales/en.json";
import es from "../src/locales/es.json";

function getKeys(obj: any, prefix = ""): string[] {
  let keys: string[] = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.push(fullKey);
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    }
  }
  return keys;
}

const enKeys = new Set(getKeys(en));
const esKeys = new Set(getKeys(es));

let hasError = false;

// Check for keys in EN but missing in ES
for (const key of enKeys) {
  if (!esKeys.has(key)) {
    console.error(`❌ Missing key in Spanish (es.json): ${key}`);
    hasError = true;
  }
}

// Check for keys in ES but missing in EN
for (const key of esKeys) {
  if (!enKeys.has(key)) {
    console.error(`❌ Missing key in English (en.json): ${key}`);
    hasError = true;
  }
}

if (hasError) {
  console.log("\n⚠️ Locale validation failed. Please ensure both locale files have the same keys.");
  process.exit(1);
} else {
  console.log("✅ Locale validation passed! All keys are synchronized.");
  process.exit(0);
}
