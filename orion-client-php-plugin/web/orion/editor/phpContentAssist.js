/*******************************************************************************
 * Copyright (c) 2011 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*global orion:true*/

/** @namespace */
var orion = orion || {};
orion.editor = orion.editor || {};

/**
 * @class orion.editor.PhpContentAssistProvider
 */
orion.editor.PhpContentAssistProvider = (function() {
	/** @private */
	function PhpContentAssistProvider(dojo) {
		//this._dojo = dojo;
	}
	PhpContentAssistProvider.prototype = /** @lends orion.editor.PhpContentAssistProvider.prototype */ {
		/**
		 * @param {String} The string buffer.substring(w+1, c) where c is the caret offset and w is the index of the 
		 * rightmost whitespace character preceding c.
		 * @param {String} buffer The entire buffer being edited
		 * @param {orion.editor.Selection} selection The current textView selection.
		 * @returns {dojo.Deferred} A future that will provide the keywords.
		 */
		getKeywords: function(prefix, buffer, selection) {
			var d = new dojo.Deferred();
			var cached = null;
			if (cached !== null) {
				d.resolve(cached[name] || {});
			} else {
				var that = this;
				dojo.xhrGet({
					url: "/php",
					headers: {
						"Orion-Version": "1"
					},
					content: {
						"script": buffer,
						"offset": selection.start
					},
					handleAs: "json",
					timeout: 15000,
					load: function(data, ioArgs) {
						//_cache.set(key, data);
						//that._currentPromise = null;
						d.resolve(data);
					},
					error: function(response, ioArgs) {
						if (ioArgs.xhr.status === 401) {
						//	mAuth.handleGetAuthenticationError(ioArgs.xhr, ioArgs);
						} else if (ioArgs.xhr.status === 404) {
						//	_cache.set(key, {});
						//	that._currentPromise = null;
							d.resolve({});
						} else {
						//	that._currentPromise = null;
						//	var data = _cache.get(key, true);
						//	if (data !== null) {
						//		d.resolve(data[name] || {});
						//	} else {
								d.resolve({});
						//	}
						}
					}
				});
			}

			return d;
		}
	};
	return PhpContentAssistProvider;
}());

if (typeof window !== "undefined" && typeof window.define !== "undefined") {
	define([], function() {
		return orion.editor;
	});
}
