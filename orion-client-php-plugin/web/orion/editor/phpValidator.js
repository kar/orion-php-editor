/*******************************************************************************
 * Copyright (c) 2011 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *     Karol Gusak
 *******************************************************************************/
/*global orion:true*/

/** @namespace */
var orion = orion || {};
orion.editor = orion.editor || {};

/**
 * @class orion.editor.PhpValidatorProvider
 */
orion.editor.PhpValidatorProvider = (function() {
	/** @private */
	function PhpValidatorProvider(dojo) {

	}
	PhpValidatorProvider.prototype = /** @lends orion.editor.PhpValidatorProvider.prototype */ {
		checkSyntax: function(title, contents) {
			var d = new dojo.Deferred();

			var that = this;
			dojo.xhrGet({
				url: "/php/codevalidation/",
				headers: {
					"Orion-Version": "1"
				},
				content: {
					"script": contents,
				},
				handleAs: "json",
				timeout: 15000,
				load: function(data, ioArgs) {
					d.resolve({errors: data});
				},
				error: function(response, ioArgs) {
					d.resolve({errors: []});
				}
			});

			return d;
		}
	};

	return PhpValidatorProvider;
}());

if (typeof window !== "undefined" && typeof window.define !== "undefined") {
	define([], function() {
		return orion.editor;
	});
}
