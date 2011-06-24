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
 ******************************************************************************/

/*jslint */
/*global dojo orion:true*/

var orion = orion || {};

orion.editor = orion.editor || {};

/**
 * Uses a grammar to provide syntax highlighting for PHP.<p>
 * @class orion.editor.PhpGrammar
 */
orion.editor.PhpGrammar = (function() {
	var _fileTypes = [ "php", "php4", "php3", "phtml" ];
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
			"comment": "PHP syntax rules",
			"name": "PHP",
			"fileTypes": _fileTypes,
			"scopeName": "source.php",
			"uuid": "5814BB9B-DF71-D026-B164-10478FD9E784",
			"patterns": [
				// PHP tags
				{
					"match": "<\\?(php|=)?",
					"name": "punctuation.section.embedded.begin.php"
				},
				{
					"match": "(\\?)>",
					"name": "punctuation.section.embedded.end.php"
				},
				// Comments (single-line)
				{
					"match": "(//).*?($\\n?|(?=\\?>))",
					"name": "comment.block.php"
				},
				{
					"match": "(#).*?($\\n?|(?=\\?>))",
					"name": "comment.block.php"
				},
				// PHPDoc
				{
					"begin": "/\\*\\*\\s*$",
					"end": "\\*/",
					"beginCaptures": {
						"0": { "name": "punctuation.definition.comment.php" }
					},
					"endCaptures": {
						"0": { "name": "punctuation.definition.comment.php" }
					},
					"patterns": [
						{
							"match": "\\@(a(bstract|uthor)|c(ategory|opyright)|example|global|internal|li(cense|nk)|pa(ckage|ram)|return|s(ee|ince|tatic|ubpackage)|t(hrows|odo)|v(ar|ersion)|uses|deprecated|final)\\b",
							"name": "keyword.other.phpdoc.php"
						}
					],
					"contentName": "comment.block.php"
				},
				// Comments (multi-line)
				{
					"begin": "/\\*",
					"end": "\\*/",
					"beginCaptures": {
						"0": { "name": "punctuation.definition.comment.php" }
					},
					"endCaptures": {
						"0": { "name": "punctuation.definition.comment.php" }
					},
					"contentName": "comment.block.php"
				},
				// Strings (with interpolation)
				{
					"begin": "\"",
					"end": "\"",
					"beginCaptures": {
						"0": { "name": "punctuation.definition.string.begin.php" }
					},
					"endCaptures": {
						"0": { "name": "punctuation.definition.string.end.php" }
					},
					"patterns": [
						{
							"match": "\\\\[0-7]{1,3}",
							"name": "constant.numeric.octal.php"
						},
						{
							"match": "\\\\x[0-9A-Fa-f]{1,2}",
							"name": "constant.numeric.hex.php"
						},
						{
							"match": "\\\\[nrt\\\\\\$\\\"]",
							"name": "constant.character.escape.php"
						},
						{
							"match": "((\\$+)[a-zA-Z_\\x7f-\\xff][a-zA-Z0-9_\\x7f-\\xff]*)",
							"name": "variable.other.php"
						},
					],
					"contentName": "string.quoted.double.php"
				},
				{
					"match": "(')[^']+(')",
					"name": "string.quoted.single.php"
				},
				{
					"match": "(`)[^`]+(`)",
					"name": "string.interpolated.php"
				},
				// Variables
				{
					"match": "(\\$)((_(COOKIE|FILES|GET|POST|REQUEST))|arg(v|c))\\b",
					"name": "variable.other.global.php"
				},
				{
					"match": "(\\$)((GLOBALS|_(ENV|SERVER|SESSION)))",
					"name": "variable.other.global.safer.php"
				},
				{
					"match": "((\\$+)[a-zA-Z_\\x7f-\\xff][a-zA-Z0-9_\\x7f-\\xff]*)",
					"name": "variable.other.php"
				},
				// Constants
				{
					"match": "\\b(TRUE|FALSE|NULL|__(FILE|DIR|FUNCTION|CLASS|METHOD|LINE|NAMESPACE)__|ON|OFF|YES|NO|NL|BR|TAB)\\b",
					"name": "constant.language.php",
					"flags": "i"
				},
				{
					"match": "(\\\\)?\\b(DEFAULT_INCLUDE_PATH|E_(ALL|COMPILE_(ERROR|WARNING)|CORE_(ERROR|WARNING)|(RECOVERABLE_)?ERROR|NOTICE|PARSE|STRICT|USER_(ERROR|NOTICE|WARNING|DEPRECATED)|WARNING|DEPRECATED)|PEAR_(EXTENSION_DIR|INSTALL_DIR)|PHP_(BINDIR|CONFIG_FILE_PATH|DATADIR|E(OL|XTENSION_DIR)|L(IBDIR|OCALSTATEDIR)|O(S|UTPUT_HANDLER_CONT|UTPUT_HANDLER_END|UTPUT_HANDLER_START)|SYSCONFDIR|VERSION))\\b",
					"name": "support.constant.core.php",
					"flags": "i"
				},
				{
					"match": "(\\\\)?\\b(A(B(DAY_([1-7])|MON_([0-9]{1,2}))|LT_DIGITS|M_STR|SSERT_(ACTIVE|BAIL|CALLBACK|QUIET_EVAL|WARNING))|C(ASE_(LOWER|UPPER)|HAR_MAX|O(DESET|NNECTION_(ABORTED|NORMAL|TIMEOUT)|UNT_(NORMAL|RECURSIVE))|REDITS_(ALL|DOCS|FULLPAGE|GENERAL|GROUP|MODULES|QA|SAPI)|RNCYSTR|RYPT_(BLOWFISH|EXT_DES|MD5|SALT_LENGTH|STD_DES)|URRENCY_SYMBOL)|D(AY_([1-7])|ECIMAL_POINT|IRECTORY_SEPARATOR|_(FMT|T_FMT))|E(NT_(COMPAT|NOQUOTES|QUOTES)|RA(|_D_FMT|_D_T_FMT|_T_FMT|_YEAR)|XTR_(IF_EXISTS|OVERWRITE|PREFIX_(ALL|IF_EXISTS|INVALID|SAME)|SKIP))|FRAC_DIGITS|GROUPING|HTML_(ENTITIES|SPECIALCHARS)|IN(FO_(ALL|CONFIGURATION|CREDITS|ENVIRONMENT|GENERAL|LICENSE|MODULES|VARIABLES)|I_(ALL|PERDIR|SYSTEM|USER)|T_(CURR_SYMBOL|FRAC_DIGITS))|L(C_(ALL|COLLATE|CTYPE|MESSAGES|MONETARY|NUMERIC|TIME)|O(CK_(EX|NB|SH|UN)|G_(ALERT|AUTH(|PRIV)|CONS|CRIT|CRON|DAEMON|DEBUG|EMERG|ERR|INFO|KERN|LOCAL([0-7])|LPR|MAIL|NDELAY|NEWS|NOTICE|NOWAIT|ODELAY|PERROR|PID|SYSLOG|USER|UUCP|WARNING)))|M(ON_([0-9]{1,2}|DECIMAL_POINT|GROUPING|THOUSANDS_SEP)|YSQL_(ASSOC|BOTH|NUM)|_(1_PI|2_(PI|SQRTPI)|E|L(N10|N2|OG(10E|2E))|PI(|_2|_4)|SQRT1_2|SQRT2))|N(EGATIVE_SIGN|O(EXPR|STR)|_(CS_PRECEDES|SEP_BY_SPACE|SIGN_POSN))|P(ATH(INFO_(BASENAME|DIRNAME|EXTENSION|FILENAME)|_SEPARATOR)|M_STR|OSITIVE_SIGN|_(CS_PRECEDES|SEP_BY_SPACE|SIGN_POSN))|RADIXCHAR|S(EEK_(CUR|END|SET)|ORT_(ASC|DESC|NUMERIC|REGULAR|STRING)|TR_PAD_(BOTH|LEFT|RIGHT))|T(HOUS(ANDS_SEP|EP)|_(FMT(|_AMPM)))|YES(EXPR|STR))\\b",
					"name": "support.constant.std.php",
					"flags": "i"
				},
				// Function Call
				{
					"match": "\\b(isset|unset|e(val|mpty)|list)(?=\\s*\\()",
					"name": "support.function.construct.php",
					"flags": "i"
				},
				{
					"match": "\\b(print|echo)\\b",
					"name": "support.function.construct.php",
					"flags": "i"
				},
				{
					"match": "(__(?:call|construct|destruct|get|set|tostring|clone|set_state|sleep|wakeup|autoload|invoke|callStatic))",
					"name": "support.function.magic.php",
					"flags": "i"
				},
				// Language
				{
					"match": "\\s*\\b(break|c(ase|ontinue)|d(e(clare|fault)|ie|o)|e(lse(if)?|nd(declare|for(each)?|if|switch|while)|xit)|for(each)?|if|return|switch|use|while|new)\\b",
					"name": "keyword.control.php"
				},
				{
					"match": "\\b(catch|try|throw|exception)\\b",
					"name": "keyword.control.exception.php"
				},
				{
					"match": "\\b((?:require|include)(?:_once)?)\\b\\s*",
					"name": "keyword.control.php"
				},
				{
					"match": "\\b(array|real|double|float|int(eger)?|bool(ean)?|string|class|clone|var|function|interface|parent|self|object)\\b",
					"name": "storage.type.php",
					"flags": "i"
				},
				{
					"match": "\\b(global|abstract|const|extends|implements|final|p(r(ivate|otected)|ublic)|static)\\b",
					"name": "storage.modifier.php",
					"flags": "i"
				},
				{
					"match": "(goto)\\s+([a-z_][a-z_0-9]*)",
					"name": "keyword.control.goto.php",
					"flags": "i"
				},
				{
					"match": "\\b(instanceof)\\b\\s+(?=[\\\\$a-z_])",
					"name": "keyword.operator.type.php",
					"flags": "i"
				},
				// Operators
				{
					"match": "(!|&&|\\|\\|)|\\b(and|or|xor|as)\\b",
					"name": "keyword.operator.logical.php",
					"flags": "i"
				},
				{
					"match": "<<|>>|~|\\^|&|\\|",
					"name": "keyword.operator.bitwise.php",
					"flags": "i"
				},
				{
					"match": "(===|==|!==|!=|<=|>=|<>|<|>)",
					"name": "keyword.operator.comparison.php",
					"flags": "i"
				},
				// Numbers
				{
					"match": "\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)\\b",
					"name": "constant.numeric.php"
				},
				// -----------------------------------------------
				// Auto converted rules for PHP built-in functions
				// -----------------------------------------------
				{
					"match" : "\\bdisplay_disabled_function(?=\\s*\\()",
					"name" : "support.function.API.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(s(huffle|ort)|n(ext|at(sort|casesort))|c(o(unt|mpact)|urrent)|in_array|u(sort|ksort|asort)|prev|e(nd|xtract)|k(sort|ey|rsort)|a(sort|r(sort|ray_(s(hift|um|plice|earch|lice)|c(h(unk|ange_key_case)|o(unt_values|mbine))|intersect(_(u(key|assoc)|key|assoc))?|diff(_(u(key|assoc)|key|assoc))?|u(n(shift|ique)|intersect(_(uassoc|assoc))?|diff(_(uassoc|assoc))?)|p(op|ush|ad|roduct)|values|key(s|_exists)|f(il(ter|l(_keys)?)|lip)|walk(_recursive)?|r(e(duce|place(_recursive)?|verse)|and)|m(ultisort|erge(_recursive)?|ap))))|r(sort|eset|ange)|m(in|ax))(?=\\s*\\()",
					"name" : "support.function.array.php",
					"flags" : "i"
				},
				{
					"match" : "\\bassert(_options)?(?=\\s*\\()",
					"name" : "support.function.assert.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_attr_is_id(?=\\s*\\()",
					"name" : "support.function.attr.php",
					"flags" : "i"
				},
				{
					"match" : "\\bbase64_(decode|encode)(?=\\s*\\()",
					"name" : "support.function.base64.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(highlight_(string|file)|s(ys_getloadavg|et_(include_path|magic_quotes_runtime)|leep)|c(on(stant|nection_(status|aborted))|all_user_(func(_array)?|method(_array)?))|time_(sleep_until|nanosleep)|i(s_uploaded_file|n(i_(set|restore|get(_all)?)|et_(ntop|pton))|p2long|gnore_user_abort|mport_request_variables)|u(sleep|nregister_tick_function)|error_(log|get_last)|p(hp_strip_whitespace|utenv|arse_ini_(string|file)|rint_r)|f(orward_static_call|lush)|long2ip|re(store_include_path|gister_(shutdown_function|tick_function))|get(servby(name|port)|opt|_(c(urrent_user|fg_var)|include_path|magic_quotes_(gpc|runtime))|protobyn(umber|ame)|env)|move_uploaded_file)(?=\\s*\\()",
					"name" : "support.function.basic_functions.php",
					"flags" : "i"
				},
				{
					"match" : "\\bbc(s(cale|ub|qrt)|comp|div|pow(mod)?|add|m(od|ul))(?=\\s*\\()",
					"name" : "support.function.bcmath.php",
					"flags" : "i"
				},
				{
					"match" : "\\bbirdstep_(c(o(nnect|mmit)|lose)|off_autocommit|exec|f(ieldn(um|ame)|etch|reeresult)|autocommit|r(ollback|esult))(?=\\s*\\()",
					"name" : "support.function.birdstep.php",
					"flags" : "i"
				},
				{
					"match" : "\\bget_browser(?=\\s*\\()",
					"name" : "support.function.browscap.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(s(tr(nc(asecmp|mp)|c(asecmp|mp)|len)|et_e(rror_handler|xception_handler))|c(lass_(exists|alias)|reate_function)|trigger_error|i(s_(subclass_of|a)|nterface_exists)|de(fine(d)?|bug_(print_backtrace|backtrace))|zend_version|property_exists|e(ach|rror_reporting|xtension_loaded)|func(tion_exists|_(num_args|get_arg(s)?))|leak|restore_e(rror_handler|xception_handler)|g(c_(collect_cycles|disable|enable(d)?)|et_(c(alled_class|lass(_(vars|methods))?)|included_files|de(clared_(classes|interfaces)|fined_(constants|vars|functions))|object_vars|extension_funcs|parent_class|loaded_extensions|resource_type))|method_exists)(?=\\s*\\()",
					"name" : "support.function.builtin_functions.php",
					"flags" : "i"
				},
				{
					"match" : "\\bbz(compress|decompress|open|err(str|no|or)|read)(?=\\s*\\()",
					"name" : "support.function.bz2.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(jdtounix|unixtojd)(?=\\s*\\()",
					"name" : "support.function.cal_unix.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(cal_(to_jd|info|days_in_month|from_jd)|j(d(to(j(ulian|ewish)|french|gregorian)|dayofweek|monthname)|uliantojd|ewishtojd)|frenchtojd|gregoriantojd)(?=\\s*\\()",
					"name" : "support.function.calendar.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_characterdata_(substring_data|insert_data|delete_data|append_data|replace_data)(?=\\s*\\()",
					"name" : "support.function.characterdata.php",
					"flags" : "i"
				},
				{
					"match" : "\\bcollator_(set_(strength|attribute)|get_(strength|attribute))(?=\\s*\\()",
					"name" : "support.function.collator_attr.php",
					"flags" : "i"
				},
				{
					"match" : "\\bcollator_compare(?=\\s*\\()",
					"name" : "support.function.collator_compare.php",
					"flags" : "i"
				},
				{
					"match" : "\\bcollator_create(?=\\s*\\()",
					"name" : "support.function.collator_create.php",
					"flags" : "i"
				},
				{
					"match" : "\\bcollator_get_error_(code|message)(?=\\s*\\()",
					"name" : "support.function.collator_error.php",
					"flags" : "i"
				},
				{
					"match" : "\\bcollator_get_locale(?=\\s*\\()",
					"name" : "support.function.collator_locale.php",
					"flags" : "i"
				},
				{
					"match" : "\\bcollator_(sort(_with_sort_keys)?|asort|get_sort_key)(?=\\s*\\()",
					"name" : "support.function.collator_sort.php",
					"flags" : "i"
				},
				{
					"match" : "\\bcom_(create_guid|print_typeinfo|event_sink|load_typelib|get_active_object|message_pump)(?=\\s*\\()",
					"name" : "support.function.com_com.php",
					"flags" : "i"
				},
				{
					"match" : "\\bvariant_(s(ub|et(_type)?)|n(ot|eg)|c(a(st|t)|mp)|i(nt|div|mp)|or|d(iv|ate_(to_timestamp|from_timestamp))|pow|eqv|fix|a(nd|dd|bs)|get_type|round|xor|m(od|ul))(?=\\s*\\()",
					"name" : "support.function.com_variant.php",
					"flags" : "i"
				},
				{
					"match" : "\\bintl_(is_failure|error_name|get_error_(code|message))(?=\\s*\\()",
					"name" : "support.function.common_error.php",
					"flags" : "i"
				},
				{
					"match" : "\\bcrc32(?=\\s*\\()",
					"name" : "support.function.crc32.php",
					"flags" : "i"
				},
				{
					"match" : "\\bcrypt(?=\\s*\\()",
					"name" : "support.function.crypt.php",
					"flags" : "i"
				},
				{
					"match" : "\\bctype_(space|cntrl|digit|upper|p(unct|rint)|lower|al(num|pha)|graph|xdigit)(?=\\s*\\()",
					"name" : "support.function.ctype.php",
					"flags" : "i"
				},
				{
					"match" : "\\bconvert_cyr_string(?=\\s*\\()",
					"name" : "support.function.cyr_convert.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdatefmt_(create|get_error_(code|message))(?=\\s*\\()",
					"name" : "support.function.dateformat.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdatefmt_(set(_(calendar|timezone_id|pattern)|Lenient)|isLenient|get_(calendar|time(type|zone_id)|datetype|pattern|locale))(?=\\s*\\()",
					"name" : "support.function.dateformat_attr.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdatefmt_format(?=\\s*\\()",
					"name" : "support.function.dateformat_format.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdatefmt_(parse|localtime)(?=\\s*\\()",
					"name" : "support.function.dateformat_parse.php",
					"flags" : "i"
				},
				{
					"match" : "\\bstrptime(?=\\s*\\()",
					"name" : "support.function.datetime.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdba_(handlers|sync|nextkey|close|insert|delete|op(timize|en)|exists|popen|key_split|f(irstkey|etch)|list|replace)(?=\\s*\\()",
					"name" : "support.function.dba.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(scandir|c(h(dir|root)|losedir)|dir|opendir|re(addir|winddir)|g(etcwd|lob))(?=\\s*\\()",
					"name" : "support.function.dir.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdl(?=\\s*\\()",
					"name" : "support.function.dl.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(dns_(check_record|get_(record|mx))|gethost(name|by(name(l)?|addr)))(?=\\s*\\()",
					"name" : "support.function.dns.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdns_(check_record|get_record)(?=\\s*\\()",
					"name" : "support.function.dns_win32.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_document_(s(chema_validate(_file)?|ave(_html(_file)?|xml)?)|normalize_document|create_(c(datasection|omment)|text_node|document_fragment|processing_instruction|e(ntity_reference|lement(_ns)?)|attribute(_ns)?)|import_node|validate|load(_html(_file)?|xml)?|adopt_node|re(name_node|laxNG_validate_(file|xml))|get_element(s_by_tag_name(_ns)?|_by_id)|xinclude)(?=\\s*\\()",
					"name" : "support.function.document.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_domconfiguration_(set_parameter|can_set_parameter|get_parameter)(?=\\s*\\()",
					"name" : "support.function.domconfiguration.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_domerrorhandler_handle_error(?=\\s*\\()",
					"name" : "support.function.domerrorhandler.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_domimplementation_(has_feature|create_document(_type)?|get_feature)(?=\\s*\\()",
					"name" : "support.function.domimplementation.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_domimplementationlist_item(?=\\s*\\()",
					"name" : "support.function.domimplementationlist.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_domimplementationsource_get_domimplementation(s)?(?=\\s*\\()",
					"name" : "support.function.domimplementationsource.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_domstringlist_item(?=\\s*\\()",
					"name" : "support.function.domstringlist.php",
					"flags" : "i"
				},
				{
					"match" : "\\beaster_da(ys|te)(?=\\s*\\()",
					"name" : "support.function.easter.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_element_(has_attribute(_ns)?|set_(id_attribute(_n(s|ode))?|attribute(_n(s|ode(_ns)?))?)|remove_attribute(_n(s|ode))?|get_(elements_by_tag_name(_ns)?|attribute(_n(s|ode(_ns)?))?))(?=\\s*\\()",
					"name" : "support.function.element.php",
					"flags" : "i"
				},
				{
					"match" : "\\benchant_(dict_(s(tore_replacement|uggest)|check|is_in_session|describe|quick_check|add_to_(session|personal)|get_error)|broker_(set_(ordering|dict_path)|init|d(ict_exists|escribe)|free(_dict)?|list_dicts|request_(dict|pwl_dict)|get_(dict_path|error)))(?=\\s*\\()",
					"name" : "support.function.enchant.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(s(plit(i)?|ql_regcase)|ereg(i(_replace)?|_replace)?)(?=\\s*\\()",
					"name" : "support.function.ereg.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(s(hell_exec|ystem)|p(assthru|roc_nice)|e(scapeshell(cmd|arg)|xec))(?=\\s*\\()",
					"name" : "support.function.exec.php",
					"flags" : "i"
				},
				{
					"match" : "\\bexif_(imagetype|t(humbnail|agname)|read_data)(?=\\s*\\()",
					"name" : "support.function.exif.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(sys_get_temp_dir|copy|t(empnam|mpfile)|u(nlink|mask)|p(close|open)|f(s(canf|tat|eek)|nmatch|close|t(ell|runcate)|ile(_(put_contents|get_contents))?|open|p(utcsv|assthru)|eof|flush|write|lock|read|get(s(s)?|c(sv)?))|r(e(name|a(dfile|lpath)|wind)|mdir)|get_meta_tags|mkdir)(?=\\s*\\()",
					"name" : "support.function.file.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(finfo_(set_flags|close|open|file|buffer)|mime_content_type)(?=\\s*\\()",
					"name" : "support.function.fileinfo.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(stat|c(h(own|grp|mod)|learstatcache)|is_(dir|executable|file|link|writable|readable)|touch|disk_(total_space|free_space)|file(size|ctime|type|inode|owner|_exists|perms|atime|group|mtime)|l(stat|chgrp)|realpath_cache_(size|get))(?=\\s*\\()",
					"name" : "support.function.filestat.php",
					"flags" : "i"
				},
				{
					"match" : "\\bfilter_(has_var|input(_array)?|var(_array)?)(?=\\s*\\()",
					"name" : "support.function.filter.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(sprintf|printf|v(sprintf|printf|fprintf)|fprintf)(?=\\s*\\()",
					"name" : "support.function.formatted_print.php",
					"flags" : "i"
				},
				{
					"match" : "\\bnumfmt_(set_(symbol|text_attribute|pattern|attribute)|get_(symbol|text_attribute|pattern|locale|attribute))(?=\\s*\\()",
					"name" : "support.function.formatter_attr.php",
					"flags" : "i"
				},
				{
					"match" : "\\bnumfmt_format(_currency)?(?=\\s*\\()",
					"name" : "support.function.formatter_format.php",
					"flags" : "i"
				},
				{
					"match" : "\\bnumfmt_(create|get_error_(code|message))(?=\\s*\\()",
					"name" : "support.function.formatter_main.php",
					"flags" : "i"
				},
				{
					"match" : "\\bnumfmt_parse(_currency)?(?=\\s*\\()",
					"name" : "support.function.formatter_parse.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(pfsockopen|fsockopen)(?=\\s*\\()",
					"name" : "support.function.fsock.php",
					"flags" : "i"
				},
				{
					"match" : "\\bftok(?=\\s*\\()",
					"name" : "support.function.ftok.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(stat|is_(dir|executable|writable|readable)|file(size|ctime|type|inode|owner|_exists|perms|atime|group|mtime)|lstat)(?=\\s*\\()",
					"name" : "support.function.func_interceptors.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(image(s(y|tring(up)?|et(style|t(hickness|ile)|pixel|brush)|avealpha|x)|c(har(up)?|o(nvolution|py(res(ized|ampled)|merge(gray)?)?|lor(s(total|et|forindex)|closest(hwb|alpha)?|transparent|deallocate|exact(alpha)?|a(t|llocate(alpha)?)|resolve(alpha)?|match))|reate(truecolor|from(string|jpeg|png|wbmp|g(if|d(2(part)?)?)|x(pm|bm)))?)|2wbmp|t(ypes|tf(text|bbox)|ruecolortopalette)|i(struecolor|nterlace)|d(estroy|ashedline)|jpeg|ellipse|p(s(slantfont|copyfont|text|e(ncodefont|xtendfont)|freefont|loadfont|bbox)|ng|olygon|alettecopy)|f(t(text|bbox)|il(ter|l(toborder|ed(polygon|ellipse|arc|rectangle))?)|ont(height|width))|wbmp|a(ntialias|lphablending|rc)|l(ine|oadfont|ayereffect)|r(otate|ectangle)|g(if|d(2)?|ammacorrect|rab(screen|window))|xbm)|jpeg2wbmp|png2wbmp|gd_info)(?=\\s*\\()",
					"name" : "support.function.gd.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(ngettext|textdomain|d(ngettext|c(ngettext|gettext)|gettext)|gettext|bind(textdomain|_textdomain_codeset))(?=\\s*\\()",
					"name" : "support.function.gettext.php",
					"flags" : "i"
				},
				{
					"match" : "\\bgmp_(hamdist|s(can(1|0)|ign|trval|ub|etbit|qrt(rem)?)|c(om|lrbit|mp)|ne(g|xtprime)|testbit|in(tval|it|vert)|or|div(_(q(r)?|r)|exact)|jacobi|p(o(pcount|w(m)?)|erfect_square|rob_prime)|fact|legendre|a(nd|dd|bs)|random|gcd(ext)?|xor|m(od|ul))(?=\\s*\\()",
					"name" : "support.function.gmp.php",
					"flags" : "i"
				},
				{
					"match" : "\\bgrapheme_(s(tr(str|i(str|pos)|pos|len|r(ipos|pos))|ubstr)|extract)(?=\\s*\\()",
					"name" : "support.function.grapheme_string.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(hash(_(hmac(_file)?|copy|init|update(_(stream|file))?|fi(nal|le)|algos))?|mhash(_(count|keygen_s2k|get_(hash_name|block_size)))?)(?=\\s*\\()",
					"name" : "support.function.hash.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmd5(_file)?(?=\\s*\\()",
					"name" : "support.function.hash_md.php",
					"flags" : "i"
				},
				{
					"match" : "\\bsha1(_file)?(?=\\s*\\()",
					"name" : "support.function.hash_sha.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(set(cookie|rawcookie)|header(s_(sent|list)|_remove)?)(?=\\s*\\()",
					"name" : "support.function.head.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(html(specialchars(_decode)?|_entity_decode|entities)|get_html_translation_table)(?=\\s*\\()",
					"name" : "support.function.html.php",
					"flags" : "i"
				},
				{
					"match" : "\\bhttp_build_query(?=\\s*\\()",
					"name" : "support.function.http.php",
					"flags" : "i"
				},
				{
					"match" : "\\bibase_blob_(c(ancel|lose|reate)|i(nfo|mport)|open|echo|add|get)(?=\\s*\\()",
					"name" : "support.function.ibase_blobs.php",
					"flags" : "i"
				},
				{
					"match" : "\\bibase_(set_event_handler|free_event_handler|wait_event)(?=\\s*\\()",
					"name" : "support.function.ibase_events.php",
					"flags" : "i"
				},
				{
					"match" : "\\bibase_(n(um_(params|fields|rows)|ame_result)|execute|p(aram_info|repare)|f(ield_info|etch_(object|assoc|row)|ree_(query|result))|query|affected_rows)(?=\\s*\\()",
					"name" : "support.function.ibase_query.php",
					"flags" : "i"
				},
				{
					"match" : "\\bibase_(serv(ice_(detach|attach)|er_info)|d(elete_user|b_info)|add_user|restore|backup|m(odify_user|aintain_db))(?=\\s*\\()",
					"name" : "support.function.ibase_service.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(iconv(_(s(tr(pos|len|rpos)|ubstr|et_encoding)|get_encoding|mime_(decode(_headers)?|encode)))?|ob_iconv_handler)(?=\\s*\\()",
					"name" : "support.function.iconv.php",
					"flags" : "i"
				},
				{
					"match" : "\\bidn_to_(utf8|ascii)(?=\\s*\\()",
					"name" : "support.function.idn.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(image_type_to_(extension|mime_type)|getimagesize)(?=\\s*\\()",
					"name" : "support.function.image.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(zend_logo_guid|php(credits|info|_(sapi_name|ini_(scanned_files|loaded_file)|uname|egg_logo_guid|logo_guid|real_logo_guid)|version))(?=\\s*\\()",
					"name" : "support.function.info.php",
					"flags" : "i"
				},
				{
					"match" : "\\bibase_(c(o(nnect|mmit(_ret)?)|lose)|trans|drop_db|pconnect|err(code|msg)|gen_id|rollback(_ret)?)(?=\\s*\\()",
					"name" : "support.function.interbase.php",
					"flags" : "i"
				},
				{
					"match" : "\\bcurl_(setopt(_array)?|c(opy_handle|lose)|init|e(rr(no|or)|xec)|version|getinfo)(?=\\s*\\()",
					"name" : "support.function.interface.php",
					"flags" : "i"
				},
				{
					"match" : "\\biptc(parse|embed)(?=\\s*\\()",
					"name" : "support.function.iptc.php",
					"flags" : "i"
				},
				{
					"match" : "\\bjson_(decode|encode|last_error)(?=\\s*\\()",
					"name" : "support.function.json.php",
					"flags" : "i"
				},
				{
					"match" : "\\blcg_value(?=\\s*\\()",
					"name" : "support.function.lcg.php",
					"flags" : "i"
				},
				{
					"match" : "\\bldap_(s(tart_tls|ort|e(t_(option|rebind_proc)|arch)|asl_bind)|next_(entry|attribute|reference)|co(nnect|unt_entries|mpare)|t61_to_8859|8859_to_t61|d(n2ufn|elete)|unbind|parse_re(sult|ference)|e(rr(no|2str|or)|xplode_dn)|f(irst_(entry|attribute|reference)|ree_result)|add|list|get_(option|dn|entries|values_len|attributes)|re(name|ad)|mod_(del|add|replace)|bind)(?=\\s*\\()",
					"name" : "support.function.ldap.php",
					"flags" : "i"
				},
				{
					"match" : "\\blevenshtein(?=\\s*\\()",
					"name" : "support.function.levenshtein.php",
					"flags" : "i"
				},
				{
					"match" : "\\blibxml_(set_streams_context|clear_errors|disable_entity_loader|use_internal_errors|get_(errors|last_error))(?=\\s*\\()",
					"name" : "support.function.libxml.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(symlink|link(info)?|readlink)(?=\\s*\\()",
					"name" : "support.function.link.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(symlink|link(info)?|readlink)(?=\\s*\\()",
					"name" : "support.function.link_win32.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(compose_locale|parse_locale|locale_(set_default|canonicalize|filter_matches|accept_from_http|lookup|get_(script|default|primary_language|keywords|all_variants|region))|get(_display_(script|name|language|region)|Keywords))(?=\\s*\\()",
					"name" : "support.function.locale_methods.php",
					"flags" : "i"
				},
				{
					"match" : "\\blitespeed_re(sponse_headers|quest_headers)(?=\\s*\\()",
					"name" : "support.function.lsapi_main.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(ezmlm_hash|mail)(?=\\s*\\()",
					"name" : "support.function.mail.php",
					"flags" : "i"
				},
				{
					"match" : "\\bset_time_limit(?=\\s*\\()",
					"name" : "support.function.main.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(h(ypot|exdec)|s(in(h)?|qrt)|number_format|c(os(h)?|eil)|is_(nan|infinite|finite)|tan(h)?|octdec|de(c(hex|oct|bin)|g2rad)|exp(m1)?|p(i|ow)|f(loor|mod)|log(1(p|0))?|a(sin(h)?|cos(h)?|tan(h|2)?|bs)|r(ound|ad2deg)|b(indec|ase_convert))(?=\\s*\\()",
					"name" : "support.function.math.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmb_(s(tr(str|cut|to(upper|lower)|i(str|pos|mwidth)|pos|width|len|r(chr|i(chr|pos)|pos))|ubst(itute_character|r(_count)?)|end_mail)|http_(input|output)|c(heck_encoding|onvert_(case|encoding|variables|kana))|internal_encoding|output_handler|de(code_(numericentity|mimeheader)|tect_(order|encoding))|encod(ing_aliases|e_(numericentity|mimeheader))|p(arse_str|referred_mime_name)|l(ist_encodings|anguage)|get_info)(?=\\s*\\()",
					"name" : "support.function.mbstring.php",
					"flags" : "i"
				},
				{
					"match" : "\\bm(crypt_(c(fb|reate_iv|bc)|ofb|decrypt|e(cb|nc(_(self_test|is_block_(algorithm(_mode)?|mode)|get_(supported_key_sizes|iv_size|key_size|algorithms_name|modes_name|block_size))|rypt))|list_(algorithms|modes)|ge(neric(_(init|deinit))?|t_(cipher_name|iv_size|key_size|block_size))|module_(self_test|close|is_block_(algorithm(_mode)?|mode)|open|get_(supported_key_sizes|algo_(key_size|block_size))))|decrypt_generic)(?=\\s*\\()",
					"name" : "support.function.mcrypt.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmd5(_file)?(?=\\s*\\()",
					"name" : "support.function.md5.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmetaphone(?=\\s*\\()",
					"name" : "support.function.metaphone.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(get(timeofday|rusage)|microtime)(?=\\s*\\()",
					"name" : "support.function.microtime.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmsgfmt_(create|get_error_(code|message))(?=\\s*\\()",
					"name" : "support.function.msgformat.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmsgfmt_(set_pattern|get_(pattern|locale))(?=\\s*\\()",
					"name" : "support.function.msgformat_attr.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmsgfmt_format(_message)?(?=\\s*\\()",
					"name" : "support.function.msgformat_format.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(numfmt_parse_message|msgfmt_parse)(?=\\s*\\()",
					"name" : "support.function.msgformat_parse.php",
					"flags" : "i"
				},
				{
					"match" : "\\bcurl_multi_(select|close|in(it|fo_read)|exec|add_handle|getcontent|remove_handle)(?=\\s*\\()",
					"name" : "support.function.multi.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmysqli_(s(sl_set|t(ore_result|at|mt_(s(tore_result|end_long_data|qlstate)|close|n(um_rows|ext_result)|in(sert_id|it)|data_seek|p(aram_count|repare)|e(rr(no|or)|xecute)|f(ield_count|etch|ree_result)|a(ttr_(set|get)|ffected_rows)|res(ult_metadata|et)|bind_(param|result)))|e(t_local_infile_(handler|default)|lect_db)|qlstate)|n(um_(fields|rows)|ext_result)|c(ha(nge_user|racter_set_name)|ommit|lose)|thread_(safe|id)|in(sert_id|it|fo)|options|d(ump_debug_info|ebug|ata_seek)|use_result|p(ing|repare)|err(no|or)|kill|f(ield_(seek|count|tell)|etch_(field(s|_direct)?|lengths|row)|ree_result)|warning_count|a(utocommit|ffected_rows)|r(ollback|e(fresh|al_(connect|escape_string|query)))|get_(server_(info|version)|host_info|client_(info|version)|proto_info)|more_results)(?=\\s*\\()",
					"name" : "support.function.mysqli_api.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmysqli_embedded_server_(start|end)(?=\\s*\\()",
					"name" : "support.function.mysqli_embedded.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmysqli_(s(tmt_get_(warnings|result)|et_charset)|c(onnect(_err(no|or))?|ache_stats)|poll|query|fetch_(object|a(ssoc|ll|rray))|link_construct|reap_async_query|get_(c(harset|onnection_stats|lient_stats)|warnings)|multi_query)(?=\\s*\\()",
					"name" : "support.function.mysqli_nonapi.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmysqli_report(?=\\s*\\()",
					"name" : "support.function.mysqli_report.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_namednodemap_(set_named_item(_ns)?|item|remove_named_item(_ns)?|get_named_item(_ns)?)(?=\\s*\\()",
					"name" : "support.function.namednodemap.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_namelist_get_name(space_uri)?(?=\\s*\\()",
					"name" : "support.function.namelist.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_node_(set_user_data|has_(child_nodes|attributes)|normalize|c(ompare_document_position|lone_node)|i(s_(s(upported|ame_node)|default_namespace|equal_node)|nsert_before)|lookup_(namespace_uri|prefix)|append_child|get_(user_data|feature)|re(place_child|move_child))(?=\\s*\\()",
					"name" : "support.function.node.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_nodelist_item(?=\\s*\\()",
					"name" : "support.function.nodelist.php",
					"flags" : "i"
				},
				{
					"match" : "\\bnormalizer_(normalize|is_normalize)(?=\\s*\\()",
					"name" : "support.function.normalizer_normalize.php",
					"flags" : "i"
				},
				{
					"match" : "\\bnsapi_(virtual|re(sponse_headers|quest_headers))(?=\\s*\\()",
					"name" : "support.function.nsapi.php",
					"flags" : "i"
				},
				{
					"match" : "\\boci(setbufferinglob|_(s(tatement_type|e(t_(client_i(nfo|dentifier)|edition|prefetch|action|module_name)|rver_version))|c(o(nnect|llection_(size|trim|element_(assign|get)|a(ssign|ppend)|max)|mmit)|lose|ancel)|n(um_(fields|rows)|ew_(c(o(nnect|llection)|ursor)|descriptor))|internal_debug|define_by_name|p(connect|a(ssword_change|rse))|e(rror|xecute)|f(ield_(s(cale|ize)|name|is_null|type(_raw)?|precision)|etch(_(object|a(ssoc|ll|rray)|row))?|ree_(statement|collection|descriptor))|lob_(s(ize|eek|ave)|c(opy|lose)|t(ell|runcate)|i(s_equal|mport)|e(of|rase|xport)|flush|append|write(_temporary)?|load|re(wind|ad))|r(ollback|esult)|bind_(array_by_name|by_name))|fetchinto|getbufferinglob)(?=\\s*\\()",
					"name" : "support.function.oci8_interface.php",
					"flags" : "i"
				},
				{
					"match" : "\\bopenssl_(s(ign|eal)|csr_(sign|new|export(_to_file)?|get_(subject|public_key))|d(h_compute_key|igest|ecrypt)|open|e(ncrypt|rror_string)|p(ublic_(decrypt|encrypt)|k(cs(12_(export(_to_file)?|read)|7_(sign|decrypt|encrypt|verify))|ey_(new|export(_to_file)?|free|get_(details|p(ublic|rivate))))|rivate_(decrypt|encrypt))|verify|random_pseudo_bytes|get_(cipher_methods|md_methods)|x509_(check(_private_key|purpose)|parse|export(_to_file)?|free|read))(?=\\s*\\()",
					"name" : "support.function.openssl.php",
					"flags" : "i"
				},
				{
					"match" : "\\bo(utput_(add_rewrite_var|reset_rewrite_vars)|b_(start|clean|implicit_flush|end_(clean|flush)|flush|list_handlers|get_(status|c(ontents|lean)|flush|le(ngth|vel))))(?=\\s*\\()",
					"name" : "support.function.output.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(unpack|pack)(?=\\s*\\()",
					"name" : "support.function.pack.php",
					"flags" : "i"
				},
				{
					"match" : "\\bget(lastmod|my(inode|uid|pid|gid))(?=\\s*\\()",
					"name" : "support.function.pageinfo.php",
					"flags" : "i"
				},
				{
					"match" : "\\bpcn(tl_(s(ig(nal(_dispatch)?|timedwait|procmask)|etpriority)|exec|fork|w(stopsig|termsig|if(s(ignaled|topped)|exited)|exitstatus|ait(pid)?)|alarm|getpriority)|lt_sigwaitinfo)(?=\\s*\\()",
					"name" : "support.function.pcntl.php",
					"flags" : "i"
				},
				{
					"match" : "\\bpdo_drivers(?=\\s*\\()",
					"name" : "support.function.pdo.php",
					"flags" : "i"
				},
				{
					"match" : "\\bpg_(se(nd_(execute|prepare|query(_params)?)|t_(client_encoding|error_verbosity)|lect)|host|num_(fields|rows)|c(o(n(nect(ion_(status|reset|busy))?|vert)|py_(to|from))|ancel_query|l(ient_encoding|ose))|insert|t(ty|ra(nsaction_status|ce))|options|d(elete|bname)|u(n(trace|escape_bytea)|pdate)|e(scape_(string|bytea)|nd_copy|xecute)|p(connect|ing|ort|ut_line|arameter_status|repare)|version|f(ield_(size|n(um|ame)|is_null|t(ype(_oid)?|able)|prtlen)|etch_(object|a(ssoc|ll(_columns)?|rray)|r(ow|esult))|ree_result)|query(_params)?|affected_rows|l(o_(seek|c(lose|reate)|tell|import|open|unlink|export|write|read(_all)?)|ast_(notice|oid|error))|get_(notify|pid|result)|result_(s(tatus|eek)|error(_field)?)|meta_data)(?=\\s*\\()",
					"name" : "support.function.pgsql.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(virtual|apache_(setenv|note|child_terminate|lookup_uri|get_(version|modules)|re(s(et_timeout|ponse_headers)|quest_(s(ome_auth_required|ub_req_(lookup_(uri|file)|method_uri)|e(t_(etag|last_modified)|rver_port)|atisfies)|headers(_(in|out))?|is_initial_req|discard_request_body|update_mtime|err_headers_out|log_error|auth_(name|type)|r(un|emote_host)|meets_conditions)))|getallheaders)(?=\\s*\\()",
					"name" : "support.function.php_apache.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(str(totime|ftime)|checkdate|time(zone_(name_(from_abbr|get)|identifiers_list|transitions_get|o(pen|ffset_get)|version_get|abbreviations_list|location_get))?|idate|date(_(su(n(set|_info|rise)|b)|create(_from_format)?|i(sodate_set|nterval_(create_from_date_string|format))|time(stamp_(set|get)|zone_(set|get)|_set)|d(iff|efault_timezone_(set|get)|ate_set)|offset_get|parse(_from_format)?|format|add|get_last_errors|modify))?|localtime|g(etdate|m(strftime|date|mktime))|mktime)(?=\\s*\\()",
					"name" : "support.function.php_date.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_import_simplexml(?=\\s*\\()",
					"name" : "support.function.php_dom.php",
					"flags" : "i"
				},
				{
					"match" : "\\bftp_(s(sl_connect|ystype|i(te|ze)|et_option)|n(list|b_(continue|put|f(put|get)|get))|c(h(dir|mod)|dup|onnect|lose)|delete|exec|p(ut|asv|wd)|f(put|get)|alloc|login|get(_option)?|r(ename|aw(list)?|mdir)|m(dtm|kdir))(?=\\s*\\()",
					"name" : "support.function.php_ftp.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(virtual|apache_(setenv|note|get(_(version|modules)|env)|response_headers)|getallheaders)(?=\\s*\\()",
					"name" : "support.function.php_functions.php",
					"flags" : "i"
				},
				{
					"match" : "\\bimap_(header(s|info)|s(tatus|ort|ubscribe|e(t(_quota|flag_full|acl)|arch)|avebody)|c(heck|l(ose|earflag_full)|reatemailbox)|num_(recent|msg)|t(hread|imeout)|8bit|delete(mailbox)?|open|u(n(subscribe|delete)|id|tf(7_(decode|encode)|8(_to_mutf7)?))|e(rrors|xpunge)|ping|qprint|fetch(header|structure|_overview|body)|l(sub|ist(scan)?|ast_error)|a(ppend|lerts)|g(c|et(subscribed|_quota(root)?|acl|mailboxes))|r(e(namemailbox|open)|fc822_(parse_(headers|adrlist)|write_address))|m(sgno|ime_header_decode|utf7_to_utf8|ail(_(co(py|mpose)|move)|boxmsginfo)?)|b(inary|ody(struct)?|ase64))(?=\\s*\\()",
					"name" : "support.function.php_imap.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmb_(split|ereg(i(_replace)?|_(search(_(setpos|init|pos|get(pos|regs)|regs))?|replace|match))?|regex_(set_options|encoding))(?=\\s*\\()",
					"name" : "support.function.php_mbregex.php",
					"flags" : "i"
				},
				{
					"match" : "\\bsmfi_(set(timeout|flags|reply)|chgheader|delrcpt|add(header|rcpt)|replacebody|getsymval)(?=\\s*\\()",
					"name" : "support.function.php_milter.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmssql_(select_db|n(um_(fields|rows)|ext_result)|c(onnect|lose)|init|data_seek|execute|pconnect|query|f(ield_(seek|name|type|length)|etch_(object|field|a(ssoc|rray)|row|batch)|ree_(statement|result))|g(uid_string|et_last_message)|r(ows_affected|esult)|bind|min_(error_severity|message_severity))(?=\\s*\\()",
					"name" : "support.function.php_mssql.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmysql_(s(tat|e(t_charset|lect_db))|num_(fields|rows)|c(onnect|l(ient_encoding|ose)|reate_db)|thread_id|in(sert_id|fo)|d(ata_seek|rop_db|b_query)|unbuffered_query|e(scape_string|rr(no|or))|p(connect|ing)|f(ield_(seek|name|t(ype|able)|flags|len)|etch_(object|field|lengths|a(ssoc|rray)|row)|ree_result)|query|affected_rows|list_(tables|dbs|processes|fields)|re(sult|al_escape_string)|get_(server_info|host_info|client_info|proto_info))(?=\\s*\\()",
					"name" : "support.function.php_mysql.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(solid_fetch_prev|odbc_(s(tatistics|pecialcolumns|etoption)|n(um_(fields|rows)|ext_result)|c(o(nnect|lumn(s|privileges)|mmit)|ursor|lose(_all)?)|table(s|privileges)|data_source|e(rror(msg)?|xec(ute)?)|p(connect|r(imarykeys|ocedure(s|columns)|epare))|f(ield_(scale|n(um|ame)|type|len)|oreignkeys|etch_(into|object|array|row)|ree_result)|autocommit|longreadlen|gettypeinfo|r(ollback|esult(_all)?)|binmode))(?=\\s*\\()",
					"name" : "support.function.php_odbc.php",
					"flags" : "i"
				},
				{
					"match" : "\\bpreg_(split|quote|filter|last_error|grep|replace(_callback)?|match(_all)?)(?=\\s*\\()",
					"name" : "support.function.php_pcre.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(spl_(classes|object_hash|autoload(_(call|unregister|extensions|functions|register))?)|class_(implements|parents))(?=\\s*\\()",
					"name" : "support.function.php_spl.php",
					"flags" : "i"
				},
				{
					"match" : "\\bsybase_(se(t_message_handler|lect_db)|num_(fields|rows)|c(onnect|lose)|d(eadlock_retry_count|ata_seek)|unbuffered_query|pconnect|f(ield_seek|etch_(object|field|a(ssoc|rray)|row)|ree_result)|query|affected_rows|result|get_last_message|min_(server_severity|client_severity))(?=\\s*\\()",
					"name" : "support.function.php_sybase_ct.php",
					"flags" : "i"
				},
				{
					"match" : "\\bxmlwriter_(s(tart_(c(omment|data)|d(td(_(e(ntity|lement)|attlist))?|ocument)|pi|element(_ns)?|attribute(_ns)?)|et_indent(_string)?)|text|o(utput_memory|pen_(uri|memory))|end_(c(omment|data)|d(td(_(e(ntity|lement)|attlist))?|ocument)|pi|element|attribute)|f(ull_end_element|lush)|write_(c(omment|data)|dtd(_(e(ntity|lement)|attlist))?|pi|element(_ns)?|attribute(_ns)?|raw))(?=\\s*\\()",
					"name" : "support.function.php_xmlwriter.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(zip_(close|open|entry_(name|c(ompress(ionmethod|edsize)|lose)|open|filesize|read)|read)|add(Glob|Pattern))(?=\\s*\\()",
					"name" : "support.function.php_zip.php",
					"flags" : "i"
				},
				{
					"match" : "\\bposix_(s(trerror|et(sid|uid|pgid|e(uid|gid)|gid))|ctermid|i(satty|nitgroups)|t(tyname|imes)|uname|kill|access|get(sid|cwd|_last_error|uid|e(uid|gid)|p(id|pid|w(nam|uid)|g(id|rp))|login|rlimit|g(id|r(nam|oups|gid)))|mk(nod|fifo))(?=\\s*\\()",
					"name" : "support.function.posix.php",
					"flags" : "i"
				},
				{
					"match" : "\\bproc_(close|terminate|open|get_status)(?=\\s*\\()",
					"name" : "support.function.proc_open.php",
					"flags" : "i"
				},
				{
					"match" : "\\bpspell_(s(tore_replacement|uggest|ave_wordlist)|c(heck|onfig_(save_repl|create|ignore|d(ict_dir|ata_dir)|personal|r(untogether|epl)|mode)|lear_session)|new(_(config|personal))?|add_to_(session|personal))(?=\\s*\\()",
					"name" : "support.function.pspell.php",
					"flags" : "i"
				},
				{
					"match" : "\\bquoted_printable_(decode|encode)(?=\\s*\\()",
					"name" : "support.function.quot_print.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(srand|getrandmax|rand|mt_(srand|getrandmax|rand))(?=\\s*\\()",
					"name" : "support.function.rand.php",
					"flags" : "i"
				},
				{
					"match" : "\\breadline(_(c(ompletion_function|allback_(handler_(install|remove)|read_char)|lear_history)|info|on_new_line|write_history|list_history|add_history|re(display|ad_history)))?(?=\\s*\\()",
					"name" : "support.function.readline.php",
					"flags" : "i"
				},
				{
					"match" : "\\brecode_(string|file)(?=\\s*\\()",
					"name" : "support.function.recode.php",
					"flags" : "i"
				},
				{
					"match" : "\\bsession_(s(tart|et_(save_handler|cookie_params)|ave_path)|cache_(expire|limiter)|name|i(s_registered|d)|de(stroy|code)|un(set|register)|encode|write_close|reg(ister|enerate_id)|get_cookie_params|module_name)(?=\\s*\\()",
					"name" : "support.function.session.php",
					"flags" : "i"
				},
				{
					"match" : "\\bsha1(_file)?(?=\\s*\\()",
					"name" : "support.function.sha1.php",
					"flags" : "i"
				},
				{
					"match" : "\\bshmop_(size|close|delete|open|write|read)(?=\\s*\\()",
					"name" : "support.function.shmop.php",
					"flags" : "i"
				},
				{
					"match" : "\\bsimplexml_(import_dom|load_(string|file))(?=\\s*\\()",
					"name" : "support.function.simplexml.php",
					"flags" : "i"
				},
				{
					"match" : "\\bconfirm_extname_compiled(?=\\s*\\()",
					"name" : "support.function.skeleton.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(snmp(set|2_(set|walk|real_walk|get(next)?)|3_(set|walk|real_walk|get(next)?)|_(set_(oid_output_format|enum_print|valueretrieval|quick_print)|read_mib|get_(valueretrieval|quick_print))|walk|realwalk|get(next)?)|php_snmpv3)(?=\\s*\\()",
					"name" : "support.function.snmp.php",
					"flags" : "i"
				},
				{
					"match" : "\\bsocket_(s(hutdown|trerror|e(nd(to)?|t_(nonblock|option|block)|lect))|c(onnect|l(ose|ear_error)|reate(_(pair|listen))?)|write|l(isten|ast_error)|accept|get(sockname|_option|peername)|re(cv(from)?|ad)|bind)(?=\\s*\\()",
					"name" : "support.function.sockets.php",
					"flags" : "i"
				},
				{
					"match" : "\\bsoundex(?=\\s*\\()",
					"name" : "support.function.soundex.php",
					"flags" : "i"
				},
				{
					"match" : "\\biterator_(count|to_array|apply)(?=\\s*\\()",
					"name" : "support.function.spl_iterators.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(current|attachIterator)(?=\\s*\\()",
					"name" : "support.function.spl_observer.php",
					"flags" : "i"
				},
				{
					"match" : "\\bsqlite_(has_prev|s(ingle_query|eek)|n(um_(fields|rows)|ext)|c(hanges|olumn|urrent|lose|reate_(function|aggregate))|open|u(nbuffered_query|df_(decode_binary|encode_binary))|e(scape_string|rror_string|xec)|p(open|rev)|key|valid|query|f(ield_name|etch_(single|column_types|object|a(ll|rray))|actory)|l(ib(encoding|version)|ast_(insert_rowid|error))|array_query|rewind|busy_timeout)(?=\\s*\\()",
					"name" : "support.function.sqlite.php",
					"flags" : "i"
				},
				{
					"match" : "\\bstream_(s(ocket_(s(hutdown|e(ndto|rver))|client|enable_crypto|pair|accept|recvfrom|get_name)|upports_lock|e(t_(timeout|write_buffer|blocking)|lect))|co(ntext_(set_(default|option|params)|create|get_(default|options|params))|py_to_stream)|is_local|filter_(prepend|append|remove)|resolve_include_path|get_(contents|transports|line|wrappers|meta_data))(?=\\s*\\()",
					"name" : "support.function.streamsfuncs.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(hebrev(c)?|s(scanf|imilar_text|tr(s(tr|pn)|natc(asecmp|mp)|c(hr|spn|oll)|i(str|p(slashes|cslashes|os|_tags))|t(o(upper|k|lower)|r)|_(s(huffle|plit)|ireplace|pad|word_count|getcsv|r(ot13|ep(eat|lace)))|p(os|brk)|r(chr|ipos|ev|pos))|ubstr(_(co(unt|mpare)|replace))?|etlocale)|c(h(unk_split|r)|ount_chars)|nl(2br|_langinfo)|implode|trim|ord|dirname|uc(first|words)|join|pa(thinfo|rse_str)|explode|quotemeta|add(slashes|cslashes)|wordwrap|l(cfirst|trim|ocaleconv)|rtrim|money_format|b(in2hex|asename))(?=\\s*\\()",
					"name" : "support.function.string.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_string_extend_find_offset(16|32)(?=\\s*\\()",
					"name" : "support.function.string_extend.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(syslog|closelog|openlog|define_syslog_variables)(?=\\s*\\()",
					"name" : "support.function.syslog.php",
					"flags" : "i"
				},
				{
					"match" : "\\bmsg_(s(tat_queue|e(nd|t_queue))|queue_exists|re(ceive|move_queue)|get_queue)(?=\\s*\\()",
					"name" : "support.function.sysvmsg.php",
					"flags" : "i"
				},
				{
					"match" : "\\bsem_(acquire|re(lease|move)|get)(?=\\s*\\()",
					"name" : "support.function.sysvsem.php",
					"flags" : "i"
				},
				{
					"match" : "\\bshm_(has_var|detach|put_var|attach|get_var|remove(_var)?)(?=\\s*\\()",
					"name" : "support.function.sysvshm.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_text_(split_text|is_whitespace_in_element_content|replace_whole_text)(?=\\s*\\()",
					"name" : "support.function.text.php",
					"flags" : "i"
				},
				{
					"match" : "\\btidy_(c(onfig_count|lean_repair)|is_x(html|ml)|diagnose|error_count|parse_(string|file)|access_count|warning_count|repair_(string|file)|get(opt|_(h(tml(_ver)?|ead)|status|config|o(utput|pt_doc)|error_buffer|r(oot|elease)|body)))(?=\\s*\\()",
					"name" : "support.function.tidy.php",
					"flags" : "i"
				},
				{
					"match" : "\\btoken_(name|get_all)(?=\\s*\\()",
					"name" : "support.function.tokenizer.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(s(trval|ettype)|i(s_(s(calar|tring)|callable|nu(ll|meric)|object|float|array|long|resource|bool)|ntval)|floatval|gettype)(?=\\s*\\()",
					"name" : "support.function.type.php",
					"flags" : "i"
				},
				{
					"match" : "\\buniqid(?=\\s*\\()",
					"name" : "support.function.uniqid.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(url(decode|encode)|parse_url|get_headers|rawurl(decode|encode))(?=\\s*\\()",
					"name" : "support.function.url.php",
					"flags" : "i"
				},
				{
					"match" : "\\bstream_(filter_register|get_filters|bucket_(new|prepend|append|make_writeable))(?=\\s*\\()",
					"name" : "support.function.user_filters.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_userdatahandler_handle(?=\\s*\\()",
					"name" : "support.function.userdatahandler.php",
					"flags" : "i"
				},
				{
					"match" : "\\bstream_wrapper_(unregister|re(store|gister))(?=\\s*\\()",
					"name" : "support.function.userspace.php",
					"flags" : "i"
				},
				{
					"match" : "\\bconvert_uu(decode|encode)(?=\\s*\\()",
					"name" : "support.function.uuencode.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(serialize|debug_zval_dump|unserialize|var_(dump|export)|memory_get_(usage|peak_usage))(?=\\s*\\()",
					"name" : "support.function.var.php",
					"flags" : "i"
				},
				{
					"match" : "\\bversion_compare(?=\\s*\\()",
					"name" : "support.function.versioning.php",
					"flags" : "i"
				},
				{
					"match" : "\\bwddx_(serialize_va(lue|rs)|deserialize|packet_(start|end)|add_vars)(?=\\s*\\()",
					"name" : "support.function.wddx.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(utf8_(decode|encode)|xml_(set_(start_namespace_decl_handler|notation_decl_handler|character_data_handler|default_handler|object|unparsed_entity_decl_handler|processing_instruction_handler|e(nd_namespace_decl_handler|lement_handler|xternal_entity_ref_handler))|error_string|parse(_into_struct|r_(set_option|create(_ns)?|free|get_option))?|get_(current_(column_number|line_number|byte_index)|error_code)))(?=\\s*\\()",
					"name" : "support.function.xml.php",
					"flags" : "i"
				},
				{
					"match" : "\\bxmlrpc_(se(t_type|rver_(c(all_method|reate)|destroy|add_introspection_data|register_(introspection_callback|method)))|is_fault|decode(_request)?|parse_method_descriptions|encode(_request)?|get_type)(?=\\s*\\()",
					"name" : "support.function.xmlrpc-epi-php.php",
					"flags" : "i"
				},
				{
					"match" : "\\bdom_xpath_(evaluate|query|register_(ns|php_functions))(?=\\s*\\()",
					"name" : "support.function.xpath.php",
					"flags" : "i"
				},
				{
					"match" : "\\bxsl_xsltprocessor_(has_exslt_support|set_p(arameter|rofiling)|transform_to_(doc|uri|xml)|import_stylesheet|re(gister_php_functions|move_parameter)|get_parameter)(?=\\s*\\()",
					"name" : "support.function.xsltprocessor.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(ob_gzhandler|zlib_get_coding_type|readgzfile|gz(compress|inflate|deflate|open|uncompress|encode|file))(?=\\s*\\()",
					"name" : "support.function.zlib.php",
					"flags" : "i"
				},
				{
					"match" : "\\bis_int(eger)?(?=\\s*\\()",
					"name" : "support.function.alias.php",
					"flags" : "i"
				},
				{
					"match" : "\\b(GlobIterator|R(untimeException|e(sourceBundle|cursive(RegexIterator|CachingIterator|TreeIterator|IteratorIterator|DirectoryIterator|FilterIterator|ArrayIterator)|flection(Method|Class|Object|Extension|P(arameter|roperty)|Function)?|gexIterator)|angeException)|stdClass|XMLReader|M(ultipleIterator|ess(sageFormatter|ageFormatter))|Bad(MethodCallException|FunctionCallException)|tidyNode|S(impleXML(Iterator|Element)|oap(Server|Header|Client|Param|Var|Fault)|pl(M(inHeap|axHeap)|Heap|TempFileObject|ObjectStorage|DoublyLinkedList|PriorityQueue|Fi(le(Info|Object)|xedArray))|QLite3(Result|Stmt)?)|N(o(RewindIterator|rmalizer)|umberFormatter)|C(ollator|OMPersistHelper|achingIterator)|I(n(tlDateFormatter|validArgumentException|finiteIterator)|teratorIterator)|ZipArchive|O(utOf(RangeException|BoundsException)|verflowException)|D(irectoryIterator|omainException|OM(XPath|Node|C(omment|dataSection)|Text|Document(Fragment)?|ProcessingInstruction|E(ntityReference|lement)|Attr))|Un(derflowException|expectedValueException)|P(har(FileInfo)?|DO(Statement)?|arentIterator)|E(rrorException|mptyIterator|xception)|Fil(terIterator|esystemIterator)|A(p(pendIterator|acheRequest)|rray(Iterator|Object))|L(imitIterator|o(cale|gicException)|engthException))(?=\\s*[\\(|;])",
					"name" : "support.class.builtin.php",
					"flags" : "i"
				}

			],
			"repository": {
			}
		}
	};
}());

if (typeof window !== "undefined" && typeof window.define !== "undefined") {
	define([], function() {
		return orion.editor;
	});
}
