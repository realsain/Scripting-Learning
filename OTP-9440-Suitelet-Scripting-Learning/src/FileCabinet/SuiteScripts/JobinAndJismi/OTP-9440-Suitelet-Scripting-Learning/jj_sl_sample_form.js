/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search', 'N/log'],
    /**
 * @param{serverWidget} serverWidget
 * @param{search} search
 * @param{log} log
 */
    (serverWidget, search, log) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */

        const onRequest = (scriptContext) => {

            if (scriptContext.request.method === 'GET') {
                const form = serverWidget.createForm({
                    title: 'Basic Form'
                });

                form.addFieldGroup({
                    id: 'custpage_usergroup',
                    label: 'User Information'
                });

                const fnameField = form.addField({
                    id: 'custpage_fname_field',
                    label: 'First Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_usergroup'
                });
                fnameField.isMandatory = true;

                form.addField({
                    id: 'custpage_lname_field',
                    label: 'Last Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_usergroup'
                });

                form.addField({
                    id: 'custpage_email_field',
                    label: 'Email',
                    type: serverWidget.FieldType.EMAIL,
                    container: 'custpage_usergroup'
                });


                form.addResetButton({
                    label: 'Reset'
                });

                form.addSubmitButton({
                    label: 'Submit'
                });


                const sublist = form.addSublist({
                    id: 'custpage_sublist',
                    label: 'Sublist',
                    type: serverWidget.SublistType.LIST
                });

                sublist.addMarkAllButtons();

                sublist.addField({
                    id: 'custpage_checkbox',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'Select'
                });

                sublist.addField({
                    id: 'custpage_customer',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer'
                });

                sublist.addField({
                    id: 'custpage_internalid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Internal ID'
                });

                sublist.addField({
                    id: 'custpage_transaction_number',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Transaction #'
                });


                const mySearch = search.load({
                    id: 'customsearch_jj_sample_suitelet_search'
                });

                let lineCounter = 0;
                mySearch.run().each(result => {
                    const entityName = result.getText({
                        name: 'entity'
                    });

                    const internalId = result.getValue({
                        name: 'internalid'
                    });

                    const tranId = result.getValue({
                        name: 'tranid'
                    });

                    sublist.setSublistValue({
                        id: 'custpage_customer',
                        line: lineCounter,
                        value: entityName
                    });

                    sublist.setSublistValue({
                        id: 'custpage_internalid',
                        line: lineCounter,
                        value: internalId
                    });

                    sublist.setSublistValue({
                        id: 'custpage_transaction_number',
                        line: lineCounter,
                        value: tranId
                    });

                    lineCounter++;

                    return true;
                });

                scriptContext.response.writePage({
                    pageObject: form
                });
            }

            else {
                const fname = scriptContext.request.parameters.custpage_fname_field;
                const lname = scriptContext.request.parameters.custpage_lname_field;
                const email = scriptContext.request.parameters.custpage_email_field;

                const serverRequest = scriptContext.request;

                const lineCount = serverRequest.getLineCount({
                    group: 'custpage_sublist'
                });

                for (let i = 0; i < lineCount; i++) {
                    const customer = serverRequest.getSublistValue({
                        group: 'custpage_sublist',
                        name: 'custpage_customer',
                        line: i
                    });

                    const transInternalId = serverRequest.getSublistValue({
                        group: 'custpage_sublist',
                        name: 'custpage_internalid',
                        line: i
                    });

                    const tranNumber = serverRequest.getSublistValue({
                        group: 'custpage_sublist',
                        name: 'custpage_transaction_number',
                        line: i
                    });

                    const checked = serverRequest.getSublistValue({
                        group: 'custpage_sublist',
                        name: 'custpage_checkbox',
                        line: i
                    });

                    log.debug({
                        title: 'Submitted Data (line ' + i + ')',
                        details:
                            'Top-level - First Name: ' + fname +
                            ', Last Name: ' + lname +
                            ', Email: ' + email +
                            ' | Sublist - Customer: ' + customer +
                            ', Internal ID: ' + transInternalId +
                            ', Transaction #: ' + tranNumber +
                            ', Selected: ' + checked
                    });
                    
                }
                scriptContext.response.write({ output: "<h1>Data Submitted Successfully</h1>" });
            }

        };

        return { onRequest };

    });
