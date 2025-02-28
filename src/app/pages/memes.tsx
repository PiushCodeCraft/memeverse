// pages/memes.tsx

import { GetServerSideProps } from 'next'
import Link from 'next/link'

interface Meme {
  id: string;
  title: string;
}

interface MemeListProps {
  memes: Meme[];
}

const MemeList = ({ memes }: MemeListProps) => {
  return (
    <div>
      <h1>All Memes</h1>
      {memes.map((meme) => (
        <div key={meme.id}>
          <h2>{meme.title}</h2>
          <Link href={`/meme/${meme.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  )
}

export default MemeList

// Sample GetServerSideProps to fetch memes (replace with actual data fetching)
export const getServerSideProps: GetServerSideProps = async () => {
  // Simulated meme data
  const memes = [
    { id: '1', title: 'Funny Meme 1' },
    { id: '2', title: 'Funny Meme 2' },
    { id: '3', title: 'Funny Meme 3' },
  ]

  return {
    props: {
      memes,
    },
  }
}
