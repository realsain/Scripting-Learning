/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

function() {

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {
        console.log("Validate field triggered!");
        if (scriptContext.fieldId == 'memo') {
            var memoValue = scriptContext.currentRecord.getValue('memo');
            console.log("memovalue", memoValue);

            if (memoValue == 'UI') {
                return true;
            }
            else {
                return false;
            }
        }
        return true;
    }

    return {
        validateField: validateField,
    };
    
});
