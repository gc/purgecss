var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/VariablesStructure.ts
var VariableNode = class {
  constructor(declaration) {
    this.nodes = [];
    this.isUsed = false;
    this.value = declaration;
  }
  static {
    __name(this, "VariableNode");
  }
};
var VariablesStructure = class {
  constructor() {
    this.nodes = /* @__PURE__ */ new Map();
    this.usedVariables = /* @__PURE__ */ new Set();
    this.safelist = [];
  }
  static {
    __name(this, "VariablesStructure");
  }
  addVariable(declaration) {
    const { prop } = declaration;
    if (!this.nodes.has(prop)) {
      const node = new VariableNode(declaration);
      this.nodes.set(prop, [node]);
    } else {
      const node = new VariableNode(declaration);
      const variableNodes = this.nodes.get(prop) || [];
      this.nodes.set(prop, [...variableNodes, node]);
    }
  }
  addVariableUsage(declaration, matchedVariables) {
    const { prop } = declaration;
    const nodes = this.nodes.get(prop);
    for (const variableMatch of matchedVariables) {
      const variableName = variableMatch[1];
      if (this.nodes.has(variableName)) {
        const usedVariableNodes = this.nodes.get(variableName);
        nodes?.forEach((node) => {
          usedVariableNodes?.forEach(
            (usedVariableNode) => node.nodes.push(usedVariableNode)
          );
        });
      }
    }
  }
  addVariableUsageInProperties(matchedVariables) {
    for (const variableMatch of matchedVariables) {
      const variableName = variableMatch[1];
      this.usedVariables.add(variableName);
    }
  }
  setAsUsed(variableName) {
    const nodes = this.nodes.get(variableName);
    if (nodes) {
      const queue = [...nodes];
      while (queue.length !== 0) {
        const currentNode = queue.pop();
        if (currentNode && !currentNode.isUsed) {
          currentNode.isUsed = true;
          queue.push(...currentNode.nodes);
        }
      }
    }
  }
  removeUnused() {
    for (const used of this.usedVariables) {
      const usedNodes = this.nodes.get(used);
      if (usedNodes) {
        for (const usedNode of usedNodes) {
          const usedVariablesMatchesInDeclaration = usedNode.value.value.matchAll(/var\((.+?)[,)]/g);
          for (const usage of usedVariablesMatchesInDeclaration) {
            if (!this.usedVariables.has(usage[1])) {
              this.usedVariables.add(usage[1]);
            }
          }
        }
      }
    }
    for (const used of this.usedVariables) {
      this.setAsUsed(used);
    }
    for (const [name, declarations] of this.nodes) {
      for (const declaration of declarations) {
        if (!declaration.isUsed && !this.isVariablesSafelisted(name)) {
          declaration.value.remove();
        }
      }
    }
  }
  isVariablesSafelisted(variable) {
    return this.safelist.some((safelistItem) => {
      return typeof safelistItem === "string" ? safelistItem === variable : safelistItem.test(variable);
    });
  }
};
export {
  VariableNode,
  VariablesStructure
};
//# sourceMappingURL=VariablesStructure.mjs.map
