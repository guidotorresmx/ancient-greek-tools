import MemoryGame from "@/components/ui/memory-game";
import Card from "@/components/ui/card";

export const metadata = {
  title: "Memory — Ancient Greek Tools",
};

export default function Page() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Greek Letters Memory</h1>
      <Card title="Match the name with upper- and lower-case glyphs">
        <MemoryGame />
      </Card>
    </div>
  );
}
