(function() {
	var SELECTOR_LIMIT, bless, createAst, css;

	css = require('css');

	SELECTOR_LIMIT = 4095;

	createAst = function(rules) {
		return {
			type: 'stylesheet',
			stylesheet: {
				rules: rules
			}
		};
	};

	bless = function(data) {
		var ast, nestedRule, newAsts, newData, numNestedRuleSelectors, numSelectors, rule, rulesCache, startNewAst, totalNumSelectors, _i, _j, _len, _len1, _ref, _ref1;
		ast = css.parse(data);
		numSelectors = 0;
		totalNumSelectors = 0;
		rulesCache = [];
		newAsts = [];
		startNewAst = function() {
			newAsts.push(createAst(rulesCache));
			rulesCache = [];
			return numSelectors = 0;
		};
		_ref = ast.stylesheet.rules;
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			rule = _ref[_i];
			switch (rule.type) {
				case 'rule':
					if (numSelectors + rule.selectors.length > SELECTOR_LIMIT) {
						startNewAst();
					}
					numSelectors += rule.selectors.length;
					totalNumSelectors += rule.selectors.length;
					break;
				case 'comment':
					break;
				default:
					numNestedRuleSelectors = 0;
					if (rule.rules) {
						_ref1 = rule.rules;
						for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
							nestedRule = _ref1[_j];
							if (nestedRule && nestedRule.selectors) {
								numNestedRuleSelectors += nestedRule.selectors.length;
							}
						}
						if (numSelectors + numNestedRuleSelectors > SELECTOR_LIMIT) {
							startNewAst();
						}
						numSelectors += numNestedRuleSelectors;
						totalNumSelectors += numNestedRuleSelectors;
					}
			}
			rulesCache.push(rule);
			if (numSelectors === SELECTOR_LIMIT) {
				startNewAst();
			}
		}
		if (rulesCache.length) {
			newAsts.push(createAst(rulesCache));
		}
		newData = (function() {
			var _k, _len2, _results;
			_results = [];
			for (_k = 0, _len2 = newAsts.length; _k < _len2; _k++) {
				ast = newAsts[_k];
				_results.push(css.stringify(ast));
			}
			return _results;
		})();
		return {
			data: newData,
			numSelectors: totalNumSelectors
		};
	};

	module.exports = bless;

}).call(this);