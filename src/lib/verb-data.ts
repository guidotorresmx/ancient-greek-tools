export type Tense = "present" | "imperfect" | "future" | "aorist" | "perfect" | "pluperfect" | "future_perfect";
export type Mood = "indicative" | "imperative" | "subjunctive" | "optative" | "infinitive" | "participle";
export type Voice = "active" | "middle" | "passive";
export type Person = "1s" | "2s" | "3s" | "1p" | "2p" | "3p";
export type Gender = "masculine" | "feminine" | "neuter";

export type VerbForm = {
  form: string;
  contracted?: string;
  person?: Person;
  gender?: Gender;
  translation?: { en: string; es: string };
};

export type VerbParadigm = {
  lemma: string;
  meaning: { en: string; es: string };
  type: "contract" | "athematic";
  conjugations: {
    [tense in Tense]?: {
      [mood in Mood]?: {
        [voice in Voice]?: VerbForm[];
      };
    };
  };
};

export const VERB_DATA: VerbParadigm[] = [
  {
    lemma: "ποιέω",
    meaning: { en: "to do, make", es: "hacer" },
    type: "contract",
    conjugations: {
      present: {
        indicative: {
          active: [
            { form: "ποιέ-ω", contracted: "ποιῶ", person: "1s" },
            { form: "ποιέ-εις", contracted: "ποιεῖς", person: "2s" },
            { form: "ποιέ-ει", contracted: "ποιεῖ", person: "3s" },
            { form: "ποιέ-ομεν", contracted: "ποιοῦμεν", person: "1p" },
            { form: "ποιέ-ετε", contracted: "ποιεῖτε", person: "2p" },
            { form: "ποιέ-ουσι(ν)", contracted: "ποιοῦσι(ν)", person: "3p" },
          ],
        },
        imperative: {
          active: [
            { form: "ποίε-ε", contracted: "ποίει", person: "2s" },
            { form: "ποιε-έτω", contracted: "ποιείτω", person: "3s" },
            { form: "ποιέ-ετε", contracted: "ποιεῖτε", person: "2p" },
            { form: "ποιε-όντων", contracted: "ποιούντων", person: "3p" },
          ],
        },
        subjunctive: {
          active: [
            { form: "ποιέ-ω", contracted: "ποιῶ", person: "1s" },
            { form: "ποιέ-ῃς", contracted: "ποιῇς", person: "2s" },
            { form: "ποιέ-ῃ", contracted: "ποιῇ", person: "3s" },
            { form: "ποιέ-ωμεν", contracted: "ποιῶμεν", person: "1p" },
            { form: "ποιέ-ητε", contracted: "ποιῆτε", person: "2p" },
            { form: "ποιέ-ωσι(ν)", contracted: "ποιῶσι(ν)", person: "3p" },
          ],
        },
        optative: {
          active: [
            { form: "ποιε-οίην", contracted: "ποιοίην", person: "1s" },
            { form: "ποιε-οίης", contracted: "ποιοίης", person: "2s" },
            { form: "ποιε-οίη", contracted: "ποιοίη", person: "3s" },
            { form: "ποιε-οῖμεν", contracted: "ποιοῖμεν", person: "1p" },
            { form: "ποιε-οῖτε", contracted: "ποιοῖτε", person: "2p" },
            { form: "ποιε-οῖεν", contracted: "ποιοῖεν", person: "3p" },
          ],
        },
        infinitive: {
          active: [{ form: "ποιέ-εν", contracted: "ποιεῖν" }],
        },
        participle: {
          active: [
            { form: "ποιέ-ων", contracted: "ποιῶν", gender: "masculine" },
            { form: "ποιέ-ουσα", contracted: "ποιοῦσα", gender: "feminine" },
            { form: "ποιέ-ον", contracted: "ποιοῦν", gender: "neuter" },
          ],
        },
      },
      imperfect: {
        indicative: {
          active: [
            { form: "ἐποίε-ον", contracted: "ἐποίουν", person: "1s" },
            { form: "ἐποίε-ες", contracted: "ἐποίεις", person: "2s" },
            { form: "ἐποίε-ε", contracted: "ἐποίει", person: "3s" },
            { form: "ἐποιέ-ομεν", contracted: "ἐποιοῦμεν", person: "1p" },
            { form: "ἐποιέ-ετε", contracted: "ἐποιεῖτε", person: "2p" },
            { form: "ἐποίε-ον", contracted: "ἐποίουν", person: "3p" },
          ],
        },
      },
    },
  },
  {
    lemma: "δείκνυμι",
    meaning: { en: "to show", es: "mostrar" },
    type: "athematic",
    conjugations: {
      present: {
        indicative: {
          active: [
            { form: "δείκνυμι", person: "1s" },
            { form: "δείκνυς", person: "2s" },
            { form: "δείκνυσι(ν)", person: "3s" },
            { form: "δείκνυμεν", person: "1p" },
            { form: "δείκνυτε", person: "2p" },
            { form: "δεικνύασι(ν)", person: "3p" },
          ],
        },
        imperative: {
          active: [
            { form: "δείκνυ", person: "2s" },
            { form: "δεικνύτω", person: "3s" },
            { form: "δείκνυτε", person: "2p" },
            { form: "δεικνύντων", person: "3p" },
          ],
        },
        subjunctive: {
          active: [
            { form: "δεικνύω", person: "1s" },
            { form: "δεικνύῃς", person: "2s" },
            { form: "δεικνύῃ", person: "3s" },
            { form: "δεικνύωμεν", person: "1p" },
            { form: "δεικνύητε", person: "2p" },
            { form: "δεικνύωσι(ν)", person: "3p" },
          ],
        },
        optative: {
          active: [
            { form: "δεικνύοιμι", person: "1s" },
            { form: "δεικνύοις", person: "2s" },
            { form: "δεικνύοι", person: "3s" },
            { form: "δεικνύοιμεν", person: "1p" },
            { form: "δεικνύοιτε", person: "2p" },
            { form: "δεικνύοιεν", person: "3p" },
          ],
        },
        infinitive: {
          active: [{ form: "δεικνύναι" }],
        },
        participle: {
          active: [
            { form: "δεικνύς", gender: "masculine" },
            { form: "δεικνῦσα", gender: "feminine" },
            { form: "δεικνύν", gender: "neuter" },
          ],
        },
      },
      imperfect: {
        indicative: {
          active: [
            { form: "ἐδείκνυν", person: "1s" },
            { form: "ἐδείκνυς", person: "2s" },
            { form: "ἐδείκνυ", person: "3s" },
            { form: "ἐδείκνυμεν", person: "1p" },
            { form: "ἐδείκνυτε", person: "2p" },
            { form: "ἐδείκνυσαν", person: "3p" },
          ],
        },
      },
      future: {
        indicative: {
          active: [
            { form: "δείξω", person: "1s" },
            { form: "δείξεις", person: "2s" },
            { form: "δείξει", person: "3s" },
            { form: "δείξομεν", person: "1p" },
            { form: "δείξετε", person: "2p" },
            { form: "δείξουσι(ν)", person: "3p" },
          ],
        },
        optative: {
          active: [
            { form: "δείξοιμι", person: "1s" },
            { form: "δείξοις", person: "2s" },
            { form: "δείξοι", person: "3s" },
            { form: "δείξοιμεν", person: "1p" },
            { form: "δείξοιτε", person: "2p" },
            { form: "δείξοιεν", person: "3p" },
          ],
        },
        infinitive: {
          active: [{ form: "δείξειν" }],
        },
        participle: {
          active: [
            { form: "δείξων", gender: "masculine" },
            { form: "δείξουσα", gender: "feminine" },
            { form: "δείξον", gender: "neuter" },
          ],
        },
      },
      aorist: {
        indicative: {
          active: [
            { form: "ἔδειξα", person: "1s" },
            { form: "ἔδειξας", person: "2s" },
            { form: "ἔδειξε(ν)", person: "3s" },
            { form: "ἐδείξαμεν", person: "1p" },
            { form: "ἐδείξατε", person: "2p" },
            { form: "ἔδειξαν", person: "3p" },
          ],
        },
        imperative: {
          active: [
            { form: "δεῖξον", person: "2s" },
            { form: "δειξάτω", person: "3s" },
            { form: "δείξατε", person: "2p" },
            { form: "δειξάντων", person: "3p" },
          ],
        },
        subjunctive: {
          active: [
            { form: "δείξω", person: "1s" },
            { form: "δείξῃς", person: "2s" },
            { form: "δείξῃ", person: "3s" },
            { form: "δείξωμεν", person: "1p" },
            { form: "δείξητε", person: "2p" },
            { form: "δείξωσι(ν)", person: "3p" },
          ],
        },
        optative: {
          active: [
            { form: "δείξαιμι", person: "1s" },
            { form: "δείξαις", person: "2s" },
            { form: "δείξαι", person: "3s" },
            { form: "δείξαιμεν", person: "1p" },
            { form: "δείξαιτε", person: "2p" },
            { form: "δείξαιεν", person: "3p" },
          ],
        },
        infinitive: {
          active: [{ form: "δεῖξαι" }],
        },
        participle: {
          active: [
            { form: "δείξας", gender: "masculine" },
            { form: "δείξασα", gender: "feminine" },
            { form: "δεῖξαν", gender: "neuter" },
          ],
        },
      },
      perfect: {
        indicative: {
          active: [
            { form: "δέδειχα", person: "1s" },
            { form: "δέδειχας", person: "2s" },
            { form: "δέδειχε", person: "3s" },
            { form: "δεδείχαμεν", person: "1p" },
            { form: "δεδείχατε", person: "2p" },
            { form: "δεδείχασι(ν)", person: "3p" },
          ],
        },
        imperative: {
          active: [
            { form: "δεδειχὼς ἴσθι", person: "2s" },
            { form: "δεδειχὼς ἔστω", person: "3s" },
            { form: "δεδειχότες ἔστε", person: "2p" },
            { form: "δεδειχότες ἔστων", person: "3p" },
          ],
        },
        subjunctive: {
          active: [
            { form: "δεδείχω", person: "1s" },
            { form: "δεδείχῃς", person: "2s" },
            { form: "δεδείχῃ", person: "3s" },
            { form: "δεδείχωμεν", person: "1p" },
            { form: "δεδείχητε", person: "2p" },
            { form: "δεδείχωσι(ν)", person: "3p" },
          ],
        },
        optative: {
          active: [
            { form: "δεδείχοιμι", person: "1s" },
            { form: "δεδείχοις", person: "2s" },
            { form: "δεδείχοι", person: "3s" },
            { form: "δεδείχοιμεν", person: "1p" },
            { form: "δεδείχοιτε", person: "2p" },
            { form: "δεδείχοιεν", person: "3p" },
          ],
        },
        infinitive: {
          active: [{ form: "δεδειχέναι" }],
        },
        participle: {
          active: [
            { form: "δεδειχώς", gender: "masculine" },
            { form: "δεδειχυῖα", gender: "feminine" },
            { form: "δεδειχός", gender: "neuter" },
          ],
        },
      },
      pluperfect: {
        indicative: {
          active: [
            { form: "ἐδεδείχειν / ἐδεδείχη", person: "1s" },
            { form: "ἐδεδείχεις / ἐδεδείχης", person: "2s" },
            { form: "ἐδεδείχει(ν)", person: "3s" },
            { form: "ἐδεδείχεμεν", person: "1p" },
            { form: "ἐδεδείχετε", person: "2p" },
            { form: "ἐδεδείχεσαν", person: "3p" },
          ],
        },
      },
      future_perfect: {
        indicative: {
          active: [
            { form: "δεδειχὼς ἔσομαι", person: "1s" },
            { form: "δεδειχὼς ἔσει (ἔσῃ)", person: "2s" },
            { form: "δεδειχὼς ἔσται", person: "3s" },
            { form: "δεδειχότες ἐσόμεθα", person: "1p" },
            { form: "δεδειχότες ἔσεσθε", person: "2p" },
            { form: "δεδειχότες ἔσονται", person: "3p" },
          ],
        },
      },
    },
  },
].map(v => ({
  ...v,
  lemma: v.lemma.normalize("NFC"),
  conjugations: Object.fromEntries(
    Object.entries(v.conjugations).map(([tense, moods]) => [
      tense,
      Object.fromEntries(
        Object.entries(moods as any).map(([mood, voices]) => [
          mood,
          Object.fromEntries(
            Object.entries(voices as any).map(([voice, forms]) => [
              voice,
              (forms as VerbForm[]).map(f => ({
                ...f,
                form: f.form.normalize("NFC"),
                contracted: f.contracted?.normalize("NFC")
              }))
            ])
          )
        ])
      )
    ])
  ) as any,
  type: v.type as "contract" | "athematic"
}));
