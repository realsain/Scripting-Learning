/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/ui/serverWidget', 'N/record'],
    /**
 * @param{log} log
 * @param{serverWidget} serverWidget
 * @param{record} record
 */
    (log, serverWidget, record) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */

        function createFormUI(scriptContext) {
            try {
                const newForm = serverWidget.createForm({
                    title: 'Registration Form'
                });

                newForm.addResetButton({
                    label: 'Reset'
                })
                newForm.addSubmitButton({
                    label: 'Save'
                })

                newForm.addFieldGroup({
                    id: 'custpage_jj_user_details',
                    label: 'User Details'
                });

                newForm.addField({
                    id: 'custpage_jj_name',
                    label: 'Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_jj_user_details'
                });

                newForm.addField({
                    id: 'custpage_jj_age',
                    label: 'Age',
                    type: serverWidget.FieldType.INTEGER,
                    container: 'custpage_jj_user_details'
                });

                newForm.addField({
                    id: 'custpage_jj_phone',
                    label: 'Phone Number',
                    type: serverWidget.FieldType.PHONE,
                    container: 'custpage_jj_user_details'
                });

                newForm.addField({
                    id: 'custpage_jj_email',
                    label: 'Email',
                    type: serverWidget.FieldType.EMAIL,
                    container: 'custpage_jj_user_details'
                });

                newForm.addField({
                    id: 'custpage_jj_father_name',
                    label: 'Father\'s Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_jj_user_details'
                });

                newForm.addField({
                    id: 'custpage_jj_address',
                    label: 'Address',
                    type: serverWidget.FieldType.TEXTAREA,
                    container: 'custpage_jj_user_details'
                });

                scriptContext.response.writePage({
                    pageObject: newForm
                });
            }
            catch (error) {
                log.error({
                    title: 'Error creating Registration Form UI!',
                    details: error
                });
            }
        }

        function regFormCreate(scriptContext) {
            try {
                const serverRequest = scriptContext.request;

                if (serverRequest.method === 'POST') {
                    const name = serverRequest.parameters.custpage_jj_name;
                    const age = serverRequest.parameters.custpage_jj_age;
                    const phone = serverRequest.parameters.custpage_jj_phone;
                    const email = serverRequest.parameters.custpage_jj_email;
                    const fatherName = serverRequest.parameters.custpage_jj_father_name;
                    const address = serverRequest.parameters.custpage_jj_address;

                    const customRecord = record.create({
                        type: 'customrecord_jj_registration_form',
                        isDynamic: true
                    });

                    customRecord.setValue({
                        fieldId: 'custrecord_jj_r_name',
                        value: name
                    });
                    customRecord.setValue({
                        fieldId: 'custrecord_jj_r_age',
                        value: age
                    });
                    customRecord.setValue({
                        fieldId: 'custrecord_jj_r_phone_number',
                        value: phone
                    })
                    customRecord.setValue({
                        fieldId: 'custrecord_jj_r_email',
                        value: email
                    })
                    customRecord.setValue({
                        fieldId: 'custrecord_jj_r_fathers_name',
                        value: fatherName
                    })
                    customRecord.setValue({
                        fieldId: 'custrecord_jj_r_address',
                        value: address
                    })

                    const customRecordId = customRecord.save();

                    log.debug({
                        title: 'User Created!',
                        details: `User ID: ${customRecordId}`
                    });

                    log.debug({
                        title: 'Form Submission',
                        details: `Name: ${name}, Age: ${age}, Phone: ${phone}, Email: ${email}, Father's Name: ${fatherName}, Address: ${address}`
                    });

                    const htmlOutput = `
                    <html>
                        <body>
                            <h2 style="background-color: black; color: white; border-radius: 8px; width: fit-content; padding: 5px;">
                                Registration Successful!
                            </h2>
                            <p>Thank you, ${name}, for registering.</p>
                            <p><b>User Details:</b></p>
                            <ul>
                                <li>Name: ${name}</li>
                                <li>Age: ${age}</li>
                                <li>Phone: ${phone}</li>
                                <li>Email: ${email}</li>
                                <li>Father's Name: ${fatherName}</li>
                                <li>Address: ${address}</li>
                            </ul>
                        </body>
                    </html>`;

                    scriptContext.response.write({
                        output: htmlOutput
                    });
                }
            }
            catch (error) {
                log.error({
                    title: 'Error Creating Custom record!',
                    details: error
                });
            }
        }

        const onRequest = (scriptContext) => {
            const serverRequest = scriptContext.request;

            if (serverRequest.method === 'GET') {
                try {
                    createFormUI(scriptContext);
                }
                catch (error) {
                    log.error({
                        title: 'Error in GET request',
                        details: error
                    });
                }
            }
            else {
                try {
                    regFormCreate(scriptContext);
                }
                catch (error) {
                    log.error({
                        title: 'Error in POST request',
                        details: error
                    });
                }
            }
        }

        return { onRequest }

    });
