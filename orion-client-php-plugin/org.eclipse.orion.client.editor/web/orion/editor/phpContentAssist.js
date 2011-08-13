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
 * @class orion.editor.PhpContentAssistProvider
 */
orion.editor.PhpContentAssistProvider = (function() {
	/** @private */
	function PhpContentAssistProvider(dojo) {

	}
	PhpContentAssistProvider.prototype = /** @lends orion.editor.PhpContentAssistProvider.prototype */ {
		/**
		 * Note: a temporary hack has been applied - this method uses selection.offset argument which is not
		 * available by default, but was added in my modification of contentAssist.js, as the start and end
		 * fields are not updated correctly in some cases.
		 * 
		 * @param {String} The string buffer.substring(w+1, c) where c is the caret offset and w is the index of the 
		 * rightmost whitespace character preceding c.
		 * @param {String} buffer The entire buffer being edited
		 * @param {orion.editor.Selection} selection The current textView selection.
		 * @returns {dojo.Deferred} A future that will provide the keywords.
		 */
		getKeywords: function(prefix, buffer, selection) {
			var offset = selection.offset;
			var d = new dojo.Deferred();
			// Dont use cache for now
//			var cached = _cache.get(key);
			var cached = null;
			if (cached !== null) {
				d.resolve(cached);
			} else {
				var that = this;
				dojo.xhrPost({
					url: "/php/contentassist/",
					headers: {
						"Orion-Version": "1"
					},
					content: {
						"script": buffer,
						"offset": offset,
						"prefix": prefix
					},
					handleAs: "json",
					timeout: 15000,
					load: function(data, ioArgs) {
//						_cache.set(key, data);
						d.resolve(data);
					},
					error: function(response, ioArgs) {
//						var data = _cache.get(key, true);
						if (data !== null) {
							d.resolve(data);
						} else {
							d.resolve({});
						}
					}
				});
			}

			return d;
		}
	};

	var _cache = {
			get: function(key, ignoreExpires) {
				var item = localStorage.getItem(key);
				if (item == null) {
					return null;
				}
				var cached = JSON.parse(item);
				if (ignoreExpires || (cached.expires && cached.expires > new Date().getTime())) {
					return cached.data;
				}
				return null;
			},
			set: function(key, dataToCache) {
				var cached = {
					data: dataToCache,
					expires: new Date().getTime() + (1000*60*60), // expire every hour
				};

				var jsonData = JSON.stringify(cached);
				localStorage.setItem(key, jsonData);
			}
	};

	return PhpContentAssistProvider;
}());

if (typeof window !== "undefined" && typeof window.define !== "undefined") {
	define([], function() {
		return orion.editor;
	});
}
