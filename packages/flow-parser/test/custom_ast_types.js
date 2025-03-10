/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import typesPlugin from "ast-types/lib/types";
import sharedPlugin from "ast-types/lib/shared";

export default function (fork) {
  const {Type: {def, or}} = fork.use(typesPlugin);
  const shared = fork.use(sharedPlugin);
  const defaults = shared.defaults;

  /////////
  // flow
  /////////
  def("ObjectTypeIndexer")
    .field("id", or(def("Identifier"), null));

  def("IndexedAccessType")
    .bases("FlowType")
    .build("objectType", "indexType")
    .field("objectType", def("FlowType"))
    .field("indexType", def("FlowType"));

  def("OptionalIndexedAccessType")
    .bases("FlowType")
    .build("objectType", "indexType", "optional")
    .field("objectType", def("FlowType"))
    .field("indexType", def("FlowType"))
    .field("optional", Boolean);

  // See https://github.com/benjamn/ast-types/issues/180
  def("ExportNamedDeclaration")
    // TODO: this is non-standard, upstream is standard
    .field("specifiers", [or(
        def("ExportSpecifier"),
        def("ExportNamespaceSpecifier")
      )], defaults.emptyArray)
    .field("exportKind", or("type", "value"));

  def("ExportAllDeclaration")
    .field("exported", undefined) // Remove field from upstream, we don't support it yet (ES2020)
    .field("exportKind", or("type", "value"));

  // See https://github.com/benjamn/ast-types/issues/180
  def("ExportNamespaceSpecifier")
    .bases("Specifier")
    .build("exported")
    .field("exported", def("Identifier"));

  /////////
  // es2018
  /////////
  def("ObjectPattern")
    .field("properties", [or(def("Property"), def("PropertyPattern"), def("RestElement"))]);

  /////////
  // es2020
  /////////
  def("BigIntLiteral")
    .bases("Literal")
    .build("bigint")
    .field("bigint", String);

  /////////
  // es2022
  /////////
  def("PrivateIdentifier")
    .bases("Expression", "Pattern")
    .field("name", String);

  def("PropertyDefinition")
    .bases("ClassProperty");

  def("ClassBody")
    .field("body", [or(def("MethodDefinition"), def("PropertyDefinition"))]);
}
