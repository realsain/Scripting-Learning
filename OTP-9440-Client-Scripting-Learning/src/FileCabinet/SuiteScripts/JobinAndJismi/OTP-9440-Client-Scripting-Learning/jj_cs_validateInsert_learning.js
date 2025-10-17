/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

function() {

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {
        console.log("validateInsert triggered on sublist: " + scriptContext.sublistId);

        if(scriptContext.sublistId === 'item') {
            // Perform validation for item sublist
            var itemId = scriptContext.currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item'
            });
            console.log("itemId: " + itemId);

            if(parseInt(itemId) === 252) {
                return true;
            }
            else {
                alert("Use valid field");
                return false;
            }
        }

        return true;
    }

    return {
        validateInsert: validateInsert,
    };
    
});
