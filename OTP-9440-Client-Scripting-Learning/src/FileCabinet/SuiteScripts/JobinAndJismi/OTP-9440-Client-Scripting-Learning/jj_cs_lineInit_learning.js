/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

function() {

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {
        console.log("Line initialization triggered");
        var currentRecord = scriptContext.currentRecord;
        var sublistName = scriptContext.sublistId;
        if (sublistName === 'item') {
            currentRecord.setCurrentSublistValue({
                sublistId: sublistName, 
                fieldId: 'quantity',
                value: true
            })
        }
    }

    return {
        lineInit: lineInit,
    };
    
});
