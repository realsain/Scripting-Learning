/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

function() {

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {
        console.log("saveRecord triggered");
        var currentRecord = scriptContext.currentRecord;
        var intItemLineCount = currentRecord.getLineCount({ 
            sublistId: 'item' 
        });

        console.log("Item line count: " + intItemLineCount);

        if(intItemLineCount < 2) {
            alert("Minimum 2 lines are required!");
            console.log("Validation failed: Less than 2 item lines");
            return false;
        }

        return true;
    }

    return {
        saveRecord: saveRecord
    };
    
});
