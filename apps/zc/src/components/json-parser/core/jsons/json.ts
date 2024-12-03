export class Json {
  key: 'form';
  id: string | number;
  children?: Json[];
  constructor(params: {
    key: Json['key'];
    id: Json['id'];
    children?: Json['children'];
  }) {
    this.key = params.key;
    this.id = params.id;
    this.children = params.children;
  }
}

