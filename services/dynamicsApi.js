import eventEmitter from "./eventEmitter";

export const searchAndDisplayContact = async (phoneNumber) => {
  try {
    // Normalize the phone number by removing special characters
    const normalizedPhone = phoneNumber.replace(/\D/g, "");

    // Build the query to search by phone number
    const query = `?$select=fullname,telephone1,mobilephone&$filter=contains(telephone1,'${normalizedPhone}') or contains(mobilephone,'${normalizedPhone}')`;

    // Search for the contact using CIFramework
    const result = await window.Microsoft.CIFramework.searchAndOpenRecords(
      "contact",
      query,
      false
    );
    const contacts = JSON.parse(result);
    console.log("integration dynamics", contacts);

    if (contacts && contacts.length > 0) {
      // If contacts found, open the first matching record
      await Microsoft.CIFramework.openForm({
        entityName: "contact",
        entityId: contacts[0].contactid,
      });

      return {
        success: true,
        contacts: contacts.map((contact) => ({
          fullname: contact.fullname,
          telephone1: contact.telephone1,
          mobilephone: contact.mobilephone,
        })),
      };
    } else {
      // No contacts found
      console.log(`No contacts found for phone number: ${phoneNumber}`);
      return {
        success: false,
        message: `No contacts found for phone number: ${phoneNumber}`,
      };
    }
  } catch (error) {
    console.error("Error searching for contact:", error);
    return {
      success: false,
      message: error.message || "Error searching for contact",
    };
  }
};

export const setMode = () => {
  console.log("integration dynamics", "called set mode");

  // Setting Panel to minimize mode.
  Microsoft.CIFramework.setMode(1).then(
    function (result) {
      // result will have current state of the panel.
      setWidth();
      console.log("integration dynamics", result);
      Microsoft.CIFramework.addHandler("onclicktoact", handlerFunction);
      Microsoft.CIFramework.addHandler("manualVerificationChange", manualVerificationHanlder);
    },
    function (error) {
      // code handling for promise failure
      console.log("integration dynamics", error);
    }
  );
};

const handlerFunction = function(eventData) {
    console.log("Microsoft Dynamics Integration click to dial",eventData)
    eventEmitter.emit("clickToDialEvent",eventData);
    return Promise.resolve();
}
const manualVerificationHanlder = function(eventData) {
    console.log("Microsoft Dynamics Integration manual verification",eventData)
    eventEmitter.emit("customEvent",eventData);
    return Promise.resolve();
}

const setWidth = () => {
    Microsoft.CIFramework.setWidth(500).then(
        function (result) {
            // result will have width of the panel, in pixels.
            console.log(result)
        },
        function (error) {
            // code handling for promise failure
            console.log(error)
        });
}




