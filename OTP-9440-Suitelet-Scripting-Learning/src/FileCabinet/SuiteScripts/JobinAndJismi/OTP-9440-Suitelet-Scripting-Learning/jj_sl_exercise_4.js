/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/record', 'N/ui/serverWidget'], 
    (log, record, serverWidget) => {

        const onRequest = (scriptContext) => {
            try {
                handleRequest(scriptContext);
            } catch (mainError) {
                log.error('Unexpected Error in Suitelet', mainError);
                scriptContext.response.write({
                    output: JSON.stringify({
                        status: 'error',
                        message: mainError.message
                    }, null, 2)
                });
            }
        };

        /**
         * Custom function to handle Suitelet logic
         * @param {Object} scriptContext
         */
        function handleRequest(scriptContext) {
            try {
                if (scriptContext.request.method === 'GET') {
                    log.debug('Request Type', 'GET - Displaying Form');

                    const form = serverWidget.createForm({
                        title: 'Patient Information Form'
                    });

                    form.addField({
                        id: 'custpage_patient_name',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Name'
                    }).isMandatory = true;

                    form.addField({
                        id: 'custpage_patient_age',
                        type: serverWidget.FieldType.INTEGER,
                        label: 'Age'
                    }).isMandatory = true;

                    const sexField = form.addField({
                        id: 'custpage_patient_sex',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Sex'
                    });
                    sexField.addSelectOption({ value: '', text: '' });
                    sexField.addSelectOption({ value: 'M', text: 'Male' });
                    sexField.addSelectOption({ value: 'F', text: 'Female' });
                    sexField.addSelectOption({ value: 'O', text: 'Others' });
                    sexField.isMandatory = true;

                    form.addField({
                        id: 'custpage_patient_address',
                        type: serverWidget.FieldType.TEXTAREA,
                        label: 'Address'
                    }).isMandatory = true;

                    form.addSubmitButton({ label: 'Submit' });

                    scriptContext.response.writePage(form);
                }

                else if (scriptContext.request.method === 'POST') {
                    log.debug('Request Type', 'POST - Creating Record');

                    const name = scriptContext.request.parameters.custpage_patient_name;
                    const age = scriptContext.request.parameters.custpage_patient_age;
                    const sex = scriptContext.request.parameters.custpage_patient_sex;
                    const address = scriptContext.request.parameters.custpage_patient_address;

                    log.debug('Form Data Received', { name, age, sex, address });

                    const patientRecord = record.create({
                        type: 'customrecord_jj_patient_record',
                        isDynamic: true
                    });

                    patientRecord.setValue({ fieldId: 'custrecord_jj_patient_name', value: name });
                    patientRecord.setValue({ fieldId: 'custrecord_jj_patient_age', value: age });
                    patientRecord.setValue({ fieldId: 'custrecord_jj_patient_sex', value: sex });
                    patientRecord.setValue({ fieldId: 'custrecord_jj_patient_address', value: address });

                    const patientId = patientRecord.save();
                    log.debug('Patient Record Created', `Internal ID: ${patientId}`);

                    const responseObj = {
                        status: 'success',
                        message: 'Patient record created successfully',
                        patientId: patientId
                    };

                    scriptContext.response.write({
                        output: JSON.stringify(responseObj, null, 2)
                    });
                }

                else {
                    log.error('Unsupported Method', scriptContext.request.method);
                    scriptContext.response.write({
                        output: JSON.stringify({
                            status: 'error',
                            message: 'Unsupported request method. Use GET or POST.'
                        }, null, 2)
                    });
                }
            } catch (innerError) {
                log.error('Error in handleRequest()', innerError);
                scriptContext.response.write({
                    output: JSON.stringify({
                        status: 'error',
                        message: innerError.message
                    }, null, 2)
                });
            }
        }

        return { onRequest };
    });
