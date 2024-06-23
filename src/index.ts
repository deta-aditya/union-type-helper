const exampleType = `
  export type Result =
    | { kind: 'ok'; value: Record<string, unknown> }
    | { kind: 'err'; value: string };
`;
