/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

function() {

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {
        console.log("validateDelete triggered on sublist: " + scriptContext.sublistId);

        if(scriptContext.sublistId === 'item') {
            // Perform validation for item sublist
            var itemQuantity = scriptContext.currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity'
            });
            console.log("intQuantity: ", intquantity);

            if(parseInt(itemQuantity) == 1) {
                return true;
            }
            else {
                alert("Use only one quantity!");
                return false;
            }
        }

        return true;
    }

    return {
        validateDelete: validateDelete,
    };
    
});
