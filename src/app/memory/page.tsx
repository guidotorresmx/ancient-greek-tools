import MemoryGame from "@/components/ui/memory-game";

export const metadata = {
  title: "Memory — Ancient Greek Tools",
};

export default function Page() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Greek Letters Memory</h1>
      <MemoryGame />
    </div>
  );
}
