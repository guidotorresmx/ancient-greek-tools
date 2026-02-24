import { VocabularyGame } from "@/components/ui/vocabulary-game";

export const metadata = {
  title: "Vocabulario Frecuente — Ancient Greek Tools",
  description: "Learn the most frequent words in Ancient Greek.",
};

export default function VocabularyPage() {
  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Vocabulario Frecuente</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Master the building blocks of Ancient Greek by learning the most common words 
          found in classical literature.
        </p>
      </div>
      
      <VocabularyGame />
    </div>
  );
}
