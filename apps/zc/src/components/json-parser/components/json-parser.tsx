import {
  useJsonManager,
  useJsonManagerContext,
  Json,
  JsonManagerContext,
} from '../core';
interface JsonParserProps {
  data: Json[];
}

export default function JsonParser({ data }: JsonParserProps) {
  const jsonManager = useJsonManager(data);
  return (
    <JsonManagerContext.Provider value={jsonManager}>
      <JsonParserImpl />
    </JsonManagerContext.Provider>
  );
}

function JsonParserImpl() {
  const jsonManager = useJsonManagerContext();
  return <div>JsonParserImpl</div>;
}
