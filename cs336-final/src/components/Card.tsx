import React from "react";

type Props = {
  index: number;
  match: {
    id: string;
    score: any;
    metadata: any;
  };
};

export default function Card({ index, match }: Props) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg hover:shadow-lg shadow-md flex flex-col h-full">
      <div className="flex min-h-[40px] justify-between w-full mb-2 gap-4">
        <p className="text-lg font-medium">
          {index + 1}. {match.metadata.title}
        </p>
        <p className="p-1 px-2 bg-red-200 rounded-lg text-nowrap h-fit">
          Score: {match.score.toString().slice(0, 6)}...
        </p>
      </div>
      <div className="h-[1px] w-full bg-gray-400 px-4"></div>
      <p className="text-gray-600 mb-2">{match.metadata.description}</p>
      <p className="text-sm text-gray-500">
        <strong>Author:</strong> {match.metadata.author_name} (
        {match.metadata.author_username})
      </p>
      <a
        href={match.metadata.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline mt-2 inline-block flex-1"
      >
        Read more
      </a>
    </div>
  );
}
