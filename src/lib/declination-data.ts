export type Case = "nominative" | "genitive" | "dative" | "accusative" | "vocative";
export type Number = "singular" | "plural";
export type Gender = "masculine" | "feminine" | "neuter";

export type DeclinationEntry = {
  case: Case;
  number: Number;
  form: string;
};

export type NounParadigm = {
  lemma: string;
  translation: { en: string; es: string };
  gender: Gender;
  declination: DeclinationEntry[];
};

export const DECLINATION_DATA: NounParadigm[] = [
  {
    lemma: "λόγος",
    translation: { en: "word", es: "palabra" },
    gender: "masculine" as Gender,
    declination: [
      { case: "nominative", number: "singular", form: "λόγος" },
      { case: "genitive", number: "singular", form: "λόγου" },
      { case: "dative", number: "singular", form: "λόγῳ" },
      { case: "accusative", number: "singular", form: "λόγον" },
      { case: "vocative", number: "singular", form: "λόγε" },
      { case: "nominative", number: "plural", form: "λόγοι" },
      { case: "genitive", number: "plural", form: "λόγων" },
      { case: "dative", number: "plural", form: "λόγοις" },
      { case: "accusative", number: "plural", form: "λόγους" },
      { case: "vocative", number: "plural", form: "λόγοι" },
    ],
  },
  {
    lemma: "ἡμέρα",
    translation: { en: "day", es: "día" },
    gender: "feminine" as Gender,
    declination: [
      { case: "nominative", number: "singular", form: "ἡμέρα" },
      { case: "genitive", number: "singular", form: "ἡμέρας" },
      { case: "dative", number: "singular", form: "ἡμέρᾳ" },
      { case: "accusative", number: "singular", form: "ἡμέραν" },
      { case: "vocative", number: "singular", form: "ἡμέρα" },
      { case: "nominative", number: "plural", form: "ἡμέραι" },
      { case: "genitive", number: "plural", form: "ἡμέρων" },
      { case: "dative", number: "plural", form: "ἡμέραις" },
      { case: "accusative", number: "plural", form: "ἡμέρας" },
      { case: "vocative", number: "plural", form: "ἡμέραι" },
    ],
  },
  {
    lemma: "δῶρον",
    translation: { en: "gift", es: "regalo" },
    gender: "neuter" as Gender,
    declination: [
      { case: "nominative", number: "singular", form: "δῶρον" },
      { case: "genitive", number: "singular", form: "δῶρου" },
      { case: "dative", number: "singular", form: "δῶρῳ" },
      { case: "accusative", number: "singular", form: "δῶρον" },
      { case: "vocative", number: "singular", form: "δῶρον" },
      { case: "nominative", number: "plural", form: "δῶρα" },
      { case: "genitive", number: "plural", form: "δῶρων" },
      { case: "dative", number: "plural", form: "δῶροις" },
      { case: "accusative", number: "plural", form: "δῶρα" },
      { case: "vocative", number: "plural", form: "δῶρα" },
    ],
  },
  {
    lemma: "πόλις",
    translation: { en: "city", es: "ciudad" },
    gender: "feminine" as Gender,
    declination: [
      { case: "nominative", number: "singular", form: "πόλις" },
      { case: "genitive", number: "singular", form: "πόλεως" },
      { case: "dative", number: "singular", form: "πόλει" },
      { case: "accusative", number: "singular", form: "πόλιν" },
      { case: "vocative", number: "singular", form: "πόλι" },
      { case: "nominative", number: "plural", form: "πόλεις" },
      { case: "genitive", number: "plural", form: "πόλεων" },
      { case: "dative", number: "plural", form: "πόλεσι" },
      { case: "accusative", number: "plural", form: "πόλεις" },
      { case: "vocative", number: "plural", form: "πόλεις" },
    ],
  },
  {
    lemma: "βασιλεύς",
    translation: { en: "king", es: "rey" },
    gender: "masculine" as Gender,
    declination: [
      { case: "nominative", number: "singular", form: "βασιλεύς" },
      { case: "genitive", number: "singular", form: "βασιλέως" },
      { case: "dative", number: "singular", form: "βασιλεῖ" },
      { case: "accusative", number: "singular", form: "βασιλέα" },
      { case: "vocative", number: "singular", form: "βασιλεῦ" },
      { case: "nominative", number: "plural", form: "βασιλεῖς" },
      { case: "genitive", number: "plural", form: "βασιλέων" },
      { case: "dative", number: "plural", form: "βασιλεῦσι" },
      { case: "accusative", number: "plural", form: "βασιλεῖς" },
      { case: "vocative", number: "plural", form: "βασιλεῖς" },
    ],
  },
].map(p => ({
  ...p,
  lemma: p.lemma.normalize("NFC"),
  declination: p.declination.map(d => ({ ...d, form: d.form.normalize("NFC") }))
}));
