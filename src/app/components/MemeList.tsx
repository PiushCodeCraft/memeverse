import Link from "next/link";
import Image from "next/image";

interface Meme {
  id: string;
  url: string;
  name: string;
}

interface MemeListProps {
  memes: Meme[];
}

const MemeList = ({ memes }: MemeListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {memes.map((meme) => (
        <Link key={meme.id} href={`/meme/${meme.id}`} className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          <Image src={meme.url} alt={meme.name} width={300} height={300} className="rounded-lg" />
          <h2 className="text-white text-lg font-semibold mt-2">{meme.name}</h2>
        </Link>
      ))}
    </div>
  );
};

export default MemeList;
