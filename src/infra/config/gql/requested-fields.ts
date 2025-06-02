import {
  DirectiveNode,
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  Kind,
  SelectionNode,
  ValueNode,
} from 'graphql';

const getBooleanArgumentValue = (
  info: GraphQLResolveInfo,
  directive: DirectiveNode,
): boolean => {
  const argument: ValueNode | undefined = directive.arguments?.[0]?.value;

  switch (argument?.kind) {
    case Kind.BOOLEAN:
      return argument.value;
    case Kind.VARIABLE:
      return info.variableValues[argument.name.value] as boolean;
    default:
      return false;
  }
};

const isExcludedByDirective = (
  info: GraphQLResolveInfo,
  ast: SelectionNode,
): boolean => {
  const directives: readonly DirectiveNode[] = ast.directives ?? [];
  let isExcluded = false;

  directives.forEach((directive) => {
    const directiveName = directive.name.value;
    if (directiveName === 'include') {
      isExcluded = isExcluded || !getBooleanArgumentValue(info, directive);
    } else if (directiveName === 'skip') {
      isExcluded = isExcluded || getBooleanArgumentValue(info, directive);
    }
  });

  return isExcluded;
};

const dotConcat = (a: string, b: string): string => (a ? `${a}.${b}` : b);

type FieldSet = Record<string, true>;

const getFieldSet = (
  info: GraphQLResolveInfo,
  asts:
    | readonly SelectionNode[]
    | FieldNode
    | FragmentDefinitionNode = info.fieldNodes,
  prefix = '',
  maxDepth?: number,
): FieldSet => {
  const selectionNodes = Array.isArray(asts) ? asts : [asts];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const selections: readonly SelectionNode[] = selectionNodes.reduce(
    (acc: SelectionNode[], source: SelectionNode) => {
      if ('selectionSet' in source && source?.selectionSet?.selections) {
        acc.push(...source.selectionSet.selections);
      }
      return acc;
    },
    [],
  );

  return selections.reduce((set: FieldSet, ast: SelectionNode) => {
    if (isExcludedByDirective(info, ast)) {
      return set;
    }

    switch (ast.kind) {
      case Kind.FIELD: {
        const newPrefix = dotConcat(prefix, ast.name.value);
        if (ast.selectionSet && (maxDepth === undefined || maxDepth > 1)) {
          return {
            ...set,
            ...getFieldSet(
              info,
              ast.selectionSet.selections,
              newPrefix,
              maxDepth ? maxDepth - 1 : undefined,
            ),
          };
        }
        set[newPrefix] = true;
        return set;
      }
      case Kind.INLINE_FRAGMENT:
        return {
          ...set,
          ...getFieldSet(info, ast.selectionSet.selections, prefix, maxDepth),
        };
      case Kind.FRAGMENT_SPREAD:
        return {
          ...set,
          ...getFieldSet(
            info,
            info.fragments[ast.name.value],
            prefix,
            maxDepth,
          ),
        };
    }
  }, {});
};

export const getFieldList = (
  info: GraphQLResolveInfo,
  maxDepth: number = Number.MAX_SAFE_INTEGER,
): string[] => Object.keys(getFieldSet(info, info.fieldNodes, '', maxDepth));
