define(['jquery'], function($) {
	return {
		getContractUrl: function (id) {
            return "/api/loan/Applications/" + id + "/Documents/DOC_CONTRACT"
		},
		getGuaranteeAgreementUrl: function (id) {
			return "/api/loan/Applications/" + id + "/Documents/DOC_GUARANTEE_AGREEMENT"
		},
		getPledgeAgreementUrl: function (id) {
			return "/api/loan/Applications/" + id + "/Documents/DOC_PLEDGE_AGREEMENT"
		},
		getArbitrageAgreementUrl: function (id) {
			return "/api/loan/Applications/" + id + "/Documents/DOC_ARBITRAGE_AGREEMENT"
		},
	};
});