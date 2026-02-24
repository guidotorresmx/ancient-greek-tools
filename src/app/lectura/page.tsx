import { ReadingGame } from "@/components/ui/reading-game";

export const metadata = {
  title: "Lectura Interactiva — Ancient Greek Tools",
  description: "Improve your reading and listening skills with interactive sentences.",
};

export default function LecturaPage() {
  return (
    <div className="flex flex-col items-center">
      <ReadingGame />
    </div>
  );
}
