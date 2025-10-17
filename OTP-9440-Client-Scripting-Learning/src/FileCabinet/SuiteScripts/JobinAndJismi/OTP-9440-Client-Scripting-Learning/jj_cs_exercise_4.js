/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

function() {

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {
        if(scriptContext.sublistId == 'item') {
            var currentRecord = scriptContext.currentRecord;
            var amount = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'amount'
            });
            if(amount < 200) {
                alert("Amount should be greater than 200!");
                return false;
            }
        }
        return true;
    }

    return {
        validateLine: validateLine
    };
    
});
