/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

function() {

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {
        console.log("Post sourcing triggered!", scriptContext.fieldId);
        if (scriptContext.sublistId == 'item' && scriptContext.fieldId == 'item') {
            scriptContext.currentRecord.getCurrentSublistValue({
                sublistId: scriptContext.sublistId,
                fieldId: 'isclosed',
                value: true
            });
        }
    }

    return {
        postSourcing: postSourcing,
    };
    
});
