import { BindResult, Curry2, Err, MapResult, Ok, UnionHelper } from "./types";

// ======================
// Generic Helper Types
// ======================

export const ok: Ok = (value) => {
  return { kind: 'ok', value };
};

export const err: Err = (value) => {
  return { kind: 'err', value };
};

export const mapResult: MapResult = (mapper, result) => {
  if (result.kind === 'ok') {
    return ok(mapper(result.value));
  }
  return result;
};

export const bindResult: BindResult = (binder, result) => {
  if (result.kind === 'ok') {
    return binder(result.value);
  }
  return result;
}

export const curry2: Curry2 = fn => p1 => p2 => fn(p1, p2);

// ======================
// Domain Workflows
// ======================



// export const parseStringInput: ParseStringInput = (input) => {
//   const withoutMultilines = input.replace(/\n/g, '');
//   const withoutTabs = withoutMultilines.replace(/\s+/g, ' ').trim();
//   const withoutHeadingBar = withoutTabs.replace(/=\s\|/, '=');

//   type UnvalidatedParsedCase = {
//     kind: 'parsing';
//   } | {
//     kind: 'parsed';
//     discriminator: LiteralValue;
//     valueType: TypeOfValue;
//   };

//   type UnvalidatedParsedUnionType = {
//     exported: boolean;
//     name: {
//       kind: 'unknown';
//     } | {
//       kind: 'parsing';
//     } | {
//       kind: 'parsed';
//       value: TypeName;
//     };
//     cases: {
//       kind: 'unknown';
//     } | {
//       kind: 'defined';
//       value: Array<UnvalidatedParsedCase>;
//     };
//   };

//   const parsed = withoutHeadingBar.split(/\s/).reduce((parsedUnion, token) => {
//     if (token === 'export') {
//       return { ...parsedUnion, exported: true };
//     }

//     if (token === 'type') {
//       return { ...parsedUnion, name: { kind: 'parsing' as const } };
//     }

//     if (token === '=') {
//       return { 
//         ...parsedUnion, 
//         cases: { 
//           kind: 'defined' as const,
//           value: [],
//         },
//       };
//     }

//     if (parsedUnion.name.kind === 'parsing') {
//       return { ...parsedUnion, name: { kind: 'parsed' as const, value: token } };
//     }

//     if (parsedUnion.cases.kind === 'defined') {

//       if (parsedUnion.cases.value.findIndex(caseValue => caseValue.kind === 'parsing')) {
//         if (token === '{') {
//           return {
//             ...parsedUnion,
//             cases: {
//               ...parsedUnion.cases,
//               value: [
//                 ...parsedUnion.cases.value,
//                 { kind: 'parsing' as const },
//               ],
//             }
//           };
//         }

//         // Error!
//       }

//       if (token === '}') {
//         return {
//           ...parsedUnion,
//           cases: {
//             ...parsedUnion.cases,
//             value: parsedUnion.cases.value.map(
//               caseValue => caseValue.kind === 'parsing' ? { ...caseValue, kind: 'parsed' } : caseValue,
//             )
//           }
//         }
//       }

//       if (token === 'kind:') {
//         return {

//         }
//       }
//     }

//     return parsedUnion;
//   }, {
//     exported: false,
//     name: { kind: 'unknown' },
//     cases: { kind: 'unknown' },
//   } as UnvalidatedParsedUnionType);
// };

export const unionHelper: UnionHelper = (input) => {
  const curriedJoinPlainUnionAndHelper = curry2(joinPlainUnionAndHelper)(input);

  const parsedResult = parseStringInput(input);
  const unionTypeHelpers = mapResult(generateHelpers, parsedResult);
  const plainHelpers = mapResult(deserializeHelpers, unionTypeHelpers);
  const finalResult = mapResult(curriedJoinPlainUnionAndHelper, plainHelpers);

  return finalResult;
};
