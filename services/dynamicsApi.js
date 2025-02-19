export const searchAndDisplayContact = async (phoneNumber) => {
    try {
        // Normalize the phone number by removing special characters
        const normalizedPhone = phoneNumber.replace(/\D/g, '');

        // Build the query to search by phone number
        const query = `?$select=fullname,telephone1,mobilephone&$filter=contains(telephone1,'${normalizedPhone}') or contains(mobilephone,'${normalizedPhone}')`;

        // Search for the contact using CIFramework
        const result = await window.Microsoft.CIFramework.searchAndOpenRecords("contact", query, false);
        const contacts = JSON.parse(result);

        if (contacts && contacts.length > 0) {
            // If contacts found, open the first matching record
            await Microsoft.CIFramework.openForm({
                entityName: "contact",
                entityId: contacts[0].contactid
            });

            return {
                success: true,
                contacts: contacts.map(contact => ({
                    fullname: contact.fullname,
                    telephone1: contact.telephone1,
                    mobilephone: contact.mobilephone
                }))
            };
        } else {
            // No contacts found
            console.log(`No contacts found for phone number: ${phoneNumber}`);
            return {
                success: false,
                message: `No contacts found for phone number: ${phoneNumber}`
            };
        }
    } catch (error) {
        console.error('Error searching for contact:', error);
        return {
            success: false,
            message: error.message || 'Error searching for contact'
        };
    }
};