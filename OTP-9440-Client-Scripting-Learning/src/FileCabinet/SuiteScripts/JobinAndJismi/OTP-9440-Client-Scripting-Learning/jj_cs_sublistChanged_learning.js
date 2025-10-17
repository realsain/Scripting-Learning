/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

    function () {

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {
            console.log("sublistChanged triggered");
            var currentRecord = scriptContext.currentRecord;
            var strOperation = scriptContext.operation;
            console.log("Operation: " + strOperation);

            if (scriptContext.sublistId === 'item') {
                currentRecord.setValue({
                    fieldId: 'memo',
                    value: 'Total changed to ' + currentRecord.getValue({ fieldId: 'total' }) + ' with operation: ' + strOperation
                });
            }
        }

        return {
            sublistChanged: sublistChanged,
        };

    });
