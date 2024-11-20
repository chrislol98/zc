import Tutorial from './tutorial.md';

export default function Page() {
  return (
    <div
      className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black 
      prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl 
      prose-h6:text-lg dark:prose-headings:text-white prose-pre:whitespace-pre-wrap pb-6"
    >
      <Tutorial />
    </div>
  );
}
