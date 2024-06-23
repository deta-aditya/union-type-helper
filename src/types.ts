// ======================
// Generic Helper Types
// ======================

export type Result<T, U> =
  | { kind: 'ok', value: T } 
  | { kind: 'err', value: U };

export type Ok = <T, U>(value: T) => Result<T, U>;
export type Err = <T, U>(value: U) => Result<T, U>;
export type MapResult = <T, U, V>(mapper: (okValue: T) => U, result: Result<T, V>) 
  => Result<U, V>;
export type BindResult = <T, U, V>(binder: (okValue: T) => Result<U, V>, result: Result<T, V>)
  => Result<U, V>;

export type Curry2 = <T, U, V>(fn: (param1: T, param2: U) => V) 
  => (param1: T) => (param2: U) => V;

// ======================
// Domain Models
// ======================

export type PlainUnionType = string;

export type PlainHelpedUnionType = string;

export type PlainUnionTypeHelper = string;

type Token = 
  | { kind: 'export-token' }
  | { kind: 'type-alias-token' }
  | { kind: 'identifier-token', value: string }
  | { kind: 'assignment-token' }
  | { kind: 'union-bar-token' }
  | { kind: 'object-open-token' }
  | { kind: 'key-token' }
  | { kind: 'string-literal-token', value: string }

export type TypeScriptTypeAst = 
  | { kind: 'export-ast'; value: ExportAst }
  | { kind: 'type-alias-ast'; value: AliasAst };

type ExportAst = {
  child: AliasAst;
}

type AliasAst = {
  name: TypeName;
  child: UnionAst;
};

type UnionAst = {
  cases: Array<ObjectAst>;
};

type ObjectAst = {
  fields: Array<FieldAst>;
};

type FieldAst = {
  key: TypeKey;
  value: TypeAst;
};

type TypeAst = 
  | { kind: 'literal-ast', value: string }
  | { kind: 'reference-ast', value: TypeName }
  | { kind: 'object-ast', value: ObjectAst };

export type ParsedUnionType = {
  ast: TypeScriptTypeAst;
};

export type TypeName = string;

export type TypeKey = string;

export type UnionTypeHelper = {
  typeConstructors: Array<FunctionType>;
  typeAssertors: Array<FunctionType>;
  typeMatcher: FunctionType;
};

export type FunctionType = {
  name: VarName;
  parameters: Map<VarName, TypeName>;
  returnValue: TypeName;
  body: FunctionBody;
}

export type VarName = string;

export type FunctionBody = string;

export type ErrorMessage = string;

// ======================
// Domain Workflows
// ======================

export type LexTypeString = (input: PlainUnionType) => Array<Token>;

export type GenerateHelpers = (input: ParsedUnionType) => UnionTypeHelper;

export type DeserializeHelpers = (helper: UnionTypeHelper) => PlainUnionTypeHelper;

export type JoinPlainUnionAndHelper = (union: PlainUnionType, helper: PlainUnionTypeHelper) => PlainHelpedUnionType;

// ======================
// Main Workflow
// ======================

export type UnionHelper = (input: PlainUnionType) => Result<PlainHelpedUnionType, ErrorMessage>;
