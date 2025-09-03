/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */
var Prism = (function (_self) {

	// Private helper vars
	var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
	var uniqueId = 0;

	// The grammar store for languages
	var languages = {};

	var Prism = {
		/**
		 * A map of language names to their definitions.
		 *
		 * @type {Object<string, LanguageDef>}
		 * @public
		 */
		languages: languages,
		/**
		 * A map of language names to their extended definitions.
		 *
		 * @type {Object<string, LanguageDef>}
		 * @public
		 */
		plugins: {},

		/**
		 * This is the most high-level function in Prism’s API.
		 *
		 * It fetches code via AJAX or reads it from the DOM and highlights it depending on
		 * the language it’s supposed to be in.
		 *
		 * This method returns a Promise which is resolved when the highlighting is done.
		 *
		 * @param {Element} [container=document] The element or container specificity selector.
		 * You may use `document` for the whole document.
		 * @param {boolean} [async=false] Whether the highlighting should be asynchronous.
		 * @returns {Promise<void>}
		 * @public
		 */
		highlightAll: function (async, callback) {
			Prism.highlightAllUnder(document, async, callback);
		},

		/**
		 * Fetches code via AJAX or reads it from the DOM and highlights it depending on
		 * the language it’s supposed to be in.
		 *
		 * This method returns a Promise which is resolved when the highlighting is done.
		 *
		 * @param {Element} container The element or container specificity selector.
		 * @param {boolean} [async=false] Whether the highlighting should be asynchronous.
		 * @returns {Promise<void>}
		 * @public
		 */
		highlightAllUnder: function (container, async, callback) {
			var env = {
				callback: callback,
				container: container,
				selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
			};

			Prism.hooks.run('before-highlightall', env);

			env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

			Prism.hooks.run('before-all-elements-highlight', env);

			for (var i = 0, element; (element = env.elements[i++]);) {
				Prism.highlightElement(element, async === true, env.callback);
			}
		},

		/**
		 * Highlights the code inside a single element.
		 *
		 * @param {Element} element The element containing the code.
		 * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
		 * @param {boolean} [async=false] Whether the highlighting should be asynchronous.
		 * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
		 * Rather than passing a callback here, you can use hooks.
		 * @returns {Promise<void>|void}
		 * @public
		 */
		highlightElement: function (element, async, callback) {
			// Find language
			var language = Prism.util.getLanguage(element);
			var grammar = languages[language];

			// Set language on the element, if not present
			element.className = element.className.replace(lang, ' ').trim() + ' language-' + language;

			// Set language on the parent, for styling
			var parent = element.parentElement;
			if (parent && parent.nodeName.toLowerCase() === 'pre') {
				parent.className = parent.className.replace(lang, ' ').trim() + ' language-' + language;
			}

			var code = element.textContent;

			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};

			function insertHighlightedCode(highlightedCode) {
				env.highlightedCode = highlightedCode;

				Prism.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				Prism.hooks.run('after-highlight', env);
				Prism.hooks.run('complete', env);
				callback && callback.call(env.element);
			}

			Prism.hooks.run('before-sanity-check', env);

			// plugins may change the grammar or the language and thus the grammar
			// may be non-existent from here on out
			grammar = env.grammar;

			if (!grammar) {
				if (async) {
					insertHighlightedCode(Prism.util.encode(env.code));
				}
				Prism.hooks.run('complete', env);
				return;
			}

			Prism.hooks.run('before-highlight', env);

			if (async) {
				setTimeout(function () {
					var highlighted = Prism.highlight(env.code, grammar, env.language);
					insertHighlightedCode(highlighted);
				}, 0);
			} else {
				var highlighted = Prism.highlight(env.code, grammar, env.language);
				insertHighlightedCode(highlighted);
			}
		},

		/**
		 * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
		 * and an object with defined token patterns and returns their HTML markup.
		 *
		 * @param {string} text A string with the code to be highlighted.
		 * @param {LanguageDef} grammar An object containing the tokens to use.
		 * @returns {string} The highlighted HTML markup.
		 * @public
		 */
		highlight: function (text, grammar, language) {
			var env = {
				code: text,
				grammar: grammar,
				language: language
			};
			Prism.hooks.run('before-tokenize', env);
			env.tokens = Prism.tokenize(env.code, env.grammar);
			Prism.hooks.run('after-tokenize', env);
			return Token.stringify(Prism.util.encode(env.tokens), env.language);
		},

		/**
		 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
		 * and an object with defined token patterns and returns an array of tokens.
		 *
		 * @param {string} text A string with the code to be highlighted.
		 * @param {LanguageDef} grammar An object containing the tokens to use.
		 * @returns {(string|Token)[]} The array of tokens.
		 * @public
		 */
		tokenize: function (text, grammar) {
			var rest = grammar.rest;
			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}

				delete grammar.rest;
			}

			var tokenList = new LinkedList();
			addAfter(tokenList, tokenList.head, text);

			matchGrammar(text, tokenList, grammar, tokenList.head, 0);

			return toArray(tokenList);
		},

		/**
		 * @namespace
		 * @public
		 */
		hooks: {
			all: {},

			/**
			 * Adds the given callback to the list of callbacks for the given hook.
			 *
			 * The callback will be invoked when the hook it is registered for is run.
			 * Hooks are usually directly run by a highlight function but you can also run them yourself.
			 *
			 * One callback function can be registered to multiple hooks and the same hook multiple times.
			 *
			 * @param {string} name The name of the hook.
			 * @param {HookCallback} callback The callback function which is given environment data.
			 * @public
			 */
			add: function (name, callback) {
				var hooks = Prism.hooks.all;

				hooks[name] = hooks[name] || [];

				hooks[name].push(callback);
			},

			/**
			 * Runs a hook invoking all registered callbacks with the given environment data.
			 *
			 * @param {string} name The name of the hook.
			 * @param {Object<string, any>} env The environment data for the hook functions.
			 * @public
			 */
			run: function (name, env) {
				var callbacks = Prism.hooks.all[name];

				if (!callbacks || !callbacks.length) {
					return;
				}

				for (var i = 0, callback; (callback = callbacks[i++]);) {
					callback(env);
				}
			}
		},

		/**
		 * @namespace
		 * @public
		 */
		util: {
			/**
			 * Escapes all HTML characters in the given text.
			 *
			 * @param {string} text
			 * @returns {string}
			 */
			encode: function (tokens) {
				if (tokens instanceof Token) {
					return new Token(tokens.type, Prism.util.encode(tokens.content), tokens.alias);
				} else if (Array.isArray(tokens)) {
					return tokens.map(Prism.util.encode);
				} else {
					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
				}
			},

			/**
			 * Determines the language of the given element.
			 *
			 * @param {Element} element
			 * @returns {string}
			 */
			getLanguage: function (element) {
				var i = 0;
				while (element && i < 3 && !lang.test(element.className)) {
					element = element.parentElement;
					i++;
				}
				if (element) {
					var match = element.className.match(lang);
					if (match) {
						return match[1].toLowerCase();
					}
				}
				return 'none';
			},

			/**
			 * Returns whether a given class is present on a given element.
			 *
			 * @param {Element} element
			 * @param {string} className
			 * @returns {boolean}
			 */
			isActive: function (element, className, defaultActivation) {
				var classes = ' ' + element.className + ' ';

				if (classes.indexOf(' ' + className + ' ') > -1) {
					return true;
				}
				if (defaultActivation === false) {
					return false;
				}
				// check if an ancestor has the class
				var parent = element.parentElement;
				if (parent && parent.nodeType === 1) { // 1 is ELEMENT_NODE
					return Prism.util.isActive(parent, className, defaultActivation);
				}
				return false;
			},
		}
	};
