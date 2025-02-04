# Extractor

> Extractor gives you access to the Collected Assets obtained during your Runner execution.

The Extractor class is passed into the `extract` function provided to a Databox. It cannot be constructed

## Properties

### action

Readonly action. Not currently in use. Relates to multi-purpose scripts.

#### **Returns** `string`.

### collectedElements

CollectedElements object providing access to all elements with `$extractLater` called from this script.

#### **Returns** [`CollectedElements`](/docs/databox/advanced/collected-elements)

### collectedResources

CollectedResources object providing access to all resources collected from this script.

#### **Returns** [`CollectedResources`](/docs/databox/advanced/collected-resources)

### collectedSnippets

CollectedSnippets object providing access to all snippets collected from this script.

#### **Returns** [`CollectedSnippets`](/docs/databox/advanced/collected-snippets)

### input

Readonly input.

#### **Returns** [`Input`](/docs/databox/advanced/input)

### output

Get or set the output data.

#### **Returns** [`Output`](/docs/databox/advanced/output)

### sessionId

Readonly unique sessionId for this Session.

#### **Returns** `Promise<string>`
