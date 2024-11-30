import { JsonManagerContext } from '../core/contexts';
import { useJsonManager } from '../core/hooks/use-json-manager';
import { useJsonManagerContext } from '../core/hooks/use-json-manager-context';

export default function JsonParser() {
  const jsonManager = useJsonManager();
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
