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
/*global define dojo window*/
/*jslint maxerr:150 browser:true devel:true */

/**
 * @namespace The container for Orion APIs.
 */ 
var orion = orion || {};
orion.editor = orion.editor || {};

/**
 * A <tt>ContentAssist</tt> will look for content assist providers in the service registry (if provided).
 * Alternatively, providers can be registered directly by calling {@link #addProvider}.
 * @name orion.editor.ContentAssist
 * @class Can be attached to an Editor to display content assist suggestions.
 * @param {orion.editor.Editor} editor The Editor to provide content assist for.
 * @param {String|DomNode} contentAssistId The ID or DOMNode to use as the parent for content assist.
 * @param {orion.ServiceRegistry} [serviceRegistry] Service registry to use for looking up content assist providers.
 * If this parameter is omitted, providers must instead be registered by calling {@link #addProvider}.
 */
orion.editor.ContentAssist = (function() {
	/** @private */
	function ContentAssist(editor, contentAssistId, serviceRegistry) {
		this.editor = editor;
		this.textView = editor.getTextView();
		this.contentAssistPanel = dojo.byId(contentAssistId);
		this.active = false;
		this.prefix = "";
		this.serviceRegistry = serviceRegistry;
		this.contentAssistProviders = [];
		this.activeServiceReferences = [];
		this.activeContentAssistProviders = [];
		this.contentAssistListener = {
			onModelChanged: function(event) {
				if (!this.finishing) {
					this.showContentAssist(true, event);
				}
			},
			onScroll: function(event) {
				this.showContentAssist(false);
			}
		};

		/**
		 * An array used for storing information about proposals (with optional parameters) for current
		 * completion context. Each element looks like following object:
		 * {
		 *     proposal: "[proposal string]", // Contains parameters and/or brackets if it's a function/method, e.g. "test(a, b)"
		 *     parametersPositions: [{
		 *         offset: 10, // Offset of a start position of parameter i
		 *         length: 3  // Length of a parameter string for parameter i
		 *     }], // One object for each parameter; can be null
		 *     escapePosition: 19 // Offset of a position where the caret will be placed after exiting the Linked Mode; can be null
		 * }
		 *
		 * Please note that all offsets are counted from the beginning of the text buffer, not from the beginning of the proposal.
		 */
		this.proposalsWithParameters = [];

		this.init();
	}
	ContentAssist.prototype = /** @lends orion.editor.ContentAssist.prototype */ {
		init: function() {
			var isMac = navigator.platform.indexOf("Mac") !== -1;
			this.textView.setKeyBinding(isMac ? new orion.textview.KeyBinding(' ', false, false, false, true) : new orion.textview.KeyBinding(' ', true), "Content Assist");
			this.textView.setAction("Content Assist", dojo.hitch(this, function() {
				this.showContentAssist(true);
				return true;
			}));
			dojo.connect(this.editor, "onInputChange", this, this.inputChanged);
		},
		/** @private */
		inputChanged: function(/**String*/ fileName) {
			if (this.serviceRegistry) {
				// Filter the ServiceReferences
				this.activeServiceReferences = [];
				var serviceReferences = this.serviceRegistry.getServiceReferences("orion.edit.contentAssist");
				var serviceReference;
				dojo.forEach(serviceReferences, dojo.hitch(this, function(serviceReference) {
					var info = {};
					var propertyNames = serviceReference.getPropertyNames();
					for (var i = 0; i < propertyNames.length; i++) {
						info[propertyNames[i]] = serviceReference.getProperty(propertyNames[i]);
					}
					if (new RegExp(info.pattern).test(fileName)) {
						this.activeServiceReferences.push(serviceReference);
					}
				}));
			}
			// Filter the registered providers
			for (var i=0; i < this.contentAssistProviders.length; i++) {
				var provider = this.contentAssistProviders[i];
				if (new RegExp(provider.pattern).test(fileName)) {
					this.activeContentAssistProviders.push(provider.provider);
				}
			}
		},
		cancel: function() {
			this.showContentAssist(false);
		},
		isActive: function() {
			return this.active;
		},
		lineUp: function() {
			if (this.contentAssistPanel) {
				var selected = this.getSelected();
				if (selected === this.contentAssistPanel.firstChild) {
					this.setSelected(this.contentAssistPanel.lastChild);
				} else {
					this.setSelected(selected.previousSibling);
				}
				return true;
			}
		},
		lineDown: function() {
			if (this.contentAssistPanel) {
				var selected = this.getSelected();
				if (selected === this.contentAssistPanel.lastChild) {
					this.setSelected(this.contentAssistPanel.firstChild);
				} else {
					this.setSelected(selected.nextSibling);
				}
				return true;
			}
		},
		setSelected: function(node) {
			var nodes = this.contentAssistPanel.childNodes;
			for (var i=0; i < nodes.length; i++) {
				var child = nodes[i];
				if (child.className === "selected") {
					child.className = "";
				}
				if (child === node) {
					child.className = "selected";
				}
			}
		},
		getSelected: function() {
			var nodes = this.contentAssistPanel.childNodes;
			for (var i=0; i < nodes.length; i++) {
				if (nodes[i].className === "selected") {
					return nodes[i];
				}
			}
			return null;
		},
		/**
		 * Returns an index of selected proposal (instead of the proposal itself as in
		 * the getSelected() method. Used to retrieve the parameters' info for Linked Mode.
		 */
		getSelectedIndex: function() {
			var nodes = this.contentAssistPanel.childNodes;
			for (var i=0; i < nodes.length; i++) {
				if (nodes[i].className === "selected") {
					return i;
				}
			}
			return null;
		},
		/**
		 * Inserts the proposal selected by user into the document. Sets up the Linked Mode
		 * if parameters' information is available for the selected proposal.
		 * 
		 * Returns true when the Linked Mode doesn't need to be set up, or the proposal info
		 * if it does. The returned object is just an element from this.proposalsWithParameters.
		 */
		enter: function() {
			if (this.contentAssistPanel) {
				var proposalIndex = this.getSelectedIndex();
				if (proposalIndex === null) {
					return false;
				}

				this.finishing = true;

				var proposalInfo = this.proposalsWithParameters[proposalIndex];
				var proposal = proposalInfo.proposal;
				this.textView.setText(proposal.substring(this.prefix.length), this.textView.getCaretOffset(), this.textView.getCaretOffset());
				this.showContentAssist(false);

				if (proposalInfo.parametersPositions === null) {
					// There's no parameters' information available, so return true (acts like the default content assist)
					return true;
				} else {
					// Otherwise return the proposal info - it'll be used by SourceCodeActions in editorFeatures.js to set up the Linked Mode
					return proposalInfo;
				}
			}
		},
		click: function(e) {
			this.setSelected(e.target);
			this.enter();
			this.editor.getTextView().focus();
		},
		/**
		 * @param {Boolean} enable
		 * @param {orion.textview.ModelChangedEvent} [event]
		 */
		showContentAssist: function(enable, event) {
			if (!this.contentAssistPanel) {
				return;
			}
			function createDiv(proposal, isSelected, parent) {
				var attributes = {innerHTML: proposal};
				if (isSelected) {
					attributes.className = "selected";
				}
				dojo.create("div", attributes, parent, this);
			}
			if (!enable) {
				if (this.listenerAdded) {
					this.textView.removeEventListener("ModelChanged", this, this.contentAssistListener.onModelChanged);
					this.textView.removeEventListener("Scroll", this, this.contentAssistListener.onScroll);
					this.listenerAdded = false;
				}
				this.active = false;
				this.contentAssistPanel.style.display = "none";
				this.contentAssistPanel.onclick = null;
			} else {
				var offset = event ? (event.start + event.addedCharCount) : this.textView.getCaretOffset();
				var index = offset;
				var c;
				while (index > 0 && ((97 <= (c = this.textView.getText(index - 1, index).charCodeAt(0)) && c <= 122) || (65 <= c && c <= 90) || c === 95 || (48 <= c && c <= 57))) { //LETTER OR UNDERSCORE OR NUMBER
					index--;
				}
				
				// Show all proposals
//				if (index === offset) {
//					return;
//				}
				this.prefix = this.textView.getText(index, offset);
				
				var proposals = [],
				    buffer = this.textView.getText(),
				    selection = this.textView.getSelection();

				/**
				 * Bug/feature: The selection returned by the textView doesn't seem to be updated before notifying the listeners
				 * of onModelChanged. If the content assist is triggered by user on CTRL+SPACE, the start/end position of the
				 * selection (i.e. the caret position) is correct. But if the user then starts to type some text (in order to
				 * filter the completion proposals list by a prefix) - i.e. onModelChanged listeners are notified and, in turn,
				 * this method - the selection is not up-to-date. Because of that, I just did a simple hack of adding the offset
				 * field for selection, which is computed above and is always correct. The selection is being passed to the content
				 * assist services which return the actual list of proposals (and my service uses the offset value instead).
				 */
				selection.offset = offset;

				/**
				 * The keywords array returned by content assist services can contain element of both / either formats:
				 * - String - just a string proposal, doesn't contain any information about the parameters
				 * - Object - an object which has additional information about the parameters and escape position (for
				 *   the Linked Mode). The object has the same structure as the elements of this.proposalsWithParameters.
				 */
				this.getKeywords(this.prefix, buffer, selection).then(
					dojo.hitch(this, function(keywords) {
						this.proposalsWithParameters = [];
						var proposalIndex = 0;
						for (var i = 0; i < keywords.length; i++) {
							var proposal = keywords[i];
							if (proposal.proposal == undefined) {
								// This proposal doesn't have the parameters' information (has no proposal field, so we assume it's a string)
								if (proposal.substr(0, this.prefix.length) === this.prefix) {
									proposals.push(proposal);

									this.proposalsWithParameters[proposalIndex] = {
										proposal: proposal,
										parametersPositions: null,
										escapePosition: null,
									};
									++proposalIndex;
								}
							} else {
								// This proposal does have the parameters' information, save it
								if (proposal.proposal.substr(0, this.prefix.length) === this.prefix) {
									proposals.push(proposal.proposal);
									this.proposalsWithParameters[proposalIndex] = proposal;
									++proposalIndex;
								}
							}
						}
						if (proposals.length === 0) {
							this.showContentAssist(false);
							return;
						}
						
						var caretLocation = this.textView.getLocationAtOffset(offset);
						caretLocation.y += this.textView.getLineHeight();
						this.contentAssistPanel.innerHTML = "";
						for (i = 0; i<proposals.length; i++) {
							createDiv(proposals[i], i===0, this.contentAssistPanel);
						}
						this.textView.convert(caretLocation, "document", "page");
						this.contentAssistPanel.style.position = "absolute";
						this.contentAssistPanel.style.left = caretLocation.x + "px";
						this.contentAssistPanel.style.top = caretLocation.y + "px";
						this.contentAssistPanel.style.display = "block";
						if (!this.listenerAdded) {
							this.textView.addEventListener("ModelChanged", this, this.contentAssistListener.onModelChanged);
							this.textView.addEventListener("Scroll", this, this.contentAssistListener.onScroll);
						}
						this.listenerAdded = true;
						this.contentAssistPanel.onclick = dojo.hitch(this, this.click);
						this.active = true;
						this.finishing = false;
					}));
			}
		},
		/**
		 * @param {String} prefix A prefix against which content assist proposals should be evaluated.
		 * @param {String} buffer The entire buffer being edited.
		 * @param {orion.textview.Selection} selection The current selection from the Editor.
		 * @returns {dojo.Deferred} A future that will provide the keywords.
		 */
		getKeywords: function(prefix, buffer, selection) {
			var keywords = [];
			
			// Add keywords from directly registered providers
			dojo.forEach(this.activeContentAssistProviders, function(provider) {
				keywords = keywords.concat(provider.getKeywords() || []);
			});
			
			// Add keywords from providers registered through service registry
			var d = new dojo.Deferred();
			if (this.serviceRegistry) {
				var keywordPromises = dojo.map(this.activeServiceReferences, dojo.hitch(this, function(serviceRef) {
					return this.serviceRegistry.getService(serviceRef).then(function(service) {
						return service.getKeywords(prefix, buffer, selection);
					});
				}));
				var keywordCount = 0;
				for (var i=0; i < keywordPromises.length; i++) {
					keywordPromises[i].then(function(result) {
						keywordCount++;
						keywords = keywords.concat(result);
						if (keywordCount === keywordPromises.length) {
							d.resolve(keywords);
						}
					}, function(e) {
						keywordCount = -1;
						d.reject(e); 
					});
				}
			} else {
				d.resolve(keywords);
			}
			return d;
		},
		/**
		 * Adds a content assist provider.
		 * @param {Object} provider The provider object. See {@link orion.contentAssist.CssContentAssistProvider} for an example.
		 * @param {String} name Name for this provider.
		 * @param {String} pattern A regex pattern matching filenames that <tt>provider</tt> can offer content assist for.
		 */
		addProvider: function(provider, name, pattern) {
			this.contentAssistProviders = this.contentAssistProviders || [];
			this.contentAssistProviders.push({name: name, pattern: pattern, provider: provider});
		}
	};
	return ContentAssist;
}());

if (typeof window !== "undefined" && typeof window.define !== "undefined") {
	define(['dojo', 'orion/textview/keyBinding'], function() {
		return orion.editor;	
	});
}
