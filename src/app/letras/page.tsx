import { PhoneticGame } from "@/components/ui/phonetic-game";

export const metadata = {
  title: "Letras & Sonidos — Ancient Greek Tools",
  description: "Learn to recognize Ancient Greek letters and their sounds.",
};

export default function LetrasPage() {
  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Letras & Sonidos</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Train your ear to recognize the sounds of the classical Greek alphabet.
          Listen carefully and select the correct letter.
        </p>
      </div>
      
      <PhoneticGame />
    </div>
  );
}
