/******************************************************************************* 
 * Copyright (c) 2011 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 * 
 * Contributors: IBM Corporation - initial API and implementation 
 ******************************************************************************/

/*jslint */
/*global orion:true*/

var orion = orion || {};

orion.editor = orion.editor || {};

/**
 * Uses a grammar to provide some very rough syntax highlighting for HTML.
 * @class orion.syntax.HtmlGrammar
 */
orion.editor.HtmlGrammar = (function() {
	var _fileTypes = [ "html", "htm", "php" ];
	return {
		/**
		 * What kind of highlight provider we are.
		 * @public
		 * @type "grammar"|"parser"
		 */
		type: "grammar",
		
		/**
		 * The file extensions that we provide rules for.
		 * @public
		 * @type String[]
		 */
		fileTypes: _fileTypes,
		
		/**
		 * Object containing the grammar rules.
		 * @public
		 * @type JSONObject
		 */
		grammar: {
			"comment": "HTML syntax rules",
			"name": "HTML",
			"fileTypes": _fileTypes,
			"scopeName": "source.html",
			"uuid": "3B5C76FB-EBB5-D930-F40C-047D082CE99B",
			"patterns": [
				// TODO unicode?
				{
					"match": "<!(doctype|DOCTYPE)[^>]+>",
					"name": "entity.name.tag.doctype.html"
				},
				{
					"begin": "<!--",
					"end": "-->",
					"beginCaptures": {
						"0": { "name": "punctuation.definition.comment.html" }
					},
					"endCaptures": {
						"0": { "name": "punctuation.definition.comment.html" }
					},
					"patterns": [
						{
							// For testing nested subpatterns
							"match": "--",
							"name": "invalid.illegal.badcomment.html"
						}
					],
					"contentName": "comment.block.html"
				},
				{ // startDelimiter + tagName
					"match": "<[A-Za-z0-9_\\-:]+(?= ?)",
					"name": "entity.name.tag.html"
				},
				{ "include": "#attrName" },
				{ "include": "#qString" },
				{ "include": "#qqString" },
				// TODO attrName, qString, qqString should be applied first while inside a tag
				{ // startDelimiter + slash + tagName + endDelimiter
					"match": "</[A-Za-z0-9_\\-:]+>",
					"name": "entity.name.tag.html"
				},
				{ // end delimiter of open tag
					"match": ">", 
					"name": "entity.name.tag.html"
				},
				// Inline PHP code blocks
				{
					"begin": "<\\?(php|=)?",
					"end": "(\\?)>",
					"beginCaptures": {
						"0": { "name": "punctuation.section.embedded.begin.php" }
					},
					"endCaptures": {
						"0": { "name": "punctuation.section.embedded.end.php" }
					},
					"patterns": [
						{
							"include": "source.php"
						}
					],
					"contentName": "comment.block.php"
				} ],
			"repository": {
				"attrName": { // attribute name
					"match": "[A-Za-z\\-:]+(?=\\s*=\\s*['\"])",
					"name": "entity.other.attribute.name.html"
				},
				"qqString": { // double quoted string
					"match": "(\")[^\"]+(\")",
					"name": "string.quoted.double.html"
				},
				"qString": { // single quoted string
					"match": "(')[^']+(\')",
					"name": "string.quoted.single.html"
				}
			}
		}
	};
}());

if (typeof window !== "undefined" && typeof window.define !== "undefined") {
	define([], function() {
		return orion.editor;
	});
}
